import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth, requireRole } from '../auth.js';

const router = Router();

const normalizeDateValue = (value) => value instanceof Date ? value.toISOString().slice(0, 10) : value;

router.get('/', requireAuth, async (req, res) => {
  const { club_id } = req.query;

  const params = [];
  let sql = 'SELECT * FROM clases WHERE 1 = 1';

  if (club_id) {
    sql += ' AND club_id = ?';
    params.push(club_id);
  }

  if (req.user.rol === 'entrenador') {
    sql += ' AND entrenador_id = ?';
    params.push(req.user.id);
  }

  sql += ' ORDER BY id DESC';

  const clases = await query(sql, params);
  return res.json(clases);
});

router.post('/', requireAuth, requireRole('entrenador'), async (req, res) => {
  const { club_id, cancha_id, titulo, horario, fecha, hora_inicio, hora_fin, cupos, estado } = req.body;

  if (!club_id || !titulo) {
    return res.status(400).json({ message: 'Faltan datos para crear la clase' });
  }

  const result = await query(
    `INSERT INTO clases (entrenador_id, club_id, cancha_id, titulo, horario, fecha, hora_inicio, hora_fin, cupos, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, club_id, cancha_id || null, titulo, horario || null, fecha || null, hora_inicio || null, hora_fin || null, cupos || 0, estado || 'Disponible']
  );

  const [clase] = await query('SELECT * FROM clases WHERE id = ?', [result.insertId]);
  return res.status(201).json(clase);
});

router.post('/:id/inscripciones', requireAuth, requireRole('jugador'), async (req, res) => {
  const claseId = Number(req.params.id);
  const [clase] = await query('SELECT * FROM clases WHERE id = ?', [claseId]);

  if (!clase) {
    return res.status(404).json({ message: 'Clase no encontrada' });
  }

  if (!clase.fecha || !clase.hora_inicio || !clase.hora_fin) {
    return res.status(422).json({ message: 'La clase no tiene fecha y horario configurados' });
  }

  const [inscripcionExistente] = await query(
    `SELECT id FROM inscripciones_clases
     WHERE clase_id = ? AND jugador_id = ? AND estado = 'Activa'`,
    [claseId, req.user.id]
  );

  if (inscripcionExistente) {
    return res.status(409).json({ message: 'Ya estás inscripto en esta clase' });
  }

  const [solapamiento] = await query(
    `SELECT c.id
     FROM inscripciones_clases i
     JOIN clases c ON c.id = i.clase_id
     WHERE i.jugador_id = ? AND i.estado = 'Activa'
       AND c.fecha = ?
       AND c.hora_inicio < ?
       AND c.hora_fin > ?
     LIMIT 1`,
    [req.user.id, clase.fecha, clase.hora_fin, clase.hora_inicio]
  );

  if (solapamiento) {
    return res.status(409).json({ message: 'Ya tenés un entrenamiento en ese horario' });
  }

  const [{ total }] = await query(
    `SELECT COUNT(*) AS total FROM inscripciones_clases
     WHERE clase_id = ? AND estado = 'Activa'`,
    [claseId]
  );

  if (clase.cupos > 0 && total >= clase.cupos) {
    return res.status(409).json({ message: 'No quedan cupos para esta clase' });
  }

  try {
    const result = await query(
      `INSERT INTO inscripciones_clases (clase_id, jugador_id, estado)
       VALUES (?, ?, 'Activa')`,
      [claseId, req.user.id]
    );

    const [inscripcion] = await query(
      `SELECT i.*, c.titulo, c.fecha, c.hora_inicio, c.hora_fin
       FROM inscripciones_clases i
       JOIN clases c ON c.id = i.clase_id
       WHERE i.id = ?`,
      [result.insertId]
    );

    return res.status(201).json({ ...inscripcion, fecha: normalizeDateValue(inscripcion.fecha) });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya estás inscripto en esta clase' });
    }
    throw error;
  }
});

router.delete('/:id/inscripciones', requireAuth, requireRole('jugador'), async (req, res) => {
  const claseId = Number(req.params.id);
  const result = await query(
    `UPDATE inscripciones_clases
     SET estado = 'Cancelada'
     WHERE clase_id = ? AND jugador_id = ? AND estado = 'Activa'`,
    [claseId, req.user.id]
  );

  if (!result.affectedRows) {
    return res.status(404).json({ message: 'No tenés una inscripción activa en esta clase' });
  }

  return res.json({ message: 'Inscripción cancelada' });
});

export default router;

import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth, requireRole } from '../auth.js';

const router = Router();

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
  const { club_id, cancha_id, titulo, horario, cupos, estado } = req.body;

  if (!club_id || !titulo) {
    return res.status(400).json({ message: 'Faltan datos para crear la clase' });
  }

  const result = await query(
    `INSERT INTO clases (entrenador_id, club_id, cancha_id, titulo, horario, cupos, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, club_id, cancha_id || null, titulo, horario || null, cupos || 0, estado || 'Disponible']
  );

  const [clase] = await query('SELECT * FROM clases WHERE id = ?', [result.insertId]);
  return res.status(201).json(clase);
});

export default router;

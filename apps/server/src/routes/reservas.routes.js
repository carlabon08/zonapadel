import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const { club_id } = req.query;

  const params = [];
  let sql = `
    SELECT r.*, c.nombre AS cancha_nombre, c.club_id
    FROM reservas r
    JOIN canchas c ON c.id = r.cancha_id
    WHERE 1 = 1
  `;

  if (club_id) {
    sql += ' AND c.club_id = ?';
    params.push(club_id);
  }

  if (req.user.rol === 'entrenador') {
    sql += ' AND r.entrenador_id = ?';
    params.push(req.user.id);
  }

  sql += ' ORDER BY r.fecha DESC, r.hora DESC';

  const reservas = await query(sql, params);
  return res.json(reservas);
});

router.post('/', requireAuth, async (req, res) => {
  const { cancha_id, fecha, hora, jugador_nombre, monto } = req.body;

  if (!cancha_id || !fecha || !hora) {
    return res.status(400).json({ message: 'Faltan datos para crear la reserva' });
  }

  const conflicto = await query(
    'SELECT id FROM reservas WHERE cancha_id = ? AND fecha = ? AND hora = ? AND estado != "Cancelada"',
    [cancha_id, fecha, hora]
  );

  if (conflicto.length) {
    return res.status(409).json({ message: 'Ese horario ya está reservado' });
  }

  const esEntrenador = req.user.rol === 'entrenador';
  const result = await query(
    `INSERT INTO reservas (cancha_id, usuario_id, entrenador_id, fecha, hora, jugador_nombre, estado, monto)
     VALUES (?, ?, ?, ?, ?, ?, 'Pendiente', ?)`,
    [
      cancha_id,
      esEntrenador ? null : req.user.id,
      esEntrenador ? req.user.id : null,
      fecha,
      hora,
      jugador_nombre || null,
      monto || null,
    ]
  );

  const [reserva] = await query('SELECT * FROM reservas WHERE id = ?', [result.insertId]);
  return res.status(201).json(reserva);
});

router.patch('/:id/estado', requireAuth, async (req, res) => {
  const { estado } = req.body;
  if (!['Pendiente', 'Confirmada', 'Cancelada'].includes(estado)) {
    return res.status(400).json({ message: 'Estado inválido' });
  }

  await query('UPDATE reservas SET estado = ? WHERE id = ?', [estado, req.params.id]);
  const [reserva] = await query('SELECT * FROM reservas WHERE id = ?', [req.params.id]);
  return res.json(reserva);
});

export default router;

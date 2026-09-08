import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth, requireRole } from '../auth.js';

const router = Router();

router.get('/', async (req, res) => {
  const { club_id } = req.query;
  const canchas = club_id
    ? await query('SELECT * FROM canchas WHERE club_id = ? ORDER BY nombre', [club_id])
    : await query('SELECT * FROM canchas ORDER BY club_id, nombre');
  return res.json(canchas);
});

router.patch('/:id', requireAuth, requireRole('club'), async (req, res) => {
  const { estado, horario_apertura, precio, precio_partido, precio_clase, precio_torneo } = req.body;
  const prices = [precio, precio_partido, precio_clase, precio_torneo].filter((value) => value !== undefined);
  if (prices.some((value) => !/^\$?\d+(?:\.\d{3})*(?:,\d+)?(?:\/h)?$/.test(String(value).trim()))) {
    return res.status(400).json({ message: 'El precio debe ser un monto válido' });
  }

  await query(
    `UPDATE canchas SET estado = COALESCE(?, estado), horario_apertura = COALESCE(?, horario_apertura),
     precio = COALESCE(?, precio), precio_partido = COALESCE(?, precio_partido),
     precio_clase = COALESCE(?, precio_clase), precio_torneo = COALESCE(?, precio_torneo)
     WHERE id = ?`,
    [estado || null, horario_apertura || null, precio === undefined ? null : String(precio).trim(), precio_partido === undefined ? null : String(precio_partido).trim(), precio_clase === undefined ? null : String(precio_clase).trim(), precio_torneo === undefined ? null : String(precio_torneo).trim(), req.params.id]
  );
  const [cancha] = await query('SELECT * FROM canchas WHERE id = ?', [req.params.id]);
  return res.json(cancha);
});

export default router;

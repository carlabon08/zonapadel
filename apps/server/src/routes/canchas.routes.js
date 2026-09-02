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
  const { estado, horario_apertura } = req.body;
  await query(
    'UPDATE canchas SET estado = COALESCE(?, estado), horario_apertura = COALESCE(?, horario_apertura) WHERE id = ?',
    [estado || null, horario_apertura || null, req.params.id]
  );
  const [cancha] = await query('SELECT * FROM canchas WHERE id = ?', [req.params.id]);
  return res.json(cancha);
});

export default router;

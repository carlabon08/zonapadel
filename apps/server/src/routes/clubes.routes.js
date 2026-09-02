import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../auth.js';

const router = Router();

router.get('/', async (req, res) => {
  const clubes = await query('SELECT id, nombre, ciudad, direccion, imagen FROM clubes ORDER BY nombre');
  return res.json(clubes);
});

router.get('/:id', async (req, res) => {
  const clubes = await query('SELECT id, nombre, ciudad, direccion, imagen FROM clubes WHERE id = ?', [req.params.id]);
  if (!clubes.length) {
    return res.status(404).json({ message: 'Club no encontrado' });
  }
  return res.json(clubes[0]);
});

// Clubes donde un entrenador presta servicio (requiere estar logueado)
router.get('/entrenador/mis-clubes', requireAuth, async (req, res) => {
  const clubes = await query(
    `SELECT c.id, c.nombre, c.ciudad, c.direccion, c.imagen
     FROM entrenador_clubes ec
     JOIN clubes c ON c.id = ec.club_id
     WHERE ec.usuario_id = ?`,
    [req.user.id]
  );
  return res.json(clubes);
});

// Marcar/desmarcar (check) un club como lugar donde el entrenador trabaja
router.post('/entrenador/mis-clubes/:clubId', requireAuth, async (req, res) => {
  await query(
    'INSERT IGNORE INTO entrenador_clubes (usuario_id, club_id) VALUES (?, ?)',
    [req.user.id, req.params.clubId]
  );
  return res.status(201).json({ message: 'Club agregado' });
});

router.delete('/entrenador/mis-clubes/:clubId', requireAuth, async (req, res) => {
  await query(
    'DELETE FROM entrenador_clubes WHERE usuario_id = ? AND club_id = ?',
    [req.user.id, req.params.clubId]
  );
  return res.json({ message: 'Club quitado' });
});

export default router;

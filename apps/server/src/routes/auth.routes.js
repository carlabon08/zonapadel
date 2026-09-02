import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { signToken } from '../auth.js';

const router = Router();

router.post('/registro', async (req, res) => {
  const { nombre, email, password, rol, club_id } = req.body;

  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  const existentes = await query('SELECT id FROM usuarios WHERE email = ?', [email]);
  if (existentes.length > 0) {
    return res.status(409).json({ message: 'Ya existe una cuenta con ese email' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await query(
    'INSERT INTO usuarios (nombre, email, password_hash, rol, club_id) VALUES (?, ?, ?, ?, ?)',
    [nombre, email, passwordHash, rol, club_id || null]
  );

  const user = { id: result.insertId, email, rol, club_id: club_id || null };
  const token = signToken(user);

  return res.status(201).json({ token, user: { id: user.id, nombre, email, rol, club_id: user.club_id } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
  }

  const usuarios = await query('SELECT * FROM usuarios WHERE email = ?', [email]);
  const usuario = usuarios[0];

  if (!usuario) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  const valido = await bcrypt.compare(password, usuario.password_hash);
  if (!valido) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  const token = signToken(usuario);
  return res.json({
    token,
    user: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol, club_id: usuario.club_id },
  });
});

export default router;

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'cambia-este-valor-por-uno-seguro';

export function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, rol: user.rol, club_id: user.club_id || null },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Falta el token de autenticación' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No tenés permisos para esta acción' });
    }
    return next();
  };
}

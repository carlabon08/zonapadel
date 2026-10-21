import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth, requireRole } from '../auth.js';

const router = Router();
const categories = ['5ta', '6ta', '7ma'];
const genders = ['femenino', 'masculino', 'mixto'];
const weekdays = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];

const normalizeDateValue = (value) => value instanceof Date ? value.toISOString().slice(0, 10) : value;

const getPartido = async (partidoId) => {
  const [partido] = await query(
    `SELECT p.*, c.nombre AS cancha, cl.ciudad
     FROM partidos p
     JOIN canchas c ON c.id = p.cancha_id
     JOIN clubes cl ON cl.id = c.club_id
     WHERE p.id = ?`,
    [partidoId]
  );
  return partido ? { ...partido, fecha: normalizeDateValue(partido.fecha) } : null;
};

const notifyCompatiblePlayers = async (partido) => {
  if (partido.jugadores_faltantes == null || Number(partido.jugadores_faltantes) === 0) return 0;
  const weekday = weekdays[new Date(`${normalizeDateValue(partido.fecha)}T12:00:00`).getDay()];
  const matchTime = String(partido.hora).slice(0, 5);

  const recipients = await query(
    `SELECT jugador_id FROM preferencias_partidos
     WHERE disponible = TRUE AND jugador_id != ? AND categoria = ?
       AND (? = 'mixto' OR genero = ? OR genero = 'mixto')
       AND LOWER(TRIM(ciudad)) = LOWER(TRIM(?))
       AND dia_semana = ? AND hora_desde <= ? AND hora_hasta > ?`,
     [partido.jugador_id, partido.categoria, partido.genero, partido.genero, partido.ciudad, weekday, matchTime, matchTime]
  );
  const message = `Nuevo partido ${partido.categoria} en ${partido.ciudad}: ${partido.drive_faltantes} de drive y ${partido.reves_faltantes} de revés, ${partido.fecha} a las ${String(partido.hora).slice(0, 5)}.`;
  for (const recipient of recipients) {
    await query(
      `INSERT IGNORE INTO notificaciones_partidos (jugador_id, partido_id, mensaje)
       VALUES (?, ?, ?)`,
      [recipient.jugador_id, partido.id, message]
    );
  }
  return recipients.length;
};

router.patch('/:id/necesidad-jugadores', requireAuth, requireRole('jugador'), async (req, res) => {
  const driveFaltantes = Number(req.body.drive_faltantes);
  const revesFaltantes = Number(req.body.reves_faltantes);
  const jugadoresFaltantes = driveFaltantes + revesFaltantes;
  if (![driveFaltantes, revesFaltantes].every((count) => Number.isInteger(count) && count >= 0 && count <= 3)
    || jugadoresFaltantes > 3) {
    return res.status(400).json({ message: 'Los jugadores faltantes deben sumar entre 0 y 3' });
  }

  const result = await query(
    `UPDATE partidos SET jugadores_faltantes = ?, drive_faltantes = ?, reves_faltantes = ?
     WHERE id = ? AND jugador_id = ? AND estado = 'Confirmada' AND jugadores_faltantes IS NULL`,
    [jugadoresFaltantes, driveFaltantes, revesFaltantes, req.params.id, req.user.id]
  );
  if (!result.affectedRows) return res.status(404).json({ message: 'Partido confirmado no encontrado' });

  const partido = await getPartido(req.params.id);
  const notificados = await notifyCompatiblePlayers(partido);
  return res.json({ ...partido, es_propio: true, notificados });
});

router.get('/preferencias', requireAuth, requireRole('jugador'), async (req, res) => {
  const [preferences] = await query(
     `SELECT categoria, genero, ciudad, dia_semana, hora_desde, hora_hasta,
       disponible, telefono_whatsapp, whatsapp_consentimiento
     FROM preferencias_partidos WHERE jugador_id = ?`,
    [req.user.id]
  );
  return res.json(preferences || {
    categoria: '6ta', genero: 'femenino', ciudad: '', dia_semana: '',
    hora_desde: '18:00', hora_hasta: '22:00', disponible: false,
    telefono_whatsapp: '', whatsapp_consentimiento: false,
  });
});

router.put('/preferencias', requireAuth, requireRole('jugador'), async (req, res) => {
  const { categoria, genero, ciudad, dia_semana, hora_desde, hora_hasta, disponible, telefono_whatsapp, whatsapp_consentimiento } = req.body;
  if (!categories.includes(categoria) || !genders.includes(genero) || !String(ciudad || '').trim()
    || !weekdays.includes(dia_semana) || !/^\d{2}:\d{2}$/.test(hora_desde || '')
    || !/^\d{2}:\d{2}$/.test(hora_hasta || '') || hora_desde >= hora_hasta) {
    return res.status(400).json({ message: 'Completá ciudad, categoría, género, día y un horario válido' });
  }
  const phone = String(telefono_whatsapp || '').trim();
  const whatsappConsent = whatsapp_consentimiento === true && Boolean(phone);
  const isAvailable = disponible === true;

  await query(
    `INSERT INTO preferencias_partidos
       (jugador_id, categoria, genero, ciudad, dia_semana, hora_desde, hora_hasta, disponible, telefono_whatsapp, whatsapp_consentimiento)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE categoria = VALUES(categoria), genero = VALUES(genero),
       ciudad = VALUES(ciudad), dia_semana = VALUES(dia_semana),
       hora_desde = VALUES(hora_desde), hora_hasta = VALUES(hora_hasta), disponible = VALUES(disponible),
       telefono_whatsapp = VALUES(telefono_whatsapp), whatsapp_consentimiento = VALUES(whatsapp_consentimiento)`,
    [req.user.id, categoria, genero, String(ciudad).trim(), dia_semana, hora_desde, hora_hasta, isAvailable, phone || null, whatsappConsent]
  );
  return res.json({
    categoria, genero, ciudad: String(ciudad).trim(), dia_semana, hora_desde, hora_hasta, disponible: isAvailable,
    telefono_whatsapp: phone, whatsapp_consentimiento: whatsappConsent,
  });
});

router.get('/notificaciones', requireAuth, requireRole('jugador'), async (req, res) => {
  const notifications = await query(
    `SELECT n.id, n.partido_id, n.mensaje, n.leida, n.created_at,
       p.fecha, p.hora, p.categoria, p.genero, c.nombre AS cancha, cl.ciudad
     FROM notificaciones_partidos n
     JOIN partidos p ON p.id = n.partido_id
     JOIN canchas c ON c.id = p.cancha_id
     JOIN clubes cl ON cl.id = c.club_id
     WHERE n.jugador_id = ?
     ORDER BY n.created_at DESC`,
    [req.user.id]
  );
  return res.json(notifications.map((notification) => ({
    ...notification,
    fecha: normalizeDateValue(notification.fecha),
    leida: Boolean(notification.leida),
  })));
});

router.patch('/notificaciones/:id/leida', requireAuth, requireRole('jugador'), async (req, res) => {
  const result = await query(
    'UPDATE notificaciones_partidos SET leida = TRUE WHERE id = ? AND jugador_id = ?',
    [req.params.id, req.user.id]
  );
  if (!result.affectedRows) return res.status(404).json({ message: 'Notificación no encontrada' });
  return res.json({ leida: true });
});

router.get('/club/pendientes', requireAuth, requireRole('club'), async (req, res) => {
  const partidos = await query(
    `SELECT p.*, c.nombre AS cancha, cl.nombre AS club_nombre, cl.ciudad
     FROM partidos p
     JOIN canchas c ON c.id = p.cancha_id
     JOIN clubes cl ON cl.id = c.club_id
     JOIN club_usuarios cu ON cu.club_id = cl.id
     WHERE cu.usuario_id = ? AND p.estado = 'Publicada'
     ORDER BY p.fecha, p.hora`,
    [req.user.id]
  );
  return res.json(partidos.map((partido) => ({ ...partido, fecha: normalizeDateValue(partido.fecha) })));
});

router.patch('/club/:id/confirmar', requireAuth, requireRole('club'), async (req, res) => {
  const [partido] = await query(
    `SELECT p.*, c.club_id
     FROM partidos p
     JOIN canchas c ON c.id = p.cancha_id
     JOIN club_usuarios cu ON cu.club_id = c.club_id
     WHERE p.id = ? AND cu.usuario_id = ? AND p.estado = 'Publicada'`,
    [req.params.id, req.user.id]
  );
  if (!partido) return res.status(404).json({ message: 'Partido pendiente no encontrado para este club' });

  const conflicts = await query(
    `SELECT id FROM reservas
     WHERE cancha_id = ? AND fecha = ? AND hora = ? AND estado != 'Cancelada'
     UNION ALL
     SELECT id FROM partidos
     WHERE cancha_id = ? AND fecha = ? AND hora = ? AND estado = 'Confirmada'
     LIMIT 1`,
    [partido.cancha_id, partido.fecha, partido.hora, partido.cancha_id, partido.fecha, partido.hora]
  );
  if (conflicts.length) return res.status(409).json({ message: 'Ese horario ya no está disponible' });

  await query("UPDATE partidos SET estado = 'Confirmada' WHERE id = ? AND estado = 'Publicada'", [partido.id]);
  const confirmedMatch = await getPartido(partido.id);
  const notificados = await notifyCompatiblePlayers(confirmedMatch);
  return res.json({ ...confirmedMatch, notificados });
});

router.patch('/club/:id/rechazar', requireAuth, requireRole('club'), async (req, res) => {
  const result = await query(
    `UPDATE partidos p
     JOIN canchas c ON c.id = p.cancha_id
     JOIN club_usuarios cu ON cu.club_id = c.club_id
     SET p.estado = 'Cancelada'
     WHERE p.id = ? AND cu.usuario_id = ? AND p.estado = 'Publicada'`,
    [req.params.id, req.user.id]
  );
  if (!result.affectedRows) return res.status(404).json({ message: 'Partido pendiente no encontrado para este club' });
  return res.status(204).end();
});

router.get('/', requireAuth, async (req, res) => {
  const partidos = await query(
    `SELECT p.*, c.nombre AS cancha, cl.ciudad
     FROM partidos p
     JOIN canchas c ON c.id = p.cancha_id
     JOIN clubes cl ON cl.id = c.club_id
     WHERE (p.estado = 'Confirmada' AND p.jugadores_faltantes > 0)
       OR (p.jugador_id = ? AND p.estado IN ('Publicada', 'Confirmada'))
     ORDER BY p.fecha, p.hora`,
    [req.user.id]
  );

  return res.json(partidos.map((partido) => ({
    ...partido,
    fecha: normalizeDateValue(partido.fecha),
    es_propio: Number(partido.jugador_id) === Number(req.user.id),
  })));
});

router.post('/', requireAuth, requireRole('jugador'), async (req, res) => {
  const { cancha_id, categoria, genero, fecha, hora } = req.body;
  if (!cancha_id || !categoria || !genero || !fecha || !hora) {
    return res.status(400).json({ message: 'Completá cancha, categoría, género, fecha y hora' });
  }
  if (!categories.includes(categoria) || !genders.includes(genero)) {
    return res.status(400).json({ message: 'Categoría o género inválido' });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !/^\d{2}:\d{2}$/.test(hora)) {
    return res.status(400).json({ message: 'Fecha u hora inválida' });
  }

  const [court] = await query(
    'SELECT id, estado FROM canchas WHERE id = ?',
    [cancha_id]
  );
  if (!court) return res.status(404).json({ message: 'Cancha no encontrada' });
  if (!['Abierta', 'Semicerrada'].includes(court.estado)) {
    return res.status(409).json({ message: 'La cancha no está disponible' });
  }

  const conflictos = await query(
    `SELECT id FROM reservas
     WHERE cancha_id = ? AND fecha = ? AND hora = ? AND estado != 'Cancelada'
     UNION ALL
    SELECT id FROM partidos
    WHERE cancha_id = ? AND fecha = ? AND hora = ? AND estado = 'Confirmada'
     LIMIT 1`,
    [cancha_id, fecha, hora, cancha_id, fecha, hora]
  );
  if (conflictos.length) {
    return res.status(409).json({ message: 'Ese horario ya está ocupado para la cancha' });
  }

  const result = await query(
    `INSERT INTO partidos (jugador_id, cancha_id, categoria, genero, fecha, hora, estado)
     VALUES (?, ?, ?, ?, ?, ?, 'Publicada')`,
    [req.user.id, cancha_id, categoria, genero, fecha, hora]
  );
  const partido = await getPartido(result.insertId);
  return res.status(201).json({ ...partido, es_propio: true, notificados: 0 });
});

router.delete('/:id', requireAuth, requireRole('jugador'), async (req, res) => {
  const result = await query(
    `UPDATE partidos SET estado = 'Cancelada'
    WHERE id = ? AND jugador_id = ? AND estado IN ('Publicada', 'Confirmada')`,
    [req.params.id, req.user.id]
  );
  if (!result.affectedRows) return res.status(404).json({ message: 'Partido no encontrado' });
  return res.status(204).end();
});

export default router;
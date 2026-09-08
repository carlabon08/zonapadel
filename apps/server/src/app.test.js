import bcrypt from 'bcryptjs';
import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { app } from '../server.js';
import { signToken } from './auth.js';
import { query } from './db.js';

const createdEmails = [];
const createdReservationIds = [];
const createdClassIds = [];

const nextReservationDate = (offsetDays = 0) => {
  const date = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000);
  return date.toISOString().slice(0, 10);
};

async function createUser({
  nombre = 'Usuario Test',
  email,
  password = 'Pass123!',
  rol = 'jugador',
  club_id = null,
} = {}) {
  const cleanEmail = email || `user-${Date.now()}-${Math.random()}@example.com`;
  const passwordHash = await bcrypt.hash(password, 10);

  const result = await query(
    'INSERT INTO usuarios (nombre, email, password_hash, rol, club_id) VALUES (?, ?, ?, ?, ?)',
    [nombre, cleanEmail, passwordHash, rol, club_id]
  );

  createdEmails.push(cleanEmail);
  return { id: result.insertId, email: cleanEmail, password, nombre, rol, club_id };
}

async function cleanupCreatedUsers() {
  if (!createdEmails.length) return;

  const emails = [...new Set(createdEmails)];
  for (const email of emails) {
    await query('DELETE FROM usuarios WHERE email = ?', [email]);
  }
  createdEmails.length = 0;
}

async function cleanupCreatedReservations() {
  if (!createdReservationIds.length) return;

  const ids = [...new Set(createdReservationIds)];
  for (const id of ids) {
    await query('DELETE FROM reservas WHERE id = ?', [id]);
  }
  createdReservationIds.length = 0;
}

async function cleanupCreatedClasses() {
  if (!createdClassIds.length) return;

  const ids = [...new Set(createdClassIds)];
  await query('DELETE FROM clases WHERE id IN (?)', [ids]);
  createdClassIds.length = 0;
}

afterEach(async () => {
  await cleanupCreatedClasses();
  await cleanupCreatedReservations();
  await cleanupCreatedUsers();
});

describe('GET /api/health', () => {
  it('returns the API health status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', app: 'ZonaPadel API' });
  });
});

describe('POST /api/auth/registro', () => {
  it('crea un usuario nuevo y devuelve token', async () => {
    const email = `registro-${Date.now()}@example.com`;

    const response = await request(app).post('/api/auth/registro').send({
      nombre: 'Ana Test',
      email,
      password: 'Pass123!',
      rol: 'jugador',
    });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeTruthy();
    expect(response.body.user).toMatchObject({
      nombre: 'Ana Test',
      email,
      rol: 'jugador',
    });

    const storedUser = await query('SELECT * FROM usuarios WHERE email = ?', [email]);
    expect(storedUser).toHaveLength(1);
    expect(storedUser[0].password_hash).not.toBe('Pass123!');
  });

  it('rechaza un registro con email duplicado', async () => {
    const email = `duplicado-${Date.now()}@example.com`;
    await createUser({ email, password: 'Pass123!' });

    const response = await request(app).post('/api/auth/registro').send({
      nombre: 'Otro Usuario',
      email,
      password: 'Pass456!',
      rol: 'jugador',
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Ya existe una cuenta con ese email');
  });

  it('requiere nombre, email y password en el registro', async () => {
    const response = await request(app).post('/api/auth/registro').send({
      nombre: 'Sin password',
      email: `faltan-${Date.now()}@example.com`,
      rol: 'jugador',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Faltan datos obligatorios');
  });
});

describe('POST /api/auth/login', () => {
  it('loguea un usuario válido y devuelve token', async () => {
    const email = `login-${Date.now()}@example.com`;
    await createUser({ email, password: 'Pass123!' });

    const response = await request(app).post('/api/auth/login').send({
      email,
      password: 'Pass123!',
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
    expect(response.body.user).toMatchObject({
      email,
      rol: 'jugador',
    });
  });

  it('rechaza credenciales incorrectas', async () => {
    const email = `badlogin-${Date.now()}@example.com`;
    await createUser({ email, password: 'Pass123!' });

    const response = await request(app).post('/api/auth/login').send({
      email,
      password: 'incorrecta',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Credenciales inválidas');
  });

  it('requiere email y password para hacer login', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: `sinpass-${Date.now()}@example.com`,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email y contraseña son obligatorios');
  });
});

describe('GET /api/clubes', () => {
  it('devuelve la lista de clubes', async () => {
    const response = await request(app).get('/api/clubes');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toMatchObject({
      nombre: expect.any(String),
      ciudad: expect.any(String),
    });
  });

  it('devuelve un club por id', async () => {
    const response = await request(app).get('/api/clubes/club-padel-norte');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 'club-padel-norte',
      nombre: 'Club del Padel Norte',
    });
  });

  it('devuelve 404 para un club inexistente', async () => {
    const response = await request(app).get('/api/clubes/club-inexistente');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Club no encontrado');
  });
});

describe('Clubes del entrenador', () => {
  it('requiere autenticación para listar mis clubes', async () => {
    const response = await request(app).get('/api/clubes/entrenador/mis-clubes');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Falta el token de autenticación');
  });

  it('permite asociar y quitar un club del entrenador', async () => {
    const email = `entrenador-${Date.now()}@example.com`;
    const register = await request(app).post('/api/auth/registro').send({
      nombre: 'Entrenador Test',
      email,
      password: 'Pass123!',
      rol: 'entrenador',
    });

    const token = register.body.token;

    const addResponse = await request(app)
      .post('/api/clubes/entrenador/mis-clubes/club-padel-norte')
      .set('Authorization', `Bearer ${token}`);

    expect(addResponse.status).toBe(201);
    expect(addResponse.body.message).toBe('Club agregado');

    const listResponse = await request(app)
      .get('/api/clubes/entrenador/mis-clubes')
      .set('Authorization', `Bearer ${token}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.some((club) => club.id === 'club-padel-norte')).toBe(true);

    const removeResponse = await request(app)
      .delete('/api/clubes/entrenador/mis-clubes/club-padel-norte')
      .set('Authorization', `Bearer ${token}`);

    expect(removeResponse.status).toBe(200);
    expect(removeResponse.body.message).toBe('Club quitado');
  });
});

describe('GET /api/canchas', () => {
  it('devuelve canchas del sistema', async () => {
    const response = await request(app).get('/api/canchas');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('filtra por club_id', async () => {
    const response = await request(app).get('/api/canchas?club_id=club-padel-norte');

    expect(response.status).toBe(200);
    expect(response.body.every((cancha) => cancha.club_id === 'club-padel-norte')).toBe(true);
  });
});

describe('PATCH /api/canchas/:id', () => {
  it('requiere autenticación para actualizar una cancha', async () => {
    const response = await request(app).patch('/api/canchas/1').send({
      estado: 'Cerrada',
      horario_apertura: '10:00 - 20:00',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Falta el token de autenticación');
  });

  it('solo permite actualizar canchas a usuarios con rol club', async () => {
    const registroJugador = await request(app).post('/api/auth/registro').send({
      nombre: 'Jugador Test',
      email: `club-rol-${Date.now()}@example.com`,
      password: 'Pass123!',
      rol: 'jugador',
    });

    const tokenJugador = registroJugador.body.token;

    const response = await request(app)
      .patch('/api/canchas/1')
      .set('Authorization', `Bearer ${tokenJugador}`)
      .send({
        estado: 'Cerrada',
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('No tenés permisos para esta acción');
  });

  it('actualiza una cancha cuando el usuario es club', async () => {
    const registroClub = await request(app).post('/api/auth/registro').send({
      nombre: 'Club Test',
      email: `club-${Date.now()}@example.com`,
      password: 'Pass123!',
      rol: 'club',
    });

    const tokenClub = registroClub.body.token;

    const response = await request(app)
      .patch('/api/canchas/1')
      .set('Authorization', `Bearer ${tokenClub}`)
      .send({
        estado: 'Semicerrada',
        horario_apertura: '09:00 - 21:00',
        precio: '$25.000/h',
        precio_partido: '$25.000/h',
        precio_clase: '$28.000/h',
        precio_torneo: '$32.000/h',
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 1,
      estado: 'Semicerrada',
      horario_apertura: '09:00 - 21:00',
      precio: '$25.000/h',
      precio_partido: '$25.000/h',
      precio_clase: '$28.000/h',
      precio_torneo: '$32.000/h',
    });
  });
});

describe('Reservas', () => {
  it('crea una reserva válida', async () => {
    const registroJugador = await request(app).post('/api/auth/registro').send({
      nombre: 'Jugador Reserva',
      email: `reserva-${Date.now()}@example.com`,
      password: 'Pass123!',
      rol: 'jugador',
    });

    const token = registroJugador.body.token;
    const fecha = nextReservationDate(10);
    const response = await request(app)
      .post('/api/reservas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cancha_id: 1,
        fecha,
        hora: '18:00',
        jugador_nombre: 'Jugador Reserva',
        monto: '1500',
      });

    createdReservationIds.push(response.body.id);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      cancha_id: 1,
      fecha,
      hora: '18:00',
      estado: 'Pendiente',
    });
  });

  it('rechaza una reserva duplicada en el mismo horario', async () => {
    const registroJugador = await request(app).post('/api/auth/registro').send({
      nombre: 'Jugador Duplicado',
      email: `reserva-dup-${Date.now()}@example.com`,
      password: 'Pass123!',
      rol: 'jugador',
    });

    const token = registroJugador.body.token;
    const fecha = nextReservationDate(11);

    const first = await request(app)
      .post('/api/reservas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cancha_id: 1,
        fecha,
        hora: '19:00',
        jugador_nombre: 'Jugador Duplicado',
      });

    createdReservationIds.push(first.body.id);

    const response = await request(app)
      .post('/api/reservas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cancha_id: 1,
        fecha,
        hora: '19:00',
        jugador_nombre: 'Jugador Duplicado 2',
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Ese horario ya está reservado');
  });

  it('lista reservas del usuario autenticado', async () => {
    const registroJugador = await request(app).post('/api/auth/registro').send({
      nombre: 'Jugador Listado',
      email: `reserva-list-${Date.now()}@example.com`,
      password: 'Pass123!',
      rol: 'jugador',
    });

    const token = registroJugador.body.token;
    const fecha = nextReservationDate(12);

    const created = await request(app)
      .post('/api/reservas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cancha_id: 1,
        fecha,
        hora: '20:00',
        jugador_nombre: 'Jugador Listado',
      });

    createdReservationIds.push(created.body.id);

    const response = await request(app)
      .get('/api/reservas')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((reserva) => reserva.hora === '20:00' && reserva.fecha === fecha)).toBe(true);
  });

  it('permite cambiar el estado de una reserva', async () => {
    const registroEntrenador = await request(app).post('/api/auth/registro').send({
      nombre: 'Entrenador Reserva',
      email: `reserva-estado-${Date.now()}@example.com`,
      password: 'Pass123!',
      rol: 'entrenador',
    });

    const token = registroEntrenador.body.token;
    const fecha = nextReservationDate(13);
    const created = await request(app)
      .post('/api/reservas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cancha_id: 1,
        fecha,
        hora: '21:00',
        jugador_nombre: 'Cliente Estado',
      });

    createdReservationIds.push(created.body.id);

    const response = await request(app)
      .patch(`/api/reservas/${created.body.id}/estado`)
      .set('Authorization', `Bearer ${token}`)
      .send({ estado: 'Confirmada' });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: created.body.id,
      estado: 'Confirmada',
    });
  });
});

describe('Clases', () => {
  it('lista clases del entrenador autenticado', async () => {
    const registroEntrenador = await request(app).post('/api/auth/registro').send({
      nombre: 'Entrenador Clase',
      email: `clase-list-${Date.now()}@example.com`,
      password: 'Pass123!',
      rol: 'entrenador',
    });

    const token = registroEntrenador.body.token;

    const response = await request(app)
      .get('/api/clases')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('requiere autenticación para ver clases', async () => {
    const response = await request(app).get('/api/clases');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Falta el token de autenticación');
  });

  it('crea una clase con datos mínimos', async () => {
    const registroEntrenador = await request(app).post('/api/auth/registro').send({
      nombre: 'Entrenador Clase Crear',
      email: `clase-create-${Date.now()}@example.com`,
      password: 'Pass123!',
      rol: 'entrenador',
    });

    const token = registroEntrenador.body.token;

    const response = await request(app)
      .post('/api/clases')
      .set('Authorization', `Bearer ${token}`)
      .send({
        club_id: 'club-padel-norte',
        titulo: 'Clase de prueba',
        horario: 'Lunes 18:00',
        cupos: 8,
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      titulo: 'Clase de prueba',
      club_id: 'club-padel-norte',
      estado: 'Disponible',
    });
  });

  it('requiere permisos de entrenador para crear clases', async () => {
    const registroJugador = await request(app).post('/api/auth/registro').send({
      nombre: 'Jugador Sin Permiso',
      email: `clase-no-admin-${Date.now()}@example.com`,
      password: 'Pass123!',
      rol: 'jugador',
    });

    const token = registroJugador.body.token;

    const response = await request(app)
      .post('/api/clases')
      .set('Authorization', `Bearer ${token}`)
      .send({
        club_id: 'club-padel-norte',
        titulo: 'Clase no permitida',
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('No tenés permisos para esta acción');
  });

  it('requiere club_id y titulo para crear clase', async () => {
    const registroEntrenador = await request(app).post('/api/auth/registro').send({
      nombre: 'Entrenador Validación',
      email: `clase-validacion-${Date.now()}@example.com`,
      password: 'Pass123!',
      rol: 'entrenador',
    });

    const token = registroEntrenador.body.token;

    const response = await request(app)
      .post('/api/clases')
      .set('Authorization', `Bearer ${token}`)
      .send({
        titulo: 'Sin club_id',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Faltan datos para crear la clase');
  });

  it('persiste la inscripción y rechaza otra clase superpuesta', async () => {
    const entrenador = await createUser({ rol: 'entrenador', nombre: 'Entrenador Inscripciones' });
    const jugador = await createUser({ rol: 'jugador', nombre: 'Jugador Inscripciones' });
    const entrenadorToken = signToken(entrenador);
    const jugadorToken = signToken(jugador);
    const fecha = nextReservationDate(2);

    const crearClase = async (titulo, hora_inicio, hora_fin) => {
      const response = await request(app)
        .post('/api/clases')
        .set('Authorization', `Bearer ${entrenadorToken}`)
        .send({ club_id: 'club-padel-norte', titulo, fecha, hora_inicio, hora_fin, cupos: 2 });

      expect(response.status).toBe(201);
      createdClassIds.push(response.body.id);
      return response.body.id;
    };

    const primeraClaseId = await crearClase('Clase persistida', '18:00', '19:00');
    const segundaClaseId = await crearClase('Clase superpuesta', '18:30', '19:30');

    const primeraInscripcion = await request(app)
      .post(`/api/clases/${primeraClaseId}/inscripciones`)
      .set('Authorization', `Bearer ${jugadorToken}`);

    expect(primeraInscripcion.status).toBe(201);
    expect(primeraInscripcion.body).toMatchObject({
      clase_id: primeraClaseId,
      jugador_id: jugador.id,
      estado: 'Activa',
      fecha,
    });

    const storedEnrollment = await query('SELECT * FROM inscripciones_clases WHERE id = ?', [primeraInscripcion.body.id]);
    expect(storedEnrollment).toHaveLength(1);

    const duplicate = await request(app)
      .post(`/api/clases/${primeraClaseId}/inscripciones`)
      .set('Authorization', `Bearer ${jugadorToken}`);
    expect(duplicate.status).toBe(409);
    expect(duplicate.body.message).toBe('Ya estás inscripto en esta clase');

    const overlapping = await request(app)
      .post(`/api/clases/${segundaClaseId}/inscripciones`)
      .set('Authorization', `Bearer ${jugadorToken}`);
    expect(overlapping.status).toBe(409);
    expect(overlapping.body.message).toBe('Ya tenés un entrenamiento en ese horario');

    const cancelled = await request(app)
      .delete(`/api/clases/${primeraClaseId}/inscripciones`)
      .set('Authorization', `Bearer ${jugadorToken}`);
    expect(cancelled.status).toBe(200);
    expect(cancelled.body.message).toBe('Inscripción cancelada');

    const storedCancelled = await query(
      'SELECT estado FROM inscripciones_clases WHERE clase_id = ? AND jugador_id = ?',
      [primeraClaseId, jugador.id]
    );
    expect(storedCancelled[0].estado).toBe('Cancelada');
  });
});

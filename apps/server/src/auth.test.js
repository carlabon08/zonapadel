import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../server.js';
import { query } from './db.js';

const uniqueEmail = () => `test-${Date.now()}-${Math.random().toString(36).slice(2, 10)}@example.com`;

const cleanTestUsers = async () => {
  await query('DELETE FROM usuarios WHERE email LIKE ?', ['test-%@example.com']);
};

beforeEach(async () => {
  await cleanTestUsers();
});

afterEach(async () => {
  await cleanTestUsers();
});

describe('POST /api/auth/registro', () => {
  it('registra un usuario válido y devuelve token', async () => {
    const email = uniqueEmail();

    const response = await request(app).post('/api/auth/registro').send({
      nombre: 'Ana Test',
      email,
      password: '123456',
      rol: 'jugador',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user).toMatchObject({
      nombre: 'Ana Test',
      email,
      rol: 'jugador',
    });
  });

  it('rechaza un email duplicado', async () => {
    const email = uniqueEmail();

    await request(app).post('/api/auth/registro').send({
      nombre: 'Usuario Uno',
      email,
      password: '123456',
      rol: 'jugador',
    });

    const response = await request(app).post('/api/auth/registro').send({
      nombre: 'Usuario Dos',
      email,
      password: '654321',
      rol: 'jugador',
    });

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({ message: 'Ya existe una cuenta con ese email' });
  });

  it('requiere datos obligatorios', async () => {
    const response = await request(app).post('/api/auth/registro').send({
      nombre: 'Sin email',
      password: '123456',
      rol: 'jugador',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ message: 'Faltan datos obligatorios' });
  });
});

describe('POST /api/auth/login', () => {
  it('loguea con credenciales válidas', async () => {
    const email = uniqueEmail();

    await request(app).post('/api/auth/registro').send({
      nombre: 'Lucas Login',
      email,
      password: '123456',
      rol: 'club',
    });

    const response = await request(app).post('/api/auth/login').send({
      email,
      password: '123456',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toMatchObject({
      nombre: 'Lucas Login',
      email,
      rol: 'club',
    });
  });

  it('rechaza credenciales inválidas', async () => {
    const email = uniqueEmail();

    await request(app).post('/api/auth/registro').send({
      nombre: 'Usuario Fallido',
      email,
      password: '123456',
      rol: 'jugador',
    });

    const response = await request(app).post('/api/auth/login').send({
      email,
      password: 'wrong-password',
    });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ message: 'Credenciales inválidas' });
  });

  it('requiere email y contraseña', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'algo@example.com',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ message: 'Email y contraseña son obligatorios' });
  });
});

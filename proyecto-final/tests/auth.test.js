const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});
afterEach(async () => {
  for (const col of Object.values(mongoose.connection.collections)) {
    await col.deleteMany({});
  }
});

describe('Autenticación', () => {
  test('registro crea usuario y devuelve token', async () => {
    const res = await request(app)
      .post('/auth/register').set('Accept', 'application/json')
      .send({ nombre: 'Ana', email: 'ana@test.com', password: 'password123', passwordConfirm: 'password123' });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.password).toBeUndefined();
  });

  test('login con credenciales correctas devuelve token', async () => {
    await request(app).post('/auth/register').set('Accept', 'application/json')
      .send({ nombre: 'Ana', email: 'ana@test.com', password: 'password123', passwordConfirm: 'password123' });
    const res = await request(app).post('/auth/login').set('Accept', 'application/json')
      .send({ email: 'ana@test.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('login con credenciales inválidas → 401', async () => {
    const res = await request(app).post('/auth/login').set('Accept', 'application/json')
      .send({ email: 'no@existe.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  test('registro con validación fallida → 422', async () => {
    const res = await request(app).post('/auth/register').set('Accept', 'application/json')
      .send({ nombre: 'A', email: 'no-mail', password: '123', passwordConfirm: '456' });
    expect(res.status).toBe(422);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});
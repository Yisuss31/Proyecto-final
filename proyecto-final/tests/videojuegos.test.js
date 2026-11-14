const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');

let mongo, userToken, adminToken, createdId;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());

  // Usuario normal
  const u = await request(app).post('/auth/register').set('Accept', 'application/json')
    .send({ nombre: 'User', email: 'user@t.com', password: 'password123', passwordConfirm: 'password123' });
  userToken = u.body.token;

  // Admin
  await request(app).post('/auth/register').set('Accept', 'application/json')
    .send({ nombre: 'Admin', email: 'admin@t.com', password: 'password123', passwordConfirm: 'password123' });
  await mongoose.connection.collection('users').updateOne({ email: 'admin@t.com' }, { $set: { rol: 'admin' } });
  const al = await request(app).post('/auth/login').set('Accept', 'application/json')
    .send({ email: 'admin@t.com', password: 'password123' });
  adminToken = al.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

test('crear sin auth → 401', async () => {
  const res = await request(app).post('/videojuegos').set('Accept', 'application/json').send({});
  expect(res.status).toBe(401);
});

test('crear autenticado → 201', async () => {
  const res = await request(app).post('/videojuegos')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${userToken}`)
    .send({ titulo: 'Zelda', plataforma: 'Switch', genero: 'Aventura', anio: 2017, rating: 9.8 });
  expect(res.status).toBe(201);
  expect(res.body._id).toBeDefined();
  createdId = res.body._id;
});

test('listado público devuelve items y metadatos de paginación', async () => {
  const res = await request(app).get('/videojuegos').set('Accept', 'application/json');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.items)).toBe(true);
  expect(res.body).toHaveProperty('totalPages');
});

test('usuario no propietario no puede editar → 403', async () => {
  await request(app).post('/auth/register').set('Accept', 'application/json')
    .send({ nombre: 'Otro', email: 'otro@t.com', password: 'password123', passwordConfirm: 'password123' });
  const login = await request(app).post('/auth/login').set('Accept', 'application/json')
    .send({ email: 'otro@t.com', password: 'password123' });
  const otherToken = login.body.token;

  const res = await request(app).put(`/videojuegos/${createdId}`)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${otherToken}`)
    .send({ titulo: 'Hack', plataforma: 'X', genero: 'Y', anio: 2020 });
  expect(res.status).toBe(403);
});

test('admin puede borrar cualquier item → 204', async () => {
  const res = await request(app).delete(`/videojuegos/${createdId}`)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${adminToken}`);
  expect(res.status).toBe(204);
});
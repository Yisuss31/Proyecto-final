const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

async function register({ nombre, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('El email ya está registrado');
    err.code = 11000;
    throw err;
  }
  const user = await User.create({ nombre, email, password });
  return { user, token: signToken(user) };
}

async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const err = new Error('Credenciales inválidas');
    err.status = 401;
    throw err;
  }
  const ok = await user.comparePassword(password);
  if (!ok) {
    const err = new Error('Credenciales inválidas');
    err.status = 401;
    throw err;
  }
  user.password = undefined;
  return { user, token: signToken(user) };
}

module.exports = { register, login, signToken };
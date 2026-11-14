const { validationResult } = require('express-validator');
const authService = require('../services/authService');
const { wantsJson } = require('../middlewares/auth');

const COOKIE_NAME = 'token';
const cookieOpts = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 1000 * 60 * 60 * 24
});

exports.showRegister = (req, res) =>
  res.render('auth/register', { title: 'Registro', errors: [], values: {} });

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (wantsJson(req)) return res.status(422).json({ errors: errors.array() });
      return res.status(422).render('auth/register', {
        title: 'Registro', errors: errors.array(), values: req.body
      });
    }
    const { user, token } = await authService.register(req.body);
    res.cookie(COOKIE_NAME, token, cookieOpts());
    if (wantsJson(req)) return res.status(201).json({ user, token });
    req.flash('success', '¡Bienvenido a Arcade Vault!');
    res.redirect('/videojuegos');
  } catch (err) {
    if (err.code === 11000) {
      const msg = [{ msg: 'El email ya está registrado', path: 'email' }];
      if (wantsJson(req)) return res.status(409).json({ errors: msg });
      return res.status(409).render('auth/register', {
        title: 'Registro', errors: msg, values: req.body
      });
    }
    next(err);
  }
};

exports.showLogin = (req, res) =>
  res.render('auth/login', { title: 'Iniciar sesión', errors: [], values: {} });

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (wantsJson(req)) return res.status(422).json({ errors: errors.array() });
      return res.status(422).render('auth/login', {
        title: 'Login', errors: errors.array(), values: req.body
      });
    }
    const { user, token } = await authService.login(req.body);
    res.cookie(COOKIE_NAME, token, cookieOpts());
    if (wantsJson(req)) return res.json({ user, token });
    req.flash('success', `Hola de nuevo, ${user.nombre}`);
    res.redirect('/videojuegos');
  } catch (err) {
    if (err.status === 401) {
      const msg = [{ msg: err.message }];
      if (wantsJson(req)) return res.status(401).json({ errors: msg });
      return res.status(401).render('auth/login', {
        title: 'Login', errors: msg, values: req.body
      });
    }
    next(err);
  }
};

exports.logout = (req, res) => {
  res.clearCookie(COOKIE_NAME);
  req.flash('info', 'Sesión cerrada');
  res.redirect('/');
};
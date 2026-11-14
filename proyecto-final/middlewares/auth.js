const jwt = require('jsonwebtoken');
const User = require('../models/User');

function extractToken(req) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) return header.slice(7);
  if (req.cookies && req.cookies.token) return req.cookies.token;
  return null;
}

async function parseUser(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) return next();
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (user) req.user = user;
  } catch { /* token inválido → sigue como anónimo */ }
  next();
}

function wantsJson(req) {
  return (req.headers.accept || '').includes('application/json');
}

function requireAuth(req, res, next) {
  if (!req.user) {
    if (wantsJson(req)) return res.status(401).json({ error: 'No autenticado' });
    return res.redirect('/auth/login');
  }
  next();
}

async function setLocals(req, res, next) {
  await parseUser(req, res, () => {});
  res.locals.currentUser = req.user || null;
  res.locals.flash = {
    success: req.flash('success'),
    error: req.flash('error'),
    info: req.flash('info')
  };
  next();
}

module.exports = { extractToken, parseUser, requireAuth, setLocals, wantsJson };
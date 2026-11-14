const { wantsJson } = require('./auth');

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return wantsJson(req)
        ? res.status(401).json({ error: 'No autenticado' })
        : res.redirect('/auth/login');
    }
    if (!roles.includes(req.user.rol)) {
      if (wantsJson(req)) return res.status(403).json({ error: 'Sin permisos' });
      req.flash('error', 'No tienes permisos para esta acción');
      return res.redirect('/videojuegos');
    }
    next();
  };
}

function requireOwnership() {
  return (req, res, next) => {
    if (!req.user) {
      return wantsJson(req)
        ? res.status(401).json({ error: 'No autenticado' })
        : res.redirect('/auth/login');
    }
    if (req.user.rol === 'admin') return next();

    const ownerId = req.resource?.propietario?._id || req.resource?.propietario;
    if (!ownerId || String(ownerId) !== String(req.user._id)) {
      const err = new Error('No autorizado para modificar este recurso');
      err.status = 403;
      return next(err);
    }
    next();
  };
}

module.exports = { requireRole, requireOwnership };
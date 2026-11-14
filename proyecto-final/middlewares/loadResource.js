const Videojuego = require('../models/Videojuego');

async function loadVideojuego(req, res, next) {
  try {
    const item = await Videojuego.findById(req.params.id);
    if (!item) {
      const err = new Error('Videojuego no encontrado');
      err.status = 404;
      throw err;
    }
    req.resource = item;
    next();
  } catch (err) {
    
    if (err.name === 'CastError') {
      err.status = 404;
      err.message = 'Videojuego no encontrado';
    }
    next(err);
  }
}

module.exports = { loadVideojuego };
const mongoose = require('mongoose');

const videojuegoSchema = new mongoose.Schema({
  titulo:        { type: String, required: true, trim: true, maxlength: 120, index: true },
  plataforma:    { type: String, required: true, trim: true, maxlength: 60, index: true },
  genero:        { type: String, required: true, trim: true, maxlength: 60, index: true },
  anio:          { type: Number, required: true, min: 1970, max: new Date().getFullYear() },
  desarrollador: { type: String, trim: true, maxlength: 120 },
  descripcion:   { type: String, trim: true, maxlength: 2000 },
  rating:        { type: Number, min: 0, max: 10, default: 0 },
  imagen:        { type: String, default: null },
  propietario:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
}, { timestamps: true });

videojuegoSchema.index({ titulo: 'text', descripcion: 'text' });

module.exports = mongoose.model('Videojuego', videojuegoSchema);
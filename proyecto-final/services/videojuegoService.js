
const path = require('path');
const fs = require('fs/promises');
const Videojuego = require('../models/Videojuego');

async function list({ search, genero, plataforma, page, limit, propietario } = {}) {
  const filter = {};
  if (propietario) filter.propietario = propietario;
  if (search) {
    filter.$or = [
      { titulo: { $regex: search, $options: 'i' } },
      { desarrollador: { $regex: search, $options: 'i' } }
    ];
  }
  if (genero) filter.genero = genero;
  if (plataforma) filter.plataforma = plataforma;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 9));

  const [total, items] = await Promise.all([
    Videojuego.countDocuments(filter),
    Videojuego.find(filter)
      .populate('propietario', 'nombre email')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean()
  ]);

  return {
    items,
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: Math.max(1, Math.ceil(total / limitNum))
  };
}

async function getById(id) {
  return Videojuego.findById(id).populate('propietario', 'nombre email');
}

async function create(data, userId, file) {
  const payload = { ...data, propietario: userId };
  if (file) payload.imagen = `/uploads/${file.filename}`;
  return Videojuego.create(payload);
}

async function update(id, data, file) {
  const item = await Videojuego.findById(id);
  if (!item) {
    const err = new Error('Videojuego no encontrado');
    err.status = 404;
    throw err;
  }
  const allowed = ['titulo', 'plataforma', 'genero', 'anio', 'desarrollador', 'descripcion', 'rating'];
  allowed.forEach((k) => {
    if (data[k] !== undefined) item[k] = data[k];
  });
  if (file) {
    if (item.imagen) await deleteImageFile(item.imagen);
    item.imagen = `/uploads/${file.filename}`;
  }
  await item.save();
  return item;
}

async function remove(id) {
  const item = await Videojuego.findById(id);
  if (!item) {
    const err = new Error('Videojuego no encontrado');
    err.status = 404;
    throw err;
  }
  if (item.imagen) await deleteImageFile(item.imagen);
  await item.deleteOne();
  return item;
}

async function distinctValues(field) {
  return Videojuego.distinct(field);
}

async function deleteImageFile(webPath) {
  try {
    const full = path.join(__dirname, '..', 'public', webPath.replace(/^\//, ''));
    await fs.unlink(full);
  } catch { /* ignora si ya no existe */ }
}

module.exports = { list, getById, create, update, remove, distinctValues };
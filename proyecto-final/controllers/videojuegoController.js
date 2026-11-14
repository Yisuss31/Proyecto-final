
const { validationResult } = require('express-validator');
const servicio = require('../services/videojuegoService');
const { wantsJson } = require('../middlewares/auth');

exports.index = async (req, res, next) => {
  try {
    const { search, genero, plataforma, page, limit, mine } = req.query;
    const propietario = (mine === '1' && req.user) ? req.user._id : null;

    const result = await servicio.list({ search, genero, plataforma, page, limit, propietario });
    const [generos, plataformas] = await Promise.all([
      servicio.distinctValues('genero'),
      servicio.distinctValues('plataforma')
    ]);

    if (wantsJson(req)) return res.json(result);

    res.render('videojuegos/index', {
      title: 'Colección',
      ...result,
      filters: {
        search: search || '',
        genero: genero || '',
        plataforma: plataforma || '',
        mine: mine === '1'
      },
      generos, plataformas
    });
  } catch (err) { next(err); }
};

exports.show = async (req, res, next) => {
  try {
    const item = await servicio.getById(req.params.id);
    if (!item) {
      const err = new Error('Videojuego no encontrado');
      err.status = 404;
      throw err;
    }
    if (wantsJson(req)) return res.json(item);
    res.render('videojuegos/show', { title: item.titulo, item });
  } catch (err) { next(err); }
};

exports.newForm = (req, res) =>
  res.render('videojuegos/new', { title: 'Nuevo videojuego', errors: [], values: {} });

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (wantsJson(req)) return res.status(422).json({ errors: errors.array() });
      return res.status(422).render('videojuegos/new', {
        title: 'Nuevo videojuego', errors: errors.array(), values: req.body
      });
    }
    const item = await servicio.create(req.body, req.user._id, req.file);
    if (wantsJson(req)) return res.status(201).json(item);
    req.flash('success', 'Videojuego añadido');
    res.redirect(`/videojuegos/${item._id}`);
  } catch (err) { next(err); }
};

exports.editForm = async (req, res, next) => {
  try {
    const item = await servicio.getById(req.params.id);
    if (!item) { const e = new Error('No encontrado'); e.status = 404; throw e; }
    res.render('videojuegos/edit', {
      title: `Editar: ${item.titulo}`, item, errors: [], values: item
    });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (wantsJson(req)) return res.status(422).json({ errors: errors.array() });
      const item = await servicio.getById(req.params.id);
      return res.status(422).render('videojuegos/edit', {
        title: 'Editar', item, errors: errors.array(), values: req.body
      });
    }
    const item = await servicio.update(req.params.id, req.body, req.file);
    if (wantsJson(req)) return res.json(item);
    req.flash('success', 'Videojuego actualizado');
    res.redirect(`/videojuegos/${item._id}`);
  } catch (err) { next(err); }
};

exports.destroy = async (req, res, next) => {
  try {
    await servicio.remove(req.params.id);
    if (wantsJson(req)) return res.status(204).end();
    req.flash('success', 'Videojuego eliminado');
    res.redirect('/videojuegos');
  } catch (err) { next(err); }
};
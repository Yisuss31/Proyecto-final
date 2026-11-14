const express = require('express');
const router = express.Router();
const controller = require('../controllers/videojuegoController');
const { requireAuth } = require('../middlewares/auth');
const { requireOwnership } = require('../middlewares/roles');
const { loadVideojuego } = require('../middlewares/loadResource');
const { videojuegoRules } = require('../middlewares/validators');
const upload = require('../middlewares/upload');

router.get('/', controller.index);
router.get('/:id', controller.show);

router.get('/nuevo', requireAuth, controller.newForm);
router.post('/',
  requireAuth,
  upload.single('imagen'),
  videojuegoRules,
  controller.create
);

router.get('/:id/editar',
  requireAuth,
  loadVideojuego,
  requireOwnership(),
  controller.editForm
);

router.put('/:id',
  requireAuth,
  loadVideojuego,
  requireOwnership(),
  upload.single('imagen'),
  videojuegoRules,
  controller.update
);

router.delete('/:id',
  requireAuth,
  loadVideojuego,
  requireOwnership(),
  controller.destroy
);

module.exports = router;
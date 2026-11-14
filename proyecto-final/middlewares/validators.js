const { body } = require('express-validator');

const registerRules = [
  body('nombre').trim().isLength({ min: 2, max: 80 }).withMessage('Nombre entre 2 y 80 caracteres'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('passwordConfirm').custom((v, { req }) => {
    if (v !== req.body.password) throw new Error('Las contraseñas no coinciden');
    return true;
  })
];

const loginRules = [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').notEmpty().withMessage('Contraseña requerida')
];

const videojuegoRules = [
  body('titulo').trim().isLength({ min: 2, max: 120 }).withMessage('Título requerido (2-120)'),
  body('plataforma').trim().notEmpty().withMessage('Plataforma requerida'),
  body('genero').trim().notEmpty().withMessage('Género requerido'),
  body('anio').isInt({ min: 1970, max: new Date().getFullYear() })
    .withMessage(`Año inválido (1970-${new Date().getFullYear()})`),
  body('desarrollador').optional({ checkFalsy: true }).trim().isLength({ max: 120 }),
  body('descripcion').optional({ checkFalsy: true }).trim().isLength({ max: 2000 }),
  body('rating').optional({ checkFalsy: true }).isFloat({ min: 0, max: 10 })
    .withMessage('Rating entre 0 y 10')
];

module.exports = { registerRules, loginRules, videojuegoRules };
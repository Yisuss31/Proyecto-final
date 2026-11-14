const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const { registerRules, loginRules } = require('../middlewares/validators');

router.get('/register', controller.showRegister);
router.post('/register', registerRules, controller.register);

router.get('/login', controller.showLogin);
router.post('/login', loginRules, controller.login);

router.post('/logout', controller.logout);
router.get('/logout', controller.logout);

module.exports = router;
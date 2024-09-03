const router = require('express').Router();
const { query, body } = require('express-validator');

const controller = require('../controllers/userController');
// const { validation } = require('../middlewares/validationMiddleware');



router.post('/registerUser', [
    body('email').notEmpty(),
    body('password').notEmpty(),
    body('name').notEmpty(),
    body('img').notEmpty(),
    body('address').notEmpty(),
    body('phoneNumber').notEmpty(),
    
], controller.registerUser);

router.post('/loginUser', [
    body('email').notEmpty(),
    body('password').notEmpty(),
], controller.loginUser);

module.exports = router;
const router = require('express').Router();
const { query, body } = require('express-validator');

const controller = require('../controllers/orderController');
// const { validation } = require('../middlewares/validationMiddleware');

router.get('/getOrdersByUser', [
    query('userId').notEmpty(),
    query('status').notEmpty(),
],  controller.getOrdersByUser);

router.post('/createOrder', [
    body('userId').notEmpty(),
    body('productId').notEmpty(),
    body('quantity').notEmpty(),
], controller.createOrder);

router.post('/deleteOrder', [
    body('idorder').notEmpty(),
],  controller.deleteOrder);

module.exports = router;
const router = require('express').Router();
const { query, body } = require('express-validator');

const controller = require('../controllers/paymentController');
// const { validation } = require('../middlewares/validationMiddleware');

router.post('/createPayment', [
    body('userId').notEmpty(),
    body('orderId').notEmpty(),
    body('paymentMethod').notEmpty(),
    body('amount').notEmpty(),
], controller.createPayment);

router.get('/paymentsDetail', [
    query('paymentId').notEmpty(),
],  controller.paymentsDetail);

router.post('/completePayment', [
    body('paymentId').notEmpty(),
],  controller.completePayment);



module.exports = router;
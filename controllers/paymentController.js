const Payment = require('../models/paymentModel'); // ใช้ชื่อโมเดลให้ถูกต้อง
const Order = require('../models/bookOrderModel'); // ใช้ชื่อโมเดลให้ถูกต้อง
// const {processPayment } = require('../helpers/helper')

exports.createPayment = async (req, res, next) => {
    try {
        const { userId, orderId, paymentMethod , amount} = req.body;
        // console.log(orderId);
        // ดึงข้อมูลออเดอร์ทั้งหมดตาม orderId
        const orders = await Order.find({ _id: { $in: orderId } });
        // console.log(orders);
        if (orders.length === 0) {
            return res.status(404).send({
                message: 'Orders not found',
            });
        }

        // สร้างรายการชำระเงินในฐานข้อมูล
        const newPayment = new Payment({
            userId,
            orderIds: orderId, 
            paymentMethod,
            amount: amount, // ใช้จำนวนเงินรวมที่คำนวณได้
            status: 'pending',
            transactionId: 'temp-transaction-id', // ใช้ค่า placeholder สำหรับตอนนี้
        });

        await newPayment.save();

        // อัปเดตสถานะของแต่ละออเดอร์
        await Order.updateMany(
            { _id: { $in: orderId } },
            { status: 'pending' }
        );

        res.status(201).send({
            message: 'Payment recorded successfully',
            data: newPayment,
        });

    } catch (error) {
        console.error('Error creating payment:', error.message);
        next(error);
    }
}


exports.paymentsDetail = async (req, res, next) => {
    try {
        const { paymentId } = req.query;

        // ค้นหาการชำระเงินทั้งหมดของผู้ใช้
        const payments = await Payment.findById( paymentId );
        
        if (payments) {
            res.status(200).send({
                message: 'Payments fetched successfully',
                data: payments,
            });
        } else {
            res.status(404).send({
                message: 'No payments found for this user',
            });
        }
    } catch (error) {
        console.error('Error fetching payments:', error.message);
        next(error);
    }
}

exports.completePayment = async (req, res, next) => {
    try {
        const { paymentId } = req.body;

        // ค้นหาการชำระเงินโดยใช้ paymentId
        const payment = await Payment.findById(paymentId);
        
        if (payment) {
            // อัปเดตสถานะการชำระเงินเป็น completed
            payment.status = 'completed';
            await payment.save();

            // อัปเดตสถานะของทุก order ที่อยู่ใน payment.orderIds เป็น completed
            await Order.updateMany(
                { _id: { $in: payment.orderIds } },  // เงื่อนไขการค้นหา order
                { status: 'completed' }              // การอัปเดตสถานะเป็น completed
            );

            res.status(200).send({
                message: 'Payment and associated orders marked as completed',
                data: payment,
            });
        } else {
            res.status(404).send({
                message: 'Payment not found',
            });
        }
    } catch (error) {
        console.error('Error completing payment:', error.message);
        next(error);
    }
}

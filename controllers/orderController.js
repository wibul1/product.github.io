const BookProduct = require('../models/bookProductModel'); // ใช้ชื่อโมเดลให้ถูกต้อง
const BookOrder = require('../models/bookOrderModel'); // ใช้ชื่อโมเดลให้ถูกต้อง


exports.createOrder = async (req, res, next) => {
    try {
        const { userId, productId, quantity } = req.body;

        // ตรวจสอบว่าผลิตภัณฑ์ที่ต้องการสั่งซื้อมีอยู่ในระบบหรือไม่
        const product = await BookProduct.findById(productId);
        if (!product) {
            return res.status(404).send({
                message: 'Product not found',
            });
        }

        // คำนวณราคาสินค้ารวม
        const sumPrice = (product.price * quantity).toFixed(2);

        // สร้างและบันทึกออเดอร์ใหม่
        const newOrder = new BookOrder({
            userId,
            productId: {
                name: product.name,
                img: product.img,
                price: product.price,
            },
            quantity,
            sumPrice,
            status: 'pending',
        });

        await newOrder.save();

        res.status(201).send({
            message: 'Order created successfully',
            data: newOrder,
        });
    } catch (error) {
        console.error('Error creating order:', error.message);
        next(error);
    }
}

exports.getOrdersByUser = async (req, res, next) => {
    try {
        const { userId , status } = req.query;

        // ค้นหาออเดอร์ทั้งหมดของผู้ใช้
        const orders = await BookOrder.find({ userId:userId, status:status });

        if (orders.length > 0) {
            res.status(200).send({
                message: 'Orders fetched successfully',
                data: orders,
            });
        } else {
            res.status(404).send({
                message: 'No orders found for this user',
            });
        }
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        next(error);
    }
}

exports.deleteOrder = async (req, res, next) => {
    try {
        const { idorder } = req.body;
        
        const order = await BookOrder.findById(idorder);
        
        if (!order) {
            return res.status(404).send({
                code: 404,
                message: 'Order not found',
            });
        }

        // เปลี่ยนสถานะของ order เป็น "deleted"
        order.status = "deleted";
        
        // บันทึกการเปลี่ยนแปลง
        const updatedOrder = await order.save();
        if (!updatedOrder) {
            return res.status(404).send({
                code: 404,
                message: 'deleted Order not found',
            });
        }
        res.status(200).send({
            message: 'Order deleted successfully',
            data: updatedOrder,
        });

    } catch (e) {
        console.error('Error deleting order', e.message);
        next(e);
    }
}

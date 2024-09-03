const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    userId: { type: String, required: true },
    orderIds: [{ type: String, required: true }], // เปลี่ยนเป็น array เพื่อเก็บหลาย order IDs
    paymentMethod: { type: String, required: true }, 
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    transactionId: { type: String, required: true }, 
    paymentDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('payments', PaymentSchema);

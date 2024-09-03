const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: String,
    img: String,
    price: Number,
});

const BookOrderSchema = new Schema({
    userId: String,
    productId: ProductSchema,
    quantity: String,
    sumPrice: String,
    status: String,
    create_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('bookorders', BookOrderSchema);

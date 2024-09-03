const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookProductSchema = new Schema({
    name: String,
    img: String,
    author: String,
    format: String,
    book_depository_stars: Number,
    price: Number,
    old_price: Number,
    category: String,
    create_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('bookProducts', BookProductSchema);

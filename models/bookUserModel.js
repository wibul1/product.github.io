const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookUserSchema = new Schema({
    email: String,
    password: String,
    name: String,
    tpye: String,
    create_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('bookUsers', BookUserSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AutenSchema = new Schema({
    email: String,
    password: String,
    token: String,
});

const UserSchema = new Schema({
    name: String,
    img: String,
    address: String,
    phoneNumber: String,
    auten: AutenSchema,
    status: String,
    create_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('users', UserSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Poster = new Schema({
    name: String,
    img: String,
    status:String,
    create_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('posters', Poster);

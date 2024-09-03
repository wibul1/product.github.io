const mongoose = require('mongoose');
const {MONGO_URI} = process.env;

exports.connectToDb = async () => {
    await mongoose.connect(MONGO_URI, {
    })
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });
}
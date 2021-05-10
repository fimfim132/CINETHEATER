var mongoose = require('mongoose');

var availableSchema = new mongoose.Schema({
    img: String,
    title: String,
    year: String,
    rate: String
});

module.exports = mongoose.model('Available', availableSchema);
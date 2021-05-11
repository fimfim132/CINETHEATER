var mongoose = require('mongoose');

var recommendSchema = new mongoose.Schema({
    img: String,
    title: String,
    year: String,
    rate: String
});

module.exports = mongoose.model('Recommend', recommendSchema);
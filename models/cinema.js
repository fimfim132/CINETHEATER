var mongoose = require('mongoose');

var cinemaSchema = new mongoose.Schema({
    name: String
});

module.exports = mongoose.model('Cinema', cinemaSchema);
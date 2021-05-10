var mongoose = require('mongoose');

var slideSchema = new mongoose.Schema({
    img: String
});

module.exports = mongoose.model('Slide', slideSchema);
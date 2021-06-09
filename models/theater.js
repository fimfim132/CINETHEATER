var mongoose = require('mongoose');

var theaterSchema = new mongoose.Schema({
    name: String,
    numofseat: Number,
    showtime: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Showtime'
        }
    ]
});

module.exports = mongoose.model('Theater', theaterSchema);
var mongoose = require('mongoose');

var cinemaSchema = new mongoose.Schema({
    name: String,
    movies:  [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ],
    theater: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Theater'
        }
    ]
});

module.exports = mongoose.model('Cinema', cinemaSchema);
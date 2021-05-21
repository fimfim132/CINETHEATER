var mongoose = require('mongoose');

var movieSchema = new mongoose.Schema({
    name: String,
    img: String,
    trailer: String,
    desc: String,
    time: String,
    type: String,
    date: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

module.exports = mongoose.model('Movie', movieSchema);
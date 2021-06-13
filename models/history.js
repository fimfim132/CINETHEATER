var mongoose = require('mongoose');

var historySchema = new mongoose.Schema({
    name: String,
    movie: String,
    cinema: String,
    theater: String,
    date: String,
    time: String,
    seat: [ 
       {
           type: String
       }
    ]
});

module.exports = mongoose.model('History', historySchema);
var mongoose = require('mongoose');

var seatSchema = new mongoose.Schema({
    seatnum: String,
    available: [
        {
            type: Boolean,
            default: true
        }
    ],
    customer: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});

module.exports = mongoose.model('Seat', seatSchema);
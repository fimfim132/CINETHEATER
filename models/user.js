var mongoose = require('mongoose');
var passportLocalMongoose   = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    profileImage: String,
    favorite: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
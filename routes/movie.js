var express     = require('express'),
    Available   = require('../models/available'),
    Movie       = require('../models/movie'),
    Comment     = require('../models/comment'),
    router      = express.Router();

    
router.get('/', function(req, res){
    Movie.find({}, function(err, allMovie){
        if(err){
            console.log(err);
        } else{
            res.render('movies/index.ejs', {movie: allMovie});
        }
    });
});

router.post('/', function(req, res){
    var img = req.body.img;
    var title = req.body.title;
    var year = req.body.year;
    var rate = req.body.rate;
    var newAvailable = {img: img, title: title, year: year, rate: rate};
    Available.create(newAvailable, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

router.get('/:id', isLoggedIn, function(req, res){
    Movie.findById(req.params.id).populate('comments').exec(function(err, foundMovie){
        if(err){
            console.log(err);
        } else {
            res.render('movies/detail.ejs', {movie: foundMovie});
        }
    });
});

router.post('/:id', isLoggedIn, function(req, res){
    Movie.findById(req.params.id, function(err, foundMovie){
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    comment.author.id == req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundMovie.comments.push(comment);
                    foundMovie.save();
                    res.redirect('/movies/' + foundMovie._id);
                }
            });
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/login');
    }
}

module.exports = router;
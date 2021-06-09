var express     = require('express'),
    Cinema      = require('../models/cinema'),
    Movie      = require('../models/movie'),
    middleware  = require('../middleware'),
    path        = require('path'),
    router      = express.Router();
    
    let today = new Date(),
    dd = String(today.getDate()).padStart(2, '0').toLocaleString('en-US',{timeZone:'Asia/Bangkok'}),
    mm = String(today.getMonth() + 1).padStart(2, '0'),
    yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

router.get('/', function(req, res){
    Cinema.find({}, function(err, allCinema){
        if(err){
            console.log(err);
        } else{
            res.render('cinemas/index.ejs', {cinema: allCinema});
        }
    });
});

router.get('/:id', middleware.isLoggedIn, function(req, res){
    Cinema.findById(req.params.id, function(err, foundCinema){
        if(err){
            console.log(err);
        } else {
            Movie.find({_id:{$nin: foundCinema.movie}}, {date:{$lte:today}}).sort({date:1}).exec(function(err, foundMovie){
                if(err){
                    console.log(err);
                } else {
                    res.render('cinemas/detail.ejs', {cinema: foundCinema, movie: foundMovie});
                }
            
            });
        }
    
    });
});

router.post('/:id', middleware.isLoggedIn, function(req, res){
    Cinema.findById(req.params.id, function(err, foundCinema){
        if(err){
            console.log(err);
        } else {
            foundCinema.movie.push(req.body.movie);
            foundCinema.save();
            req.flash('success', 'Add movie successfully');
            res.redirect('/cinemas/' +req.params.id);
        }

    });
});

module.exports = router;
var express     = require('express'),
    Cinema      = require('../models/cinema'),
    Movie      = require('../models/movie'),
    middleware  = require('../middleware'),
    path        = require('path'),
    router      = express.Router({mergeParams: true});
    
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
    Cinema.findById(req.params.id).populate('movies').exec(function(err, foundCinema){
        if(err){
            console.log(err);
        } else {
            Movie.find({_id:{$nin: foundCinema.movies}}).sort({date:1}).exec(function(err, foundMovie){
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
            foundCinema.movies.push(req.body.movies);
            foundCinema.save();
            req.flash('success', 'Add movie successfully');
            res.redirect('/cinemas/' +req.params.id);
        }

    });
});

router.delete('/:id/:movies_id', middleware.isLoggedIn, function(req, res){
    Cinema.findById(req.params.id, function(err, foundCinema){
        if(err){
            console.log(foundCinema);
        } else {
            foundCinema.movies.forEach(function(movie){
                if(movie.equals(req.params.movie_id)){
                     const  index = foundCinema.movies.indexOf(req.params.movie_id);
                     foundCinema.movies.splice(index, 1);
                     foundCinema.save();      
                }
             });
           res.redirect('/cinemas/');
        
        }
    });
});

module.exports = router;
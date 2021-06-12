var express     = require('express'),
    Cinema      = require('../models/cinema'),
    Movie       = require('../models/movie'),
    middleware  = require('../middleware'),
    Theater     = require('../models/theater'),
    Showtime    = require('../models/showtime'),
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
    Cinema.findById(req.params.id).populate([{path: "movies"}, {path: "theaters", populate: {path: "showtime", populate: "movie"}}]).exec(function(err, foundCinema){
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

router.get('/:id/user', middleware.isLoggedIn, function(req, res){
    Cinema.findById(req.params.id).populate([{path: "movies"}, {path: "theaters", populate: {path: "showtime", populate: "movie"}}]).exec(function(err, foundCinema){
        if(err){
            console.log(err);
        } else {
            res.render('cinemas/user.ejs', {cinema: foundCinema});
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

router.post('/:id/createshowtime', middleware.isLoggedIn, function(req, res){
    Showtime.create(req.body.showtime, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            Theater.findById(req.body.theater, function(err, foundTheater){
                if(err){
                    console.log(err);
                } else {
                foundTheater.showtime.push(newlyCreated._id);
                foundTheater.save()
                res.redirect('/cinemas/' + req.params.id);
                }
            });
        }
    });
});

router.delete('/:id/:movies_id', middleware.isLoggedIn, function(req, res){
    Cinema.findById(req.params.id, function(err, foundCinema){
        if(err){
            console.log(err);
        } else {
            foundCinema.movies.forEach(function(movie){
                if(movie.equals(req.params.movies_id)){
                     const  index = foundCinema.movies.indexOf(req.params.movies_id);
                     foundCinema.movies.splice(index, 1);
                     foundCinema.save();      
                }
             });
           res.redirect('/cinemas/' + req.params.id);
        
        }
    });
});


router.post('/:id/:theaters_id', function(req, res){
    Cinema.findById(req.params.id, function(err, foundCinema){
        if(err){
            console.log(err);
        } else {
                Theater.findByIdAndRemove(req.params.theaters_id, function(err, removeTheater){
                    if(err){
                        console.log(err);
                    }else{
                        foundCinema.theaters.forEach(function(theater){
                            if(theater.equals(req.params.theaters_id)){
                                const  index = foundCinema.theaters.indexOf(req.params.theaters_id);
                                foundCinema.theaters.splice(index, 1);
                                foundCinema.save();      
                            }
                        });
                    }
                });
                res.redirect('/cinemas/' + req.params.id);
            }                            
    });
});

module.exports = router;
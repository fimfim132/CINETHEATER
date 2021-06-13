var express     = require('express'),
    Cinema      = require('../models/cinema'),
    Movie       = require('../models/movie'),
    middleware  = require('../middleware'),
    Theater     = require('../models/theater'),
    Showtime    = require('../models/showtime'),
    Seat        = require('../models/seat'),
    User        = require('../models/user'),
    History     = require('../models/history'),
    path        = require('path'),
    router      = express.Router({mergeParams: true});
    
    let today = new Date(),
    dd = String(today.getDate()).padStart(2, '0').toLocaleString('en-US',{timeZone:'Asia/Bangkok'}),
    mm = String(today.getMonth() + 1).padStart(2, '0'),
    yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

router.get('/', function(req, res){
    Cinema.find({}).sort({name: 1}).exec(function(err, allCinema){
        if(err){
            console.log(err);
        } else{
            res.render('cinemas/index.ejs', {cinema: allCinema});
        }
    });
});

router.get('/:cinema_id/theater/:theater_id/:showtime_id', middleware.isLoggedIn, function(req, res){
    Theater.findById(req.params.theater_id, function(err, foundTheater){
        if(err){
            console.log(err);
        } else {
            Showtime.findById(req.params.showtime_id).populate([{path: 'movie'}, {path: 'seat'}]).exec(function(err, foundShowtime){
                if(err){
                    console.log(err);
                } else {
                    Cinema.findById(req.params.cinema_id, function(err, foundCinema){
                        if(err){
                            console.log(err);
                        } else{
                            console.log(foundTheater);
                            console.log(foundShowtime);
                            res.render('theaters/theater.ejs',{theater: foundTheater, showtime: foundShowtime, cinema: foundCinema});
                        }
                    })
                    }
                });
            }
    });
});

router.post('/:cinema_id/theater/:theater_id/:showtime_id/seat', middleware.isLoggedIn, function(req, res){
    Showtime.findById(req.params.showtime_id, function(err, foundShowtime){
        if(err){
            console.log(err);
        }else{
            Seat.find({$and:[{_id: foundShowtime.seat}, {seatnum: req.body.seat}]}, function(err, foundSeats){
                if(err){
                    console.log(err);
                } else {
                    User.findById(req.user, function(err, foundUser){
                        if(err){
                            console.log(err);
                            res.redirect('/cinemas');
                            req.flash('error', err.message);
                        } else {
                            History.create({
                                cinema: req.body.cinema,
                                movie: req.body.movie,
                                theater: req.body.theater,
                                date: req.body.date,
                                name: req.body.name,
                                seat: req.body.seat,
                                time: req.body.time}, function(err, newlyCreate){
                                if(err){
                                    console.log(err);
                                } else {
                                    console.log(newlyCreate);
                                }
                            });
                            foundSeats.forEach(function(i) {
                                i.customer.push(foundUser);
                                i.available = false; 
                                i.save();
                            });                
                            res.redirect('/cinemas');
                            req.flash('success', 'Booking successfully');
                        }
                    }); 
                }
                
            });
        }
    })
});

router.get('/:id', middleware.isLoggedIn, function(req, res){
    Cinema.findById(req.params.id).populate([{path: "movies"}, {path: "theaters", options: {sort: {'name': 1}}, populate: {path: "showtime", populate: "movie"}}]).exec(function(err, foundCinema){
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

router.get('/:id/user', function(req, res){
    Cinema.findById(req.params.id).populate([{path: "movies", options: {sort: {'name': 1}}}, {path: "theaters", options: {sort: {'name': 1}}, populate: {path: "showtime", populate: "movie"}}]).exec(function(err, foundCinema){
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
            res.redirect('/cinemas/' +req.params.id);
            req.flash('error', err.message);
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
                    createSeat = []
                    for(i=1; i<= foundTheater.numofseat; i++){
                        createSeat.push({seatnum: i});
                    }
                    Seat.insertMany(createSeat, function(err, seatCraeted){
                        if(err){
                            console.log(err);
                        } else {
                            Showtime.findByIdAndUpdate({"_id": newlyCreated._id}, {$push: {seat: seatCraeted}}).exec(function(err, pushSeat){
                                if(err){
                                    console.log(err);
                                } else {
                                    console.log(pushSeat);
                                }
                            });
                        }
                    });
                foundTheater.showtime.push(newlyCreated._id);
                foundTheater.save();
                req.flash('success', 'Create successfully');
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
            req.flash('error', err.message);
            res.redirect('/cinemas/' + req.params.id);
        } else {
            foundCinema.movies.forEach(function(movie){
                if(movie.equals(req.params.movies_id)){
                     const  index = foundCinema.movies.indexOf(req.params.movies_id);
                     foundCinema.movies.splice(index, 1);
                     foundCinema.save();      
                }
             });
             req.flash('success', 'Delete successfully');
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
                        req.flash('error', err.message);
                        res.redirect('/cinemas/' + req.params.id);
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
                req.flash('success', 'Delete successfully');
                res.redirect('/cinemas/' + req.params.id);
            }                            
    });
});


router.post('/:id/:theaters_id/showtime/:showtime_id', function(req, res){
    Cinema.findById(req.params.id, function(err, foundCinema){
        Theater.findById(req.params.theaters_id, function(err, foundTheater){
            if(err){
                console.log(err);
            } else {
                    Showtime.findByIdAndRemove(req.params.showtime_id, function(err, removeShowtime){
                        if(err){
                            console.log(err);
                            req.flash('error', err.message);
                            res.redirect('/cinemas/' + req.params.id);
                        }else{
                            foundTheater.showtime.forEach(function(showtime){
                                if(showtime.equals(req.params.showtime_id)){
                                    const  index = foundTheater.showtime.indexOf(req.params.showtime_id);
                                    foundTheater.showtime.splice(index, 1);
                                    foundTheater.save();      
                                }
                            });
                        }
                    });
                    req.flash('success', 'Remove successfully');
                    res.redirect('/cinemas/' + req.params.id);
                }                            
        });
    });
});

module.exports = router;
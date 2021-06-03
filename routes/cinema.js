var express     = require('express'),
    Cinema      = require('../models/cinema'),
    middleware  = require('../middleware'),
    router      = express.Router();

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
            res.render('cinemas/detail.ejs', {cinema: foundCinema});
        }
    
    });
});


module.exports = router;
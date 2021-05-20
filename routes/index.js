var express     = require('express'),
    router      = express.Router(),
    Slide       = require('../models/slide'),
    User        = require('../models/user'),
    Available   = require('../models/available'),
    passport    = require('passport');

router.get('/', function(req, res){
    Slide.find({}, function(err, allSlide){
        if(err){
            console.log(err);
        } else{
           Available.find({}, function(err, allAvailable){
                if(err){
                    console.log(err);
                } else{
                    res.render('homes/home.ejs', {available: allAvailable, slide: allSlide});
                }
            }); 
        }
    });
});

router.post('/', function(req, res){
});

router.get('/register', function(req, res){
    res.render('register.ejs');
});

router.post('/register', function(req, res){
    var newUser = new User({username: req.body.username, email: req.body.email});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/');
        })
    })
});

router.get('/login', function(req, res){
    res.render('login.ejs');
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/login'
    }), function(req, res){
        if(currentUser.username != ' admin'){
             res.redirect('/admin');
        } else {
            res.redirect('/');
        }
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;
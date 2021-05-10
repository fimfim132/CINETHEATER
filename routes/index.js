var express     = require('express'),
    router      = express.Router(),
    Slide       = require('../models/slide'),
    User        = require('../models/user'),
    passport    = require('passport');

router.get('/', function(req, res){
    Slide.find({}, function(err, allSlide){
        if(err){
            console.log(err);
        } else{
            res.render('homes/home.ejs', {slide: allSlide});
        }
    });
});

router.post('/', function(req, res){
    var img = req.body.img;
    var newSlide = {img: img};
    Slide.create(newSlide, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

router.get('/register', function(req, res){
    res.render('register.ejs');
});

router.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.email, req.body.password, function(err, user){
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
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;
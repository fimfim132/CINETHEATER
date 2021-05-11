var express     = require('express'),
    router      = express.Router(),
    Slide       = require('../models/slide'),
    User        = require('../models/user'),
    Recommend   = require('../models/recommend'),
    passport    = require('passport');

router.get('/', function(req, res){
    Slide.find({}, function(err, allSlide){
        if(err){
            console.log(err);
        } else{
            res.render('homes/home.ejs', {slide: allSlide});
        }
    });
    // Recommend.find({}, function(err, allRecommend){
    //     if(err){
    //         console.log(err);
    //     } else{
    //         res.render('homes/home.ejs', {recommend: allRecommend});
    //     }
    // });
});

router.post('/', function(req, res){
    var img = req.body.img;
    var newSlide = {img: img};
    // var imgs = req.body.imgs;
    // var title = req.body.title;
    // var year = req.body.year;
    // var rate = req.body.rate;
    // var newRecommend = {imgs: imgs, title: title, year: year, rate: rate};
    Slide.create(newSlide, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
    // Recommend.create(newRecommend, function(err, newlyCreated){
    //     if(err){
    //         console.log(err);
    //     } else {
    //         res.redirect('/');
    //     }
    // });
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
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;
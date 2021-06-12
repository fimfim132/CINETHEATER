var express     = require('express'),
    router      = express.Router(),
    Slide       = require('../models/slide'),
    User        = require('../models/user'),
    Movie       = require('../models/movie'),
    middleware  = require('../middleware'),
    passport    = require('passport'),
    multer      = require('multer'),
    path        = require('path'),
    storage     = multer.diskStorage({
                    destination: function(req, file, callback){
                        callback(null, 'public/uploads');
                    },
                    filename: function(req, file, callback){
                        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
                    }
    }),
    imgFilter = function(req, file, callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)){
            return callback(new Error('Only JPG, JPEG, PNG anf GIF image file are allowed!'),false);
        }
        callback(null, true);
    },
    upload = multer({storage: storage, fileFilter: imgFilter});
    
    let today = new Date(),
    dd = String(today.getDate()).padStart(2, '0').toLocaleString('en-US',{timeZone:'Asia/Bangkok'}),
    mm = String(today.getMonth() + 1).padStart(2, '0'),
    yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

router.get('/', function(req, res){
    Slide.find({}, function(err, allSlide){
        if(err){
            console.log(err);
        } else{
            Movie.find({date:{$lte:today}}).sort({date:1}).exec(function(err, allMovie){
                if(err){
                    console.log(err);
                } else{
                    res.render('homes/home.ejs', {movie: allMovie, slide: allSlide});
                }
            }); 
        }
    });
});
// gteใช้กับเข้าฉายแล้วมltยังไม่เข้าฉาย

router.post('/', function(req, res){
    const word = req.body.search;
    Movie.find({$or:[{name: {$regex: word, $options: 'i'}}, {type: {$regex: word, $options: 'i'}}]}).sort({date:1}).exec(function(err, foundMovie){
        if(err){
            req.flash('error', err.message);
            console.log(err);
        } else {
            res.render('homes/search.ejs', {movie: foundMovie, word: word});
        }
    });
});

router.get('/register', function(req, res){
    res.render('register.ejs');
});

router.post('/register', upload.single('profileImage'), function(req, res){
    req.body.profileImage = '/uploads/'+ req.file.filename;
    var newUser = new User({username: req.body.username, 
                            email: req.body.email,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            profileImage: req.body.profileImage
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success', 'Welcome to CINETHEARTER ' + user.username);
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res){
    res.render('login.ejs');
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/login',
        successFlash : true,
        failureFlash: true,
        successFlash: 'Successfully log in',
        failureFlash: 'Invalid username or password'
    }), function(req, res){
});

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'Logged you out successfully');
    res.redirect('/');
});

router.get('/user/:id', function(req,res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash('error', 'User not found');
            return res.redirect('/');
        } else {
            res.render('user/show.ejs', {user: foundUser});
        }
    });
});

router.get('/user/:id/edit', middleware.isLoggedIn, function(req,res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash('error', 'Information');
            return res.redirect('/');
        } else {
            res.render('user/edit.ejs', {user: foundUser});
        }
    });
});

router.put('/user/:id', middleware.isLoggedIn, upload.single('img'), function(req, res){
    if(req.file){
        req.body.user.profileImage = '/upload' + req.file.file.name;
    }
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedMovie){
        if(err){
            res.redirect('/user/' + req.params.id);
        } else {
            res.redirect('/user/' + req.params.id);
        }
    });
});

router.delete('/user/:id', function(req, res){
    User.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect('/');
        } else {
            req.logout();
            req.flash('success', 'Delete user successfully');
            res.redirect('/');
        }
    });
});

module.exports = router;
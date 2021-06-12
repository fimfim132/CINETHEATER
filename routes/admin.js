
var express     = require('express'),
    multer      = require('multer'),
    Movie       = require('../models/movie'),
    Cinema      = require('../models/cinema'),
    Theater     = require('../models/theater'),
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
    upload = multer({storage: storage, fileFilter: imgFilter}),
    router      = express.Router();

router.get('/add/movie', function(req, res){
    res.render('admin/movie.ejs');
});

router.post('/add/movie',upload.single('img'),  function(req, res){
    req.body.movie
    req.body.movie.img = '/uploads/'+ req.file.filename;
    Movie.create(req.body.movie, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect('/movies');
        }
    });
});

router.get('/:id/edit', function(req, res){
    Movie.findById(req.params.id, function(err, foundMovie){
        if(err){
            console.log(err);
        } else {
            res.render('admin/edit.ejs', {movie: foundMovie});
        }
    });
});

router.get('/add/cinema', function(req, res){
    res.render('admin/cinema.ejs');
});

router.post('/add/cinema', function(req, res){
    Cinema.create(req.body.cinema, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            for(i=1; i <= req.body.numoftheater; i++){
                Theater.create({name: i}, function(err, createTheater){
                    if(err){
                        console.log(err);
                    }else{
                        Cinema.findOneAndUpdate({"_id": newlyCreated._id}, {$push: {theaters: createTheater._id}}).exec(function(err, pushTheater){
                            if(err){
                                console.log(err);
                            }else{
                                console.log(pushTheater);
                            }
                        })
                    }
                });
            }
            res.redirect('/cinemas');
        }
    });
});

router.get('/:id', function(req, res){
    Theater.findById(req.params.id, function(err, foundTheater){
        if(err){
            console.log(err);
        } else {
            res.render('admin/theater.ejs', {theater: foundTheater});
        }
    });
});


router.put('/:theaters_id', function(req, res){
    Theater.findByIdAndUpdate(req.params.theaters_id, req.body.theater, function(err, updatedMovie){
        if(err){
            console.log(err);
        } else {
            res.redirect('/cinemas');
        }
    });
});

router.delete('/:id', function(req, res){
    Movie.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect('/movies/');
        } else {
            res.redirect('/movies/');
        }
    });
});



module.exports = router;
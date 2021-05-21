var express     = require('express'),
    multer      = require('multer'),
    Movie       = require('../models/movie'),
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

router.get('/add', function(req, res){
    res.render('admin/movie.ejs');
});

router.post('/add',upload.single('img'),  function(req, res){
    req.body.movie
    req.body.movie.img = '/uploads/'+ req.file.filename;
    // var newMovie = {name: name, img: img, trailer: trailer, desc: desc, time: time, type: type, date: date};
    Movie.create(req.body.movie, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect('/movies');
        }
    });
});

router.get('/edit', function(req, res){
    res.render('admin/cinema.ejs');
});

module.exports = router;
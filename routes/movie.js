var express     = require('express'),
    Available   = require('../models/available'),
    router      = express.Router();

router.get('/', function(req, res){
    Available.find({}, function(err, allAvailable){
        if(err){
            console.log(err);
        } else{
            res.render('movies/index.ejs', {available: allAvailable});
        }
    });
});

router.post('/', function(req, res){
    var img = req.body.img;
    var title = req.body.title;
    var year = req.body.year;
    var rate = req.body.rate;
    var newAvailable = {img: img, title: title, year: year, rate: rate};
    Available.create(newAvailable, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;
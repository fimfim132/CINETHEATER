var express     = require('express'),
    multer      = require('multer'),
    path        = require('path'),
    storage     = multer.diskStorage({
                    destination: function(req, file, callback){
                        callback(null, 'public/uploads');
                    },
                    filename: function(req, file, callback){
                        callback(null, file.fieldname + '-')
                    }
    })
    router      = express.Router();

router.get('/', function(req, res){
    res.render('admin/movie.ejs');
});

module.exports = router;
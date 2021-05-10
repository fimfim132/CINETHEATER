var express     = require('express'),
    router      = express.Router();

router.get('/', function(req, res){
    res.render('cinemas/index.ejs');
});

module.exports = router;
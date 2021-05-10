const   express         = require('express'),
        app             = express(),
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local'),
        User            = require('./models/user'),
        Slide           = require('./models/slide'),
        seedDB          = require('./seed'),
        Schema          = mongoose.Schema;


mongoose.connect('mongodb://localhost:27017/project');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
seedDB();

// Slide.create(
    //     {
    //         img: 'https://www.ktc.co.th/pub/media/Promotion/Book/cinema/092020-Airpay-majorcineplex-sfcinema-movie-ticket-promo-m.jpg'
    //     },
    //     {
    //         img: 'https://i.ytimg.com/vi/Xnzd75G-K_w/maxresdefault.jpg'
    //     },
    //     {
    //         img: 'https://2.bp.blogspot.com/-lhfpF2uQgjw/V324tQrNjcI/AAAAAAAAAdg/E2jr02bloNQ91c5n13Eiuc22_L_kcsWIwCLcB/s1600/GSC%2BCinemas%2BMovie%2BTicket%2BDiscount%2BPromotion.png'
    //     },
    //     {
    //         img: 'https://dineclub.adidocdn.dev/media/pages/August2020/53bfmlC1m1OoyeIka4k9.jpg'
    //     },
//     function(err, slide){
//         if(err){
//             console.log(err);
//         } else {
//             console.log('new data add');
//             console.log(slide);
//         }
//     }
// );


app.get('/', function(req, res){
    Slide.find({}, function(err, allSlide){
        if(err){
            console.log(err);
        } else{
            res.render('homes/home.ejs', {slide: allSlide});
        }
    });
});

app.post('/', function(req, res){
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

app.get('/movies', function(req, res){
    res.render('movies/index.ejs');
});

app.get('/cinemas', function(req, res){
    res.render('cinemas/index.ejs');
});

app.get('/register', function(req, res){
    res.render('register.ejs');
});

app.get('/login', function(req, res){
    res.render('login.ejs');
});


app.listen(3000, function(){
    console.log('server is start');
});
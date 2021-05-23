const   express         = require('express'),
        app             = express(),
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local'),
        User            = require('./models/user'),
        methodOverride  = require('method-override'),
        seedDB          = require('./seed'),
        Schema          = mongoose.Schema;
        
var indexRoutes         = require('./routes/index'),
    cinemaRoutes        = require('./routes/cinema'),
    adminRoutes        = require('./routes/admin'),
    movieRoutes         = require('./routes/movie');

mongoose.connect('mongodb://localhost:27017/project');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(methodOverride('_method'));

app.use(require('express-session')({
    secret: 'secret is always secret.',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.use('/', indexRoutes);
app.use('/movies', movieRoutes);
app.use('/cinemas', cinemaRoutes);
app.use('/admin', adminRoutes);

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/login');
    }
}
// seedDB();
app.listen(3000, function(){
    console.log('server is start');
});



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
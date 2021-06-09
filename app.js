const   express         = require('express'),
        app             = express(),
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local'),
        User            = require('./models/user'),
        methodOverride  = require('method-override'),
        flash           = require('connect-flash'),
        Schema          = mongoose.Schema;
        
var indexRoutes         = require('./routes/index'),
    cinemaRoutes        = require('./routes/cinema'),
    adminRoutes        = require('./routes/admin'),
    movieRoutes         = require('./routes/movie');

mongoose.connect('mongodb://localhost:27017/project');
app.set('view engine', 'ejs');
app.use(flash());
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
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
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

app.listen(3000, function(){
    console.log('server is start');
});
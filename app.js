var express = require("express");
var app = express();




var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var passport = require("passport")
var LocalStrategy = require("passport-local")
var methodOverride = require("method-override")
var flash = require("connect-flash")



mongoose.set('useNewUrlParser', true);
//mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs")


var commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index"),
    campgroundsRoutes = require("./routes/campgrounds");


var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");
var User = require("./models/user")
var seedDB = require("./seeds");


app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash())

//seedDB();


// CONFIGURE PASSPORT
app.use(require("express-session")({
    secret: "Once again Rusty cutest dog!",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.deserializeUser(User.deserializeUser());
passport.serializeUser(User.serializeUser());


app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})


app.use(campgroundsRoutes);
app.use(commentRoutes);
app.use(indexRoutes);


/* app.listen(3001, function() {
    console.log("Server Started ....")
})
 */


app.listen(process.env.PORT || 3000, function() {
    console.log("Server Started....")
})
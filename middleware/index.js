var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
//var flash = require("connect-flash")


var middlewareObj = {};




middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                req.flash("error", "Campground Not found!! ")
                res.redirect("back");
            } else {
                // does user own the campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You dont have permisttion to do this operation! ")

                    res.redirect("back");
                }
            }
        });
    } else {
        res.render("login");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {


        console.log("commebt is $$$$$ >>" + req.params.cId);

        Comment.findById(req.params.cId, function(err, foundComment) {
            if (err) {
                req.flash("error", "Comment Not found!! ")
                res.redirect("back");
            } else {
                // does user own the comment?
                // console.log("found  commebt is >>" + foundComment);
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You dont have permisttion to do this operation! ")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be loggedin to do that! ")
        res.render("login");
    }
}


middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be loggedin to do that! ")
    res.redirect("/login")
}




module.exports = middlewareObj;
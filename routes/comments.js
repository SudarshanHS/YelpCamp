var express = require("express");
var router = express();

var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware")


router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res) {

    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log("Error ")
        } else {
            res.render("comments/new", { campground: foundCampground });
        }

    })

})


router.post("/campgrounds/:id/comments", function(req, res) {

    var newObj = req.body.comment;
    //console.log("campground id is >>>" + req.params.id)
    Campground.findById(req.params.id, function(err, campgroun) {
        if (err) {
            console.log(err)
        } else {


            Comment.create(newObj, function(err, comment) {

                if (err) {
                    console.log("Error occured while adding new comment ")
                } else {
                    console.log("new comment username  >>" + req.user.username)



                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username

                    comment.save(function(err) {
                        console.log("errr in comment >" + err)
                    });

                    campgroun.comments.unshift(comment); // insted of push use unshift
                    campgroun.markModified("comments");
                    campgroun.save(function(err) {
                        console.log(err)
                    });
                    res.redirect("/campgrounds/" + campgroun._id)

                }
            });
        }
    })
});



router.get("/campgrounds/:id/comments/:cId/edit", middleware.checkCommentOwnership, function(req, res) {



    console.log("campgrnd id >>>" + req.params.id);

    console.log("comment id >>>" + req.params.cId);

    Comment.findById(req.params.cId, function(err, foundComment) {
        if (err) {
            console.log("Error ")
        } else {
            //console.log(foundComment)
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
        }

    })

})


// UPDATE
router.put("/campgrounds/:id/comments/:cId", middleware.checkCommentOwnership, function(req, res) {

    var newObj = req.body.comment;


    Comment.findByIdAndUpdate(req.params.cId, req.body.comment, function(err, updatedComment) {

        if (err) {
            console.log(err)
        } else {

            //console.log("Sucess udpated >>" + updatedComment);
            res.redirect("/campgrounds/" + req.params.id);

        }
    });
});

router.delete("/campgrounds/:id/comments/:cId", middleware.checkCommentOwnership, function(req, res) {

    var newObj = req.body.comment;


    Comment.findByIdAndRemove(req.params.cId, function(err, updatedComment) {

        if (err) {
            console.log(err)
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});







module.exports = router;
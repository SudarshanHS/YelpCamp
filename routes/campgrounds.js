var express = require("express");
var router = express();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware")



router.get("/campgrounds", function(req, res) {

    Campground.find({}, function(err, allCampgrounds) {

        if (err) {
            console.log("oops! Something went wrong!!")
            console.log(err)
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds })

        }

    });
})

router.post("/campgrounds", middleware.isLoggedIn, function(req, res) {

    // get data from form and add campground array 
    // redirt back to campground page 

    var name = req.body.name
    var image = req.body.image
    var description = req.body.description
    var price = req.body.price;

    console.log("user details <<>>" + req.user)

    var author = {
        id: req.user._id,
        username: req.user.username
    }

    var newObj = { name: name, price: price, image: image, description: description, author: author }



    Campground.create(newObj, function(err, campground) {

        if (err) {
            console.log("Error")
        } else {



            console.log("Addeded sucessfully " + campground)


            console.log("Addeded sucessfully " + name)
        }

    });

    res.redirect("/campgrounds")


    //  res.send("you hit post service!!!")
})


router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {

    res.render("campgrounds/new.ejs")
})

router.get("/campgrounds/:id", function(req, res) {


    //  var id = req.params.id

    var myId = req.params.id;
    Campground.findById(myId).populate("comments").exec(function(err, foundCampground) {

        if (err) {
            console.log("Error found" + err)
        } else {

            //console.log("Name <<<>>> " + foundCampground)

            res.render("campgrounds/show", { campground: foundCampground })



        }
    });

});



// EDIT CAMPGROUND

router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {




    // chcek if user owns that campground

    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err)
        } else {


            res.render("campgrounds/edit", { campground: foundCampground })

        }
    })





});


// UPDATE CAMPGROUND 

router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, middleware.isLoggedIn, function(req, res) {

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            console.log(err)
        } else {

            console.log("Sucess >>> " + updatedCampground.name)
            res.redirect("/campgrounds/" + req.params.id)
        }
    })

    /* another way of doing 
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                console.log(err)
            } else {

                console.log("found obj >>" + foundCampground.name)

                foundCampground.name = req.body.campground.name
                    // campgroun.markModified("comments");
                foundCampground.save(function(err) {
                    console.log(err)
                });

                res.redirect("/campgrounds/" + req.params.id)
            }
        })redirect
     */


});


router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {

    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/campgrounds")
        }
    })
})




module.exports = router;
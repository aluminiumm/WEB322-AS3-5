const express = require('express')
const router = express.Router();
const showModel = require("../models/Show");
const orderModel = require("../models/Order");//remove when Order.js can work

//Route to direct user to home page
router.get("/",(req,res) => {
    showModel.find({featured:"true"}) //filtering by featured shows only
    .then((shows) => {
        const featuredShows = shows.map(show => {
            return {
                id: show._id,
                showTitle: show.showTitle,
                imageS: show.imageS,
                tv: show.tv
            }
        });
        res.render("index", {
            title: "VUDU",
            data: featuredShows
        });
    })
    .catch(err => {
        console.log(`Error happened when listing in the database: ${err}`);
        res.render("index");
    });    
});

//route for movie listing page 
router.get("/movies",(req,res) => {
    showModel.find()
    .then((shows) => {
        const allMovies = shows.map(show => {
            return {
                id: show._id,
                showTitle: show.showTitle,
                imageS: show.imageS
            }
        });
        res.render("movieListing", {
            title: "Movies & TV Shows",
            data: allMovies
        });
    })
    .catch(err => {
        console.log(`Error happened when listing in the database: ${err}`);
        res.render("movieListing");
    });    
});

//route for registration page 
router.get("/register",(req,res) => {
    res.render("register", {
        title: "Customer Registration"
    });
})

/* ========== MOVE BELOW TO Order.js ========== */

//Route to direct use to cart
router.get("/cart",(req,res) => {
    res.render("Order/cart",{
        title: "Your Cart"
    });
})
/* ========== MOVE ABOVE TO Order.js ========== */

module.exports = router;
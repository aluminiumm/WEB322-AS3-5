const express = require('express')
const router = express.Router();
const showModel = require("../models/Show");
const orderModel = require("../models/Order");


//Route to direct use to cart
router.get("/cart",(req,res) => {
    console.log("LOADING CART");
    res.render("Order/cart",{
        title: "Your Cart"
    });
})

module.exports = router;
const express = require('express')
const router = express.Router();
const userModel = require("../models/User");
const bcrypt = require('bcryptjs');
const isAuthenticated = require("../middleware/auth");
const dashBoardLoader = require("../middleware/authorization");

//route to direct use to Registration form
router.get("/register",(req,res) => {
    res.render("User/register"), { title: "Customer Registration" };
});

//route to process user's request and data when user submits registration form
router.post("/register",(req,res) => { 
    const newUser =
    {
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        password:req.body.password
    }
    const user = new userModel(newUser);
    user.save()
    .then(() => {
        res.redirect("/user/login"), { title: "Login" }
    })
    .catch((err) => {
        const errors = [];
            errors.push("Please enter all fields");
            res.render("User/register",{
                errors //short version of errors:errors
            })
    });
});

//route to direct user to the login form
router.get("/login",(req,res) => {
    res.render("User/login"), { title: "Login" };
});

//route to process user's request and data when user submits login form
router.post("/login",(req,res) => {
    userModel.findOne({email:req.body.email})
        .lean().then(user => {
            const errors = [];
            //email not found
            if(user == null) {
                errors.push("Oops! Your email and/or password is incorrect. Please try again");
                res.render("User/login",{
                    errors //short version of errors:errors
                })
            }
            //email is found
            else {
                bcrypt.compare(req.body.password, user.password)
                .then(isMatched => {
                    //password matched => create session and redirect
                    if(isMatched) {
                        //create our session
                        req.session.userInfo = user;
                        dashBoardLoader(req,res);
                        //res.redirect("/user/profile");
                    }
                    else {
                        errors.push("Oops! Your email and/or password is incorrect. Please try again");
                        res.render("User/login",{
                            errors
                        })
                    }
                })
                .catch(err=>console.log(`Error : ${err}`));
            }
    })
    .catch(err=>console.log(`Error : ${err}`)) 
});

//authentication (auth.js) then authorization (authorization.js)
router.get("/profile",isAuthenticated,dashBoardLoader);

//route to logout
router.get("/logout",(req,res) => {
    req.session.destroy();
    res.redirect("/user/login"), { title: "Login" };
});

module.exports = router;
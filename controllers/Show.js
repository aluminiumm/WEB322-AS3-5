const express = require('express');
const router = express.Router();
const showModel = require("../models/Show");
const path = require('path');
const sgMail = require('@sendgrid/mail'); //for order form

//route to direct use to Add Show form
router.get("/add",(req,res) => {
    let user = req.session.userInfo;
    if(user.type == "Admin"){
        res.render("Show/showAddForm"), {
            admin: user,
            title: "Add a Show"
        };
    }
    else {//for normal users
        console.log('User tried to enter "Add a Show" page.');
        res.redirect("/"), { user: user };
    }
});

//route to process user's request and data when the user submits the add show form
router.post("/add",(req,res) => {
    const newShow = {
        showTitle: req.body.showTitle,
        description: req.body.description,
        category: req.body.category, //select
        rating: req.body.rating,
        imageS: req.body.imageS,
        imageL: req.body.imageL,
        priceRent: req.body.priceRent, //rent the movie/tv show per day
        priceBuy: req.body.priceBuy,
        tv: req.body.tv, //true or false
        featured: req.body.featured //true or false
    }
   const show = new showModel(newShow);
   show.save()
   .then((show) => {
        //rename (show id + S + extension)
        req.files.imageS.name = `imgS_${show._id}${path.parse(req.files.imageS.name).ext}`;
        req.files.imageL.name = `imgL_${show._id}${path.parse(req.files.imageL.name).ext}`;
        //move function (mv) = place where store files
        req.files.imageS.mv(`public/uploads/${req.files.imageS.name}`)
        req.files.imageL.mv(`public/uploads/${req.files.imageL.name}`)
        .then(() => {
            //update
            showModel.updateOne({_id:show._id},{
                imageS:req.files.imageS.name,
                imageL:req.files.imageL.name
            })
            .then(() => {
                res.redirect("/show/list")
            })
        })
    })
   .catch(err => console.log(`Error happened when inserting in the database: ${err}`));
});

//route to fetch all shows
router.get("/list",(req,res) => {
    let user = req.session.userInfo;
    if(user.type == "Admin"){
        //pull from the database, get the results that was returned adn then inject that results into the showDashboard
        showModel.find() //if you want to filter the data write ---> showModel.find({status:"Open"})
        .then((shows) => {
            //filter out the information that you want from the array of documents that was returned into a new array
            //if the array has 3 documents meaning that the array has 3 elements
            const filteredShow = shows.map(show => {
                return {
                    id: show._id,
                    showTitle: show.showTitle,
                    description: show.description,
                    category: show.category,
                    rating: show.rating,
                    imageS: show.imageS,
                    imageL: show.imageL,
                    priceRent: show.priceRent,
                    priceBuy: show.priceBuy,
                    tv: show.tv,
                    featured: show.featured
                }
            });
            res.render("Show/showDashboard",{
                admin: user,
                title: "Show Dashboard",
                data: filteredShow
            });
        })
        .catch(err => {
            console.log(`Error happened when listing in the database: ${err}`);
            res.render("Show/showDashboard");
        });
    }
    else {//for normal users
        console.log('User tried to enter "Show Dashboard" page.');
        res.redirect("/"), { user: user };
    }
});

//route to direct user to the show profile page
router.get("/detail/:id",(req,res) => {
    showModel.findById(req.params.id)
    .then((show) => {
        const {_id,showTitle,description,category,rating,imageS,imageL,priceRent,priceBuy,tv,featured} = show;
        res.render("Show/showDetail",{
            title: show.showTitle, //page title
            _id,
            showTitle,
            description,
            category,
            rating,
            imageS,
            imageL,
            priceRent,
            priceBuy,
            tv,
            featured,
        })
    })
    .catch(err => console.log(`Error happened when showing in the database: ${err}`));
})
//for order
router.post("/detail/:id",(req,res) => {
    // <== write the information to be pulled here. Loop out with map or for_each, and concatenate
    sgMail.setApiKey(process.env.SEND_GRID_KEY)
    const msg = {
      to: 'au.udfam@gmail.com', //change to your recipient
      from: 'ayumi.reg@gmail.com', //change to your verified sender
      subject: 'VUDU: Order Confirmation',
      text: 'Thank you for ordering',
      html: '<h1>Order Confirmation</h1>'
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
        res.redirect("/");
      })
      .catch((error) => {
        console.error(error)
      })
})
//const HTTP_PORT = process.env.PORT;

//route to direct user to edit show form
router.get("/edit/:id",(req,res) => {
    let user = req.session.userInfo;
    if(user.type == "Admin"){
        showModel.findById(req.params.id)
            .then((show) => {
                const {_id,showTitle,description,category,rating,imageS,priceRent,priceBuy,tv,featured} = show;
                res.render("Show/showEditForm",{
                    title: "Edit a Show",
                    _id,
                    showTitle,
                    description,
                    category,
                    rating,
                    imageS,
                    priceRent,
                    priceBuy,
                    tv,
                    featured
                })
            })
            .catch(err => console.log(`Error happened when editing in the database: ${err}`));
    }
    else {//for normal users
        console.log('User tried to enter "Edit a Show" page.');
        res.redirect("/"), { user: user };
    }
})

//route to update user data after they submit the form
router.put("/update/:id",(req,res) =>{
    let user = req.session.userInfo;
    if(user.type == "Admin"){
        const show = {
            showTitle: req.body.showTitle,
            description: req.body.description,
            category: req.body.category,
            rating: req.body.rating,
            imageS: req.body.imageS,
            imageL: req.body.imageL,
            priceRent: req.body.priceRent,
            priceBuy: req.body.priceBuy,
            tv: req.body.tv,
            featured: req.body.featured
        }
        showModel.updateOne({_id:req.params.id},show) // 2 parameters (id & show)
        .then((show) => {
            //rename (imgS_ + show id + file name + extension)
            req.files.imageS.name = `imgS_${show._id}${path.parse(req.files.imageS.name).ext}`;
            //move function (mv) = place where store files
            req.files.imageS.mv(`public/uploads/${req.files.imageS.name}`)
            .then(() => {
                //update
                showModel.updateOne({_id:show._id}, {
                    imageS:req.files.imageS.name
                })
                .then(() => {
                    res.redirect("/show/list")
                })
            })
        })
        .catch(err => console.log(`Error happened when updating in the database: ${err}`));
    }
    else {//for normal users
        console.log('User tried to update the page.');
        res.redirect("/"), { user: user };
    }
});

//route to delete show
router.delete("/delete/:id",(req,res) => {
    let user = req.session.userInfo;
    if(user.type == "Admin"){
        showModel.deleteOne({_id:req.params.id})
        .then(() => {
            res.redirect("/show/list");
        })
        .catch(err => console.log(`Error happened when updating in the database: ${err}`));
    }
    else {//for normal users
        console.log('User tried to delete the page.');
        res.redirect("/"), { user: user };
    }
});

module.exports = router;
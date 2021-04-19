const express= require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const session = require('express-session');

//loads all environment variables from the keys.env
require('dotenv').config({ path: './config/keys.env' });

//import your router objects
const generalRoutes = require("./controllers/General");
const userRoutes = require("./controllers/User");//registration & login
const showRoutes = require("./controllers/Show");//create movie
const orderRoutes = require("./controllers/Order");//cart

//creation of app object
const app = express();

//Set Handlebars as the Express engine for the app
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//load static resources
app.use(express.static("public"));

//This tells express to make from data available via req.body in every request
app.use(bodyParser.urlencoded({ extended: false }))

//for PUT and DELETE request respectively
app.use((req,res,next)=>{

    if(req.query.method == "PUT")
    {
        req.method = "PUT"
    }
    else if(req.query.method == "DELETE")
    {
        req.method = "DELETE"
    }
    next();
})

app.use(fileUpload()); //have to write BEFORE roots

//session
app.use(session({
    secret: '${process.env.SECRET_KEY}',
    resave: false,
    saveUninitialized: true,
}))

//global template to access JS variable, userInfo
app.use((req,res,next)=>{
    res.locals.user = req.session.userInfo;
    res.locals.cart = req.session.cart;
    next();
})

//MAPs EXPRESS TO ALL OUR  ROUTER OBJECTS
app.use("/",generalRoutes);
app.use("/user",userRoutes);
app.use("/show",showRoutes);
app.use("/cart",orderRoutes);
app.use("/",(req,res)=>{
    res.render("404");
});

//connection
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('Connected to MongoDB Database');
})
.catch(err=>console.log(`Error occurred when connecting to database ${err}`));

const PORT = process.env.PORT;

//creates an Express Web Server that listens for incoming HTTP Requests
app.listen(PORT,()=>{
    console.log(`Your Web Server has been connected`);
    
});
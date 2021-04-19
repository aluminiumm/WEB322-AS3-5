const mongoose = require("mongoose");
const { Schema } = mongoose;

//This indicates the shape of the documents that will be entering the database
const showSchema = new Schema({
    showTitle:
    {
        type:String,
        required:true
    },
    description:
    {
        type:String,
        required:true
    },
    category:
    {
        type:String,
        required:true
    },
    rating:
    {
        type:Number,
        required:true
    },
    imageS:
    {
        type:String
    },
    imageL:
    {
        type:String
    },
    priceRent:
    {
        type:Number,
        required:true
    },
    priceBuy:
    {
        type:Number,
        required:true
    },
    tv:
    {
        type:Boolean,
        required:true
    },
    featured:
    {
        type:Boolean,
        required:true
    },
    dataCreated:
    {
        type:Date,
        default:Date.now()
    }
});

/*
    For every Schema you create (Create a schema per collection), you must also create a model object.
    The model will allow you to perform CRUD (Create, Read, Update, and Delete) operations on a given collection!!!
*/
const showModel = mongoose.model('Show', showSchema);

module.exports = showModel;
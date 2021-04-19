const mongoose = require("mongoose");
const { Schema } = mongoose;

//This indicates the shape of the documents that will be entering the database
const orderSchema = new Schema({
    id:
    {
        type:String,
        required:true
    },
        title:
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
const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;
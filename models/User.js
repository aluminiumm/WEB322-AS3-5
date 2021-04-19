const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({

    firstName :
    {
        type:String,
        required:true
    },

    lastName :
    {
        type:String,
        required:true

    },
    email:
    {
        type:String,
        required:true

    },
    password:
    {
        type:String,
        required:true

    },
    type: //user or admin
    {
        type:String,
        default:"User"
    }
});

userSchema.pre("save",function(next)
{
    //salt random generated characters or strings
    bcrypt.genSalt(10)
    .then((salt)=>{

        bcrypt.hash(this.password,salt)
        .then((encryptPassword)=>{
            this.password = encryptPassword;
            next();
        })
        .catch(err=>console.log('Error occurred when hashing ${err}'));
    })
    .catch(err=>console.log('Error occurred when salting ${err}'));
})


const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
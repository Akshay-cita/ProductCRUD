var mongoose = require('mongoose');

const UserSchema=mongoose.Schema({
    fullname:{
        type:String,
        required:true,
        maxlength:100
    },
    email:{
        type:String,
        required:true,
        unique:1
    },
    phone:{
        type:Number,
        required:true,
        maxlength:10

    },
    password:{
        type:String,
        required:true,
        minlength:8
    },

});
module.exports =  mongoose.model('User', UserSchema)
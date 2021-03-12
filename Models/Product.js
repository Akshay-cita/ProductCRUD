var mongoose = require('mongoose');

const ProdSchema=mongoose.Schema({
    productname:{
        type:String,
        required:true,
        maxlength:100
    },
    productcode:{
        type:String,
        required:true,
        unique:1
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },

});
module.exports =  mongoose.model('Product', ProdSchema)
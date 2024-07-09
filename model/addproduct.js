const mongoose=require("mongoose");
const { type } = require("os");

const productSchema= new mongoose.Schema({
    productname:{
        type:String,
        required:true
    },
    productprice:{
        type:String,
        required:true
    },
    productdiscount:{
        type:String,
        required:true
    },
    specialdiscount:{
        type:String,
        required:true
    },
    productdetails:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    upload:{
        type:String,
        required:true
    }

})

const productModel = mongoose.model("addproduct",productSchema)

module.exports = productModel;
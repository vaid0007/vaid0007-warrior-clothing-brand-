const mongoose=require("mongoose");

const contactSchema= new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    query:{
        type:String,
        required:true
    },

})

const contactModel = mongoose.model("contact",contactSchema)

module.exports = contactModel;
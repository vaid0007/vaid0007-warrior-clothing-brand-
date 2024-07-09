var express=require("express");
const cookieparser = require("cookie-parser");
const session = require("express-session");


var app=express();
var bodyparser = require("body-parser");
var mongoose = require("./db/config");
var router=require("./controller/router");

const path = require("path");
app.use(express.static(path.join(__dirname, "/upload")))


app.set("view engine","ejs");
app.use(express.static("views"));



app.use(cookieparser());
app.use(
    session({
        key:"user_sid",
        secret:"somerandonstuffs",
        resave:false,
        saveUninitialized:false,
        cookie: {
            expires:600000,
        },
    })
);



app.use(bodyparser.urlencoded({extended:true}));





app.use("/",router);
app.listen(8081);
 

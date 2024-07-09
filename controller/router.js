var express=require("express");
var userModel=require("../model/signup");
var productModel=require("../model/addproduct");
var contactModel=require("../model/contactus"); 
const multer = require("multer");





var router=express.Router();
router.get ("/",async function(req,res){
    const showdata=await productModel.find({})
    console.log(showdata);
    res.render("index",{data_index:showdata});
});

router.get ("/register",function(req,res){
    res.render("register");
}); 

router.get ("/login",function(req,res){
    res.render("login");
});

router.get ("/tshirt",function(req,res){
    res.render("tshirt");
});

router.get ("/jeans",function(req,res){
    res.render("jeans");
});

router.get ("/casualshoes",function(req,res){
    res.render("casualshoes");
});







router.get ("/dashboard",function(req,res){
    if(req.session.user && req.cookies.user_sid) {
    res.render("dashboard/index");
   }
   else {
    res.redirect("/login")
   };
});

const productdashboard = async (req,res) =>{
    try{
        var search = '';
        if (req.query.search){
            search= req.query.search;
        }


        const userdata = await productModel.find({
            $or: [ 
                {productname:{$regex :'.' +search+ '.'}},
                {username :{$regex :'.' +search+ '.'}}
            ]

        })
        res.render('dashboard', {users : userdata});
    } catch (error){
        console.log (error.message);
    }
};




router.get ("/addproducts",function(req,res){
    if(req.session.user && req.cookies.user_sid)  {
    res.render("dashboard/addproducts");
    }
    else {
        res.redirect("/login")
    }
});

router.get ("/logout",(req,res) => {
    if(req.session.user && req.cookies.user_sid)  {
    res.clearCookie("user_sid");
    res.redirect("/login");
    }
    else {
        res.redirect("/login")
    }
});




// ........................./////product/////.......................

router.get ("/viewproducts",async function(req,res) {
    var reg=await productModel.find({})
    console.log(reg)
    if(req.session.user && req.cookies.user_sid){
    res.render("dashboard/viewproducts",{dataproduct:reg});
    }
    else {
        res.redirect("/login")
    }
});

//file upload

const storage = multer.diskStorage({
    destination: function(req, file, cb)  {
        cb(null, "./upload");
    },

    filename:function (req, file, cb)  {
        cb(null, file.originalname);
        // cb(null, uuidv4()+"-"+ Date.now() + path.extname(file.originalname))  //Appending.jpg
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ["image/jpeg", "image/jpg","image/png","image/webp"];
    if(allowedFileTypes.includes(file.mimetype))  {
        cb(null, true);
    }else {
        cb(null,false);
    }
}
let upload = multer({storage, fileFilter});

router.post("/addproduct",upload.single("upload"),(req , res) => {
    var add={
        productname: req.body.productname,
        productprice: req.body.productprice,
        productdiscount: req.body.productdiscount,
        specialdiscount: req.body.specialdiscount,
        productdetails: req.body.productdetails,
        username: req.body.username,
        upload: req.file.filename,
    };
    var add1 = new productModel(add);
    add1.save()
    .then(()=>
    res.json("update successfully"))
    .catch(err => res.status(400).json("error:" + err));


});

router.get("/delete/:id", async (req, res) => {
    try{
        const productdata = await productModel.findByIdAndDelete(req.params.id);

        res.redirect("/viewproducts");
    }catch (err) {
        console.log(err);
    }
});

router.get("/edit/:id", async (req, res) => {
    try{
        const productdata = await productModel.findById(req.params.id);

        res.render("dashboard/edit-products",{editproduct:productdata});
    }catch (err) {
        console.log(err);
    }
});

router.post("/edit/:id", async(req,res) => {
    const updateproduct={
        productname: req.body.productname,
        productprice: req.body.productprice,
        productdiscount: req.body.productdiscount,
        specialdiscount: req.body.specialdiscount,
        productdetails: req.body.productdetails,
        username: req.body.username,
    }

    try{
        const updateitem = await productModel.findByIdAndUpdate(req.params.id , updateproduct);

        if(!updateitem) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.redirect("/viewproducts");
    } catch (err) {
        res.status(500).json({ message: "server error" });
    }
});



// ........................../////contact/////..........................

router.get ("/viewcontact",async function(req,res){
    var reg=await contactModel.find({})
    console.log(reg)
    if(req.session.user && req.cookies.user_sid){
    res.render("dashboard/viewcontact",{datacontact:reg});
    }
    else{
        res.redirect("/login")
    }
});

router.post("/contactus",(req , res) => {
    var con={
        fullname: req.body.fullname,
        mobile: req.body.mobile,
        email: req.body.email,
        query: req.body.query,
    };
    var con1 = new contactModel(con);
    con1.save()
    .then(()=>
    res.json("request send successfully"))
    .catch(err => res.status(400).json("error:" + err));


});

router.get("/delete_1/:id", async (req, res) => {
    try{
        const contactdata = await contactModel.findByIdAndDelete(req.params.id);

        res.redirect("/viewcontact");
    }catch (err) {
        console.log(err);
    }
});

router.get("/edit_1/:id", async (req, res) => {
    try{
        const contactdata = await contactModel.findById(req.params.id);

        res.render("dashboard/edit-contact",{editcontact:contactdata});
    }catch (err) {
        console.log(err);
    }
});

router.post("/edit_1/:id", async(req,res) => {
    const updatecontact={
        fullname: req.body.fullname,
        mobile: req.body.mobile,
        email: req.body.email,
        query: req.body.query,
    }

    try{
        const updateitem = await contactModel.findByIdAndUpdate(req.params.id , updatecontact);

        if(!updateitem) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.redirect("/viewcontact");
    } catch (err) {
        res.status(500).json({ message: "server error" });
    }
});

// ................................../////signup////..............................



router.post("/signup",(req , res) => {
    var register={
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        mobile: req.body.mobile,
        email: req.body.email,
        password: req.body.password,
    };
    var reg = new userModel(register);

    reg.save()
    .then(()=>
    res.json("register successfully"))
    .catch(err => res.status(400).json("error:" + err));

console.log(reg);
});

router.get ("/viewsignup",async function(req,res){
    var reg=await userModel.find({})
    console.log(reg)
    res.render("dashboard/viewsignup",{datasignup:reg});
});

router.get("/delete_2/:id", async (req, res) => {
    try{
        const signupdata = await userModel.findByIdAndDelete(req.params.id);

        res.redirect("/viewsignup");
    }catch (err) {
        console.log(err);
    }
});

router.get("/edit_2/:id", async (req, res) => {
    try{
        const signupdata = await userModel.findById(req.params.id);

        res.render("dashboard/edit-register",{editsignup:signupdata});
    }catch (err) {
        console.log(err);
    }
});

router.post("/edit_2/:id", async(req,res) => {
    const updatesignup={
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        mobile: req.body.mobile,
        email: req.body.email,
    }

    try{
        const updateitem = await userModel.findByIdAndUpdate(req.params.id , updatesignup);

        if(!updateitem) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.redirect("/viewsignup");
    } catch (err) {
        res.status(500).json({ message: "server error" });
    }
});



router.get ("/contactus",function(req,res){
    res.render("contactus");
});

// ........................../////login/////..........................



router.post("/login",async(req , res) => {
        email= req.body.email;
        password = req.body.password;
    
    try{
        var user = await userModel.findOne({email:email })
        .exec();
        if(!user){
            res.redirect("/login");
        }

        user.comparePassword(password,(error, match) => {
            if(!match) {
                res.redirect("/login");
            }
        });

        req.session.user = user;
        
            res.redirect("/dashboard")
        
    }
    catch (err){       
        console.log(err);
    }
});

   


// ........................../////product details/////..........................


router.get ("/productdetails/:id", async (req,res) => {
    try{
        const productdetails = await productModel.findById(req.params.id);

        res.render("productdetails", {productdata:productdetails});
    }

 catch (err) {
    console.log(err);
}
   
});



// ........................../////product details on index/////..........................

router.get ("/:id", async (req,res) => {
    try{
        const productdetails = await productModel.findById(req.params.id);

        res.render("index", {productdata1:productdetails});
    }

 catch (err) {
    console.log(err);
}
   
});









module.exports=router;
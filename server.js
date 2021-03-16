var express=require('express');
var mongoose=require('mongoose');
var User=require('./Models/User');
var Product=require('./Models/Product');
var bodyparser=require('body-parser');
var db=require('./Mysetup/myurls').myurl;
var app=express();
var urlencodedParser = bodyparser.urlencoded({ extended: false })
var jsonparser=bodyparser.json();

mongoose.connect(db).then(()=>{
    console.log("Database is connected");
}).catch(err=>{
    console.log("Error is "+ err.message);
})

//starting page
app.get('/',function(req,res){
    res.status(200).send("Hi, welcome to the Product crud app");

});

//signup
app.post('/signup',jsonparser,function(req,res){

    var newuser= new User(req.body);
    User.findOne({email:newuser.email},function(err,user){
        if(user){
            return res.status(500).json({auth:false,message:"email exist"});
        }
        console.log(newuser);
        newuser.save((err,doc)=>{
            if(err){
                console.log(err);
                return res.status(500).json({error:true,message:"User not created"});
            }
                return res.status(200).json({success:true,message:"User created",user : doc});

        });
    });
});

//signin
app.post('/signin',jsonparser,function(req,res){

    var userCred={};

    userCred.email=req.body.email;
    userCred.password=req.body.password;

    User.findOne({email:userCred.email},function(err,profile){

        if(!profile){
            return res.status(500).send("User not exist");
        }
        else{
            console.log(profile);
            console.log(profile.email);
            console.log(profile.password);
            if (userCred.password == profile.password && userCred.email==profile.email){
                return res.status(200).json({success:true,message:"User authenticated"});
            }
            else if(userCred.password != profile.password ){
                return res.status(500).json({error:true,message:"password is incorrect.Please try again"});
            }
            else if(userCred.email != profile.email){
                return res.status(500).json({error:true,message:"Email not exist.Create account"});
            }
            else{
                return res.status(500).json({error:true,message:"Unautherized access"});
            }
        }

    });

});


//create products
app.post('/product/create',jsonparser,function(req,res){
    var newprod= new Product(req.body);

    Product.findOne({productcode:newprod.productcode},function(err,prod){
        if(prod){
            return res.status(500).json({error:true,message:"Product already exist"});
        }
        newprod.save((err,doc)=>{
            if(err){
                return res.status(500).json({error:true,message:"Product not created "});
            }
            else{
                return res.status(200).json({success:true,message:"Product created "});
            }
        });
    });
});
//list of products
app.get('/product/list',function(req,res){

    Product.find({},function(err,cursor){
        if(err){
            return res.status(500).json({error:true,message:"Product data not retireved"});
        }
        else{
            return res.status(200).json({success:true,message:"Data retrieved",data:cursor});
        }
    });

});
//product delete
app.delete('/product/list/:id',function(req,res){
    Product.findByIdAndRemove(req.params.id,function(err){
        if(err){
            return res.status(500).json({error:true,message:"Product not removed"});
        }
        else{
            return res.status(200).json({success:true,message:"Product deleted"});
        }
    });
});
//product list by id
app.get('/product/:id',function(req,res){
    Product.findById(req.params.id,function(err,data){
        if(err){
            return res.status(500).json({error:true,message:"Product not exist"});
        }
        else{
            return res.status(200).json({success:true,message:"Found product",curr_data:data});
        }
    });
});

//product update 
app.put('/product/list/:id',jsonparser,function(req,res){
    // var updateprod= new Product(req.body);
    var newvalue={$set: {productname: req.body.productname,productcode:req.body.productcode,price:req.body.price}};
    Product.updateOne({_id:req.params.id},newvalue,function(err,data){
        if(err){
            return res.status(500).json({error:true,message:"Product Updation failed"});
        }
        else{
            return res.status(200).json({success:true,message:"Product Updated successfully", Updated_data:data});
            
        }
    });
});



app.listen(6000,function(){
    console.log("Port 6000 is listening");
});
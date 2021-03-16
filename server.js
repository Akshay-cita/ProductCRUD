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
app.post('/signup',jsonparser,async(req,res)=>{
    var newuser= new User(req.body);
    await User.findOne({email:newuser.email}).then(async (err,user)=>{
        if(user){
            return res.status(500).json({auth:false,message:"email exist"});
        }
        else {
            await newuser.save().then((err,doc)=>{
                return res.status(200).json({success:true,message:"User created",user : doc});  
            }).catch(err =>{
                return res.status(500).json({error:true,message:"User not created please fill required fields", error_details:err.message});
            });
        }
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
app.post('/product/create',jsonparser,async (req,res)=>{
    try{
    var newprod= new Product(req.body);
    const prod= await Product.findOne({productcode:newprod.productcode});
    console.log(prod);
    if(prod) throw new Error("product already exists");
    await newprod.save();
    return res.status(200).json({success:true,message:"Product created "});
    }catch(err){
        return res.status(500).send({error:true,message:""+ err});
    }
});


//list of products
app.get('/product/list',async (req,res)=>{
    await Product.find({}).then(cursor=>{
        return res.status(200).json({success:true,message:"Data retrieved",data:cursor}); 
    }).catch(err=>{
        return res.status(500).json({error:true,message:"Product data not retireved"});
    });
});

//product delete
app.delete('/product/list/:id',(req,res)=>{
    Product.findByIdAndRemove(req.params.id).then(()=>{
        return res.status(200).json({success:true,message:"Product deleted"})
    }).catch(err=>{
        return res.status(500).json({error:true,message:"Product not removed"});
    });
});
//product list by id
app.get('/product/:id',(req,res)=>{
    Product.findById(req.params.id).then(data=>{
        return res.status(200).json({success:true,message:"Found product",curr_data:data})
        }).catch(err=>{
            return res.status(500).json({error:true,message:"Product not exist in list"});
    });
});

//product update 
app.put('/product/list/:id',jsonparser,(req,res)=>{
    var newvalue={$set: {productname: req.body.productname,productcode:req.body.productcode,price:req.body.price}};
     Product.updateOne({_id:req.params.id},newvalue).then(data =>{
        return res.status(200).json({success:true,message:"Product Updated successfully", Updated_data:data})
        }).catch(err=>{
            return res.status(500).json({error:true,message:"Product Updation failed",err_msg:err.message});
    });
});



app.listen(6000,function(){
    console.log("Port 6000 is listening");
});
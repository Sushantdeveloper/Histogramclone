const express=require("express")
const router=express.Router();
const mongoose=require("mongoose");
const User=mongoose.model("User");
const bcrypt=require("bcryptjs");
const jwt =require("jsonwebtoken")
const {JWT_SECRET}=require('./token')


        //   api for sign up 
router.post('/sign',(req,res)=>{
   console.log( req.body)
const {name,email,password}=req.body
if(!email||!password||!name){
    res.json({error:"please add all the fields"})
}
User.findOne({email:email}).
then((savedUser)=>{
    if(savedUser){
        return res.status(422).json({errr:"user already exists with that db"})
    }
    

    // hashing the password 
    bcrypt.hash(password,12)
    .then(hashedpassword=>{
        const user=new User({
            name,
            email,
            password:hashedpassword
        })
        user.save()
        .then(user=>{
            res.json({message:"saved successfuly"})
        }).catch(err=>{
            console.log(err);
        })
    })

}).catch(err=>{console.log(err)})
})

//   api for sign in 
router.post('/signin',(req,res)=>{
    const {email,password}=req.body
    if(!email||!password){
        res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
         return res.status(422).json({err:"wrong email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
const {_id,name,email}=savedUser
                res.json({token,user:{_id,name,email}})
            
            }else{
                return res.status(422).json({error:"invalid password"})
            }
        }).catch(err=>{
            console.log(err)
        })
    })
})
module.exports = router;







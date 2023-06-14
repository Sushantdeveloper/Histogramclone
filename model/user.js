const mongoose =require('mongoose');

const {ObjectId}=mongoose.Schema.Types

const userSchema=new mongoose.Schema({
    name:{
        type:String,required:true
    },
    email:{
        type:String,required:true
    },
    // phoneno:{type:Number,require:true},
    password:{
        type:String,required:true
    },
    Photo: {
        type: String,
    },
    followers:[{
        type:ObjectId,ref:"User"
    }],

    following:[{
        type:ObjectId,ref:"User"

    }]
})

mongoose.model("User",userSchema)
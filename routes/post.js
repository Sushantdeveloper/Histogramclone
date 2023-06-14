const express=require("express")
const router=express.Router();
const mongoose=require("mongoose");
const User=mongoose.model("User");
const Post=mongoose.model("Post");
const reqlogin=require('../middleware/reqlogin')

const token = require("./token");



       // create api for delete

router.delete('/deletepost/:postId',reqlogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .then((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})
       //  api for comments

router.put('/comment',reqlogin,(req,res)=>{
    const comment = {
    text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        res.status(422).json({error: err});
    })
})

           // like or unlike api 
router.put('/like',reqlogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }) 
    .populate("postedBy","_id name")
    .then(result => {
                res.json(result);
            })
            .catch(err => {
                res.status(422).json({error: err});
            })
})

router.put('/unlike',reqlogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }) 
    .populate("postedBy","_id name")
    .then(result => {
                res.json(result);
            })
            .catch(err => {
                res.status(422).json({error: err});
            })
})


// create api to show all post into home page 

router.get('/allpost',reqlogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")

    .then(posts=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
})

       //    api for create post 
router.post('/createpost',reqlogin,(req,res)=>{
    const {title,body,pic}=req.body
    if(!title||!body||!pic){
        return res.status(422).json({error:"please add all the field"})
    }
    req.user.password=undefined
 const post=new Post({
    title,
    body,
    photo:pic,
    postedBy:req.user
 })
 post.save().then((result)=>{
    res.json({post:result})
 }).catch(err=>{
    console.log(err)
 })
})

        // api  for porofile
router.get("/mypost",reqlogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router;



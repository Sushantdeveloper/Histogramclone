const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const reqlogin=require('../middleware/reqlogin');
     

       //  api for user profile 
router.get("/user/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const posts = await Post.find({ postedBy: user._id }).populate(
        "postedBy",
        "_id name"
      );
      res.status(200).json({ user, posts });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

router.put("/follow", reqlogin, async (req, res) => {
    try {
        const followId = req.body.followId;
        const userId = req.user._id;

        // Update the followers array of the user being followed
        const updatedFollowedUser = await User.findByIdAndUpdate(followId, {
            $push: { followers: userId }
        }, { new: true });

        // Update the following array of the currently logged in user
        const updatedLoggedInUser = await User.findByIdAndUpdate(userId, {
            $push: { following: followId }
        }, { new: true });

        // Return the updated user object of the currently logged in user
        res.json(updatedLoggedInUser);
    } catch (err) {
        return res.status(422).json({ error: err });
    }
});
router.put("/unfollow", reqlogin, async (req, res) => {
    try {
        const followId = req.body.followId;
        const userId = req.user._id;

        // Update the followers array of the user being followed
        const updatedFollowedUser = await User.findByIdAndUpdate(followId, {
            $pull: { followers: userId }
        }, { new: true });

        // Update the following array of the currently logged in user
        const updatedLoggedInUser = await User.findByIdAndUpdate(userId, {
            $pull: { following: followId }
        }, { new: true });

        // Return the updated user object of the currently logged in user
        res.json(updatedLoggedInUser);
    } catch (err) {
        return res.status(422).json({ error: err });
    }
});

// to upload profile pic
router.put("/uploadProfilePic", reqlogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        $set: { Photo: req.body.pic }
    }, {
        new: true
    }).then((err,result) => {
        if(err){
        return  res.status(422).json({ error: err });

        }else{
            res.json(result);

        }
    })
});

// to show following post 
router.get("/myfollowingpost", reqlogin, (req, res)=>{
    Post.find({
        postedBy:{$in:req.user.following}
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json(posts)
    }).catch(err=>{console.log(err)})
})



module.exports = router;
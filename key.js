const mongoose=require('mongoose');
const mongourl="mongodb://127.0.0.1:27017/mydbname"

const connectToMongo=()=>{
    mongoose.connect(mongourl, {   useNewUrlParser: true,
        useUnifiedTopology: true }).then(()=>{
        console.log(`connection succesful`)
    
    }).catch((err)=>console.log("error ",err));
}
module.exports=connectToMongo;
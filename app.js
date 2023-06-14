
const connectToMongo=require('./key');
const express = require('express')
const cors = require("cors");
connectToMongo();
const app = express()
const port = process.env.port || 5000;
const path=require("path")

app.use(cors());
require('./model/user')
require('./model/post')

app.use(express.json());

app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))


// serving the fronend 
app.use(express.static(path.join(__dirname,"./histogram/build")))
app.get("*",(req,res)=>{
  res.sendFile(path.join(__dirname,"./histogram/build/index.html"),
  function(err){
    res.status(500).send(err)
  })
})
app.listen(port, () => {
  console.log(`Example app listening  at http://localhost:${port}`)
})
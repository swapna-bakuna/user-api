const express = require('express');
const app = express();
const path = require('path')
const bodyParser = require('body-parser')
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const userrouter = require('./router/userRoute');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads',express.static(path.join(__dirname, 'uploads')))
app.use("/api/user", userrouter);
const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/task")   
  .then(() =>{
    console.log("database is connected sucessfully");
  }).catch((e)=>{
    console.log("====error connecting db==",e)
  })
const port = 8000
app.listen(port, ()=>{
    console.log('server is running on port no 8000...');
})
module.exports = app
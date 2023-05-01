const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const http = require("http");
exports.getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decrypted = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(decrypted);
    const users = await User.find({ _id: decrypted.id });
    if (users.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    if(users[0]){
      const filePath = "http://localhost:8000/"+users[0]["profilepic"]
      users[0]["profilepic"] = filePath
    }
    res.status(200).json({
      status: "success",
      data: users[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.createprofile = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.create({
      email: req.body.email,
      phoneno: req.body.phoneno,
      password: req.body.password,
      //active: req.body.active
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JSON_EXPIRES_IN,
    });
    console.log(token);
    res.status(200).json({
      status: "sucess",
      token,
      data: user,
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
exports.updateuser = async (req, res) => {
  console.log(req.body);
  try {
    const user = await findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: true,
    });
    res.status(200).json({ status: "sucess", data: user });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.profilepic = async (req, res) => {
  try {
    console.log(req.file)
    const userId = req.params.id;
    const file = req.file
    const filePath = file.path
    const pic = await User.findByIdAndUpdate(userId, {
      profilepic: filePath,
    });
    res.status(200).json({ status: "success", data: pic });
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: "fail", message: err.message });
  }
};
exports.getactiveusers = async (req, res) => {
  try {
    let active = req.query["active"];
    const user = await User.find({ active: active });
    res.status(200).json({ status: "sucess", body: user });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
exports.getinactive = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    user.active = !user.active;
    await user.save();
    console.log(user);
    res.status(200).json({ user: user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.download = async(req, res) =>{
 try{
  const userId = req.params.id
  const user = await User.findOne({_id: userId})
  if(!user){
    return res.status.json({ message: 'user not found'})
  }
  const filePath = user.profilepic;
  res.download(filePath, (err) => {
    if (err) {
      console.error('Failed to download', err);
      res.status(500).json({ message: 'Failed to download profile picture' });
    }
  });
 }catch(err){
  res.status(401).json({status: 'fail', message: err.message})
 }
}
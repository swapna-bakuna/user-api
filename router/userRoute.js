const express = require("express");
const userrouter = express.Router();
const userController = require("./../controller/userController");
const authController = require("./../controller/authContoller");
const { model } = require("mongoose");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
let upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      try {
        let path = "./uploads/";

        if (!fs.existsSync(path)) {
          fs.mkdirSync(path, {
            recursive: true,
          });
        }

        cb(null, path);
      } catch (e) {
        console.error("ERROR IN DESTINATION :-", e);
      }
    },

    filename: function (req, file, cb) {
      cb(null, uuidv4() + "-" + file.originalname);
    },
  }),
});

userrouter.get(
  "/getallusers",
  authController.protect,
  userController.getProfile
);
userrouter.get("/getactiveusers", userController.getactiveusers);
userrouter.post("/signup", userController.createprofile);
userrouter.patch("/update/:id", userController.updateuser);
userrouter.patch(
  "/profilepic/:id",
  upload.single("profilepic"),
  userController.profilepic
);
userrouter.post("/login", authController.login);
userrouter.post("/logout", authController.logout);
userrouter.get("/active/:id", userController.getinactive);
userrouter.post("/download/:id", userController.download);
//userrouter.post("/bycrpt", authController.bycrpt)
//userrouter.patch("/update/:id", upload.single('profilepic'), profileController.profilepic)
module.exports = userrouter;

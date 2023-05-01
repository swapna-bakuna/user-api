const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const dotenv = require("dotenv");
dotenv.config();

exports.login = async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body)
  //check e, p
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "fail", message: "Email and password are required" });
  }
  //e =p,
  try {
    const user = await User.findOne({ email }).select("+password +active")
    //.select({active:true});
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }
    const passwordMatch = req.body.password === user.password;
    if (!passwordMatch) {
      console.log(passwordMatch, "=-", password);
      return res.status(401).json({ message: "Invalid email or password" });
    }
    //active
    if(!user.active){
      return res.status(401).json({message: "user is inactive"})
    }
    //s t
    console.log(process.env)
  const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JSON_EXPIRES_IN,
  }) 
    return res.status(200).json({ token,  message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.protect = async (req, res, next) => {
  //get t and check e & p
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('bearer')
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  console.log(token);
  if (!token) {
    return res.status(401).json({ status: "fail", body: "login into acess" });
  }
  //v t
  try {
    // Verify token
    const decrypted = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(decrypted);
    // C u exists
    const existsUser = await User.findById(decrypted.id);
    if (!existsUser) {
      return res.status(401).json({ status: "fail", body: "user not find" });
    }
    console.log(existsUser)
    //verify active or inactive
    if(!existsUser.active){
      return res.status(401).json({message: 'user is inactive'})
    }
  next();
  } catch (err) {
    //console.error(err);
    return res.status(401).json({ status: "fail", body: err.message });
  }
};

exports.logout = async (req, res) => {
  const token = req.headers.authorization || req.body.token;
  if (!token) {
    return res.status(400).json({ message: "Token not provided." });
  }
  if (token !== "valid_token") {
    return res.json({ message: "Logged out successfully." });
  }
  return res.json({ message: "Logged out successfully." });
};

/*exports.bycrpt = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.create({
      email: req.body.email,
      phoneno: req.body.phoneno,
      password: req.body.password
    });
    console.log(user);
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};*/

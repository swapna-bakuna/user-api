const mongoose = require("mongoose");
const bycrpt = require('bcryptjs');
const userSchema = mongoose.Schema({
  email: {
    type: "string",
    unique: true,
    allowNull: false,
  },
  phoneno:{type:Number},
  password: {
    type: "string",
    allowNull: false,
    minilength: 8,
  },
  profilepic:{type: String},
  active: {type: Boolean,  default: true}
})

userSchema.pre('save', function(next){
  if(!this.isModified('active')){
    return next();
  }
  if (!this.active) {
    console.log('User marked as inactive:', this.username);
  } else {
    console.log('User marked as active:', this.username);
  }
  return next();
})

/*userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bycrpt.hash(this.password, 12);
  next();
});*/
const User = mongoose.model("User", userSchema);
module.exports = User;
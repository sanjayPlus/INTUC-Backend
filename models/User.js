// userModel.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber:{
    type: String,
  },
  whatsappNumber:{
    type: String,
  },
  age:{
    type: String,
  },
  date_of_birth:{
    type:String,
  },
  block:String,
  constituency:String,
  union:String,
  addaar:{
    type:String,
    default:""
  },
  pan_card:{
    type:String,
    default:""
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verified:{
    type:Boolean,
    default:false
  },
  otp:{
    type:Number,
    default:null,
  },
  forgot_otp:{
    type:Number,
    default:null,
  },
  gallery_likes:{
    type:Array,
    default:[]
  
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

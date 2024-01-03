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
    type:Date,
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
  blood_group:{
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
  
  },
  profileImage:{
    type:String,
    default:""
  },
  payments:[{
    paymentId:String,
    amount:Number,
    date:String,
    merchantId:String,
    merchantTransactionId:String,
  }]
});

// Virtual for age calculation based on date_of_birth
userSchema.virtual('age').get(function() {
  if (this.date_of_birth) {
    const today = new Date();
    const birthDate = new Date(this.date_of_birth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  return null; // Return null if date_of_birth is not set
});

// Setting the virtual field to appear in JSON
userSchema.set('toJSON', { getters: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
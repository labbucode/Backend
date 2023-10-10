const mongoose = require("mongoose");


const { Schema,model } = mongoose;

const userSchema = new Schema({
     email:String,
     password:String
     


  });

 const userModel = model('user',userSchema);
 module.exports = userModel
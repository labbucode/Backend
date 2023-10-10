const mongoose = require("mongoose");


const { Schema,model } = mongoose;

const lisitngSchema = new Schema({
     project_name:String,
     reason:String,
     type:String,
     division:String,
     category:String,
     proiority:String,
     department:String,
     location:String,
     status:String,
     


  });

 const lisitngModel = model('lisitng',lisitngSchema);
 module.exports = lisitngModel
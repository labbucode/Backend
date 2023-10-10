const  express = require('express');
const  router = express.Router();
const userModel = require('../models/userModel')
const ACCESS_SECRET_TOKEN="af81a64c6180fe0daa0ff82b08c2c119f06d1f89443cab13ab6065a9e1aab248"
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { Long } = require('mongodb');
require('dotenv').config()
router.post('/register',async (req,res)=>{
  try{
    const {email,password} =req.body
    const hashedPwd = await bcrypt.hash(password,10)

    const user = await userModel.findOne({ email });

    if(user) return  res.json({"msg":"User Already Exist"})
    
    
   await userModel.create({email,password:hashedPwd})
    res.json({"msg":"success"})
  } catch(err){
    console.log(err);
    res.json({'error':err})
  }
  
})


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ Success: "False", message: 'Invalid User' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password); // Compare with the user's hashed password

    if (!passwordMatch) {
      return res.status(401).json({ Success: "False", message: 'Invalid Password' });
    }

    // At this point, authentication is successful

    const token = jwt.sign({ userId: user._id },ACCESS_SECRET_TOKEN, { expiresIn: '5h' });

    res.json({ Success:"True",Messsage:"Valid USer",access: token });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;

   



// authRouter.js
const express = require('express');
const router = express.Router();
const lisitngModel = require('../models/lisitngsModel')
// Define your authentication-related routes here
router.get('/',async (req, res) => {
    
    const data = await lisitngModel.find();
       res.json(data);
});

router.post('/',async (req, res) => {
    const {   project_name,
        reason,
        type,
        division,
        category,
        proiority,
        department,
        location,
        status,
        } = req.body
try {
   const data = await lisitngModel.create( {project_name,
        reason,
        type,
        division,
        category,
        proiority,
        department,
        location,
        status})
  if(!data) return
 res.json({"status":"success"});
} catch(err){
 console.log(err);
}
   
  
});

module.exports = router;

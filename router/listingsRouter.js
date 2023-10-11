const express = require('express');
const router = express.Router();
const lisitngModel = require('../models/lisitngsModel')

// Define your authentication-related routes here

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate the number of documents to skip based on the page and limit
    const skip = (page - 1) * limit;

    try {
        // Use the Mongoose find method with skip and limit
        const data = await lisitngModel
            .find()
            .skip(skip)
            .limit(limit)
            .exec();

        // Get the total count of documents to calculate the total pages
        const totalCount = await lisitngModel.countDocuments();

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalCount / limit);

        res.json({
            data,
            page,
            limit,
            totalPages,
            totalCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const data = await lisitngModel.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Create an object to store the counts
        const stats = {
            Registered: 0,
            Closed: 0,
            Running: 0,
            Cancelled:0
            
        };
        let totalCount = 0;
        // Populate the stats object with the counts
        data.forEach(item => {
            
            stats[item._id] = item.count;
            totalCount += item.count;
        });
        stats.total = totalCount;
        res.json({...stats});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.post('/',async (req, res) => {
    const {   project_name,
        reason,
        type,
        division,
        category,
        priority,
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
        priority,
        department,
        location,
        status})
  if(!data) return
 res.json({"status":"success"});
} catch(err){
 console.log(err);
}
   
  
});


router.put('/status', async (req, res) => {
   const {status,id} = req.body;
 
    try {
        // Find the document by ID and update the specific property
        const updatedItem = await lisitngModel.findByIdAndUpdate(
            id,
            { status: status },
            { new: true } // This option returns the updated document
        );

        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json(updatedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;


module.exports = router;
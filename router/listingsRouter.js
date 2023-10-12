const express = require('express');
const router = express.Router();
const lisitngModel = require('../models/lisitngsModel')

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    try {
        const data = await lisitngModel
            .find()
            .skip(skip)
            .limit(limit)
            .exec();

        const totalCount = await lisitngModel.countDocuments();

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

        const stats = {
            Registered: 0,
            Closed: 0,
            Running: 0,
            Cancelled:0
            
        };
        let totalCount = 0;
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
        const updatedItem = await lisitngModel.findByIdAndUpdate(
            id,
            { status: status },
            { new: true } 
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

const express = require('express');
const router = express.Router();
const lisitngModel = require('../models/lisitngsModel')
require('dotenv').config();

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


        const user = req.user;

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
            Cancelled: 0

        };
        let totalCount = 0;
        data.forEach(item => {

            stats[item._id] = item.count;
            totalCount += item.count;
        });
        stats.total = totalCount;
        res.json({ ...stats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/department-status-stats', async (req, res) => {
    try {
      const departmentStats = await lisitngModel.aggregate([
        {
          $group: {
            _id: "$department",
            statusCounts: {
              $push: { status: "$status", count: 1 }
            }
          }
        },
        {
          $project: {
            department: "$_id",
            statusCounts: 1,
            _id: 0
          }
        }
      ]);
  
      const stats = {};
  
      departmentStats.forEach(department => {
        const { department: departmentName, statusCounts } = department;
  
        const departmentStatusCounts = {
            Running: 0,
            Cancelled: 0, 
            Closed: 0, 
            Registered: 0,
        };

       
  
        statusCounts.forEach(statusCount => {
          const { status, count } = statusCount;
          if (departmentStatusCounts[status]) {
            departmentStatusCounts[status] += count;
          } else {
            departmentStatusCounts[status] = count;
          }
        });
  
        stats[departmentName] = departmentStatusCounts;
      });
  
      res.json(stats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  


router.post('/', async (req, res) => {
    const { project_name,
        reason,
        type,
        division,
        category,
        priority,
        department,
        startDate,
        lastDate,
        location,
        status,

    } = req.body
    try {
        const data = await lisitngModel.create({
            project_name,
            reason,
            type,
            division,
            category,
            priority,
            department,
            startDate,
            lastDate,
            location,
            status
        })
        if (!data) return
        res.json({ "status": "success" });
    } catch (err) {
        console.log(err);
    }
});


router.put('/status', async (req, res) => {
    const { status, id } = req.body;

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

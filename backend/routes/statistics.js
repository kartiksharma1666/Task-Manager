
const express = require('express');
const router = express.Router();
const Task = require('../models/taskModel');  

// Calculate statistics endpoint
router.get('/statistics', async (req, res) => {
  try {
    const tasks = await Task.find();  // Get all tasks from the database

    // Calculate task statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === 'finished').length;
    const pendingTasks = totalTasks - completedTasks;
    const completedPercentage = ((completedTasks / totalTasks) * 100).toFixed(2);
    const pendingPercentage = ((pendingTasks / totalTasks) * 100).toFixed(2);

    const timeStats = tasks.reduce(
      (acc, task) => {
        const startTime = new Date(task.startTime).getTime();
        const endTime = task.status === 'finished' ? new Date(task.endTime).getTime() : Date.now();
        const timeTaken = (endTime - startTime) / (1000 * 60 * 60); // time in hours

        if (task.status === 'finished') {
          acc.completedTime += timeTaken;
          acc.completedCount += 1;
        } else {
          const estimatedEndTime = new Date(task.endTime).getTime();
          const timeLapsed = (Date.now() - startTime) / (1000 * 60 * 60); // time in hours
          const timeRemaining = Math.max((estimatedEndTime - Date.now()) / (1000 * 60 * 60), 0); // remaining time

          acc.pendingTimeLapsed += timeLapsed;
          acc.pendingTimeRemaining += timeRemaining;
        }

        return acc;
      },
      {
        completedTime: 0,
        completedCount: 0,
        pendingTimeLapsed: 0,
        pendingTimeRemaining: 0,
      }
    );

    const averageCompletionTime =
      timeStats.completedCount > 0
        ? (timeStats.completedTime / timeStats.completedCount).toFixed(2)
        : 0;

    res.json({
      totalTasks,
      completedPercentage,
      pendingPercentage,
      pendingTimeLapsed: timeStats.pendingTimeLapsed.toFixed(2),
      pendingTimeRemaining: timeStats.pendingTimeRemaining.toFixed(2),
      averageCompletionTime,
    });
  } catch (error) {
    console.error('Error calculating statistics:', error);
    res.status(500).json({ message: 'Error calculating statistics' });
  }
});

module.exports = router;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormControl, InputLabel, Select, MenuItem, ToggleButton, ToggleButtonGroup, Typography, Box } from '@mui/material';

const TaskModal = ({ open, onClose, taskData, onTaskSubmit }) => {
  const [task, setTask] = useState({
    title: '',
    startTime: '',
    endTime: '',
    priority: 1,
    status: 'pending',
  });

  // Effect to handle when modal opens or taskData changes
  useEffect(() => {
    if (open) {
      if (taskData) {
        // If editing an existing task, populate the fields with the task data
        setTask({
          title: taskData.title,
          startTime: taskData.startTime,
          endTime: taskData.endTime,
          priority: taskData.priority,
          status: taskData.status,
        });
      } else {
        // Reset form when adding a new task
        setTask({
          title: '',
          startTime: '',
          endTime: '',
          priority: 1,
          status: 'pending',
        });
      }
    } else {
      // Reset the task state when modal is closed
      setTask({
        title: '',
        startTime: '',
        endTime: '',
        priority: 1,
        status: 'pending',
      });
    }
  }, [taskData, open]); // Re-run when `taskData` or `open` changes

  const handleSubmit = async () => {
    try {
      // Ensure title, startTime, and endTime are provided
      if (!task.title || !task.startTime || !task.endTime) {
        alert('Please fill in all required fields!');
        return;
      }

      if (taskData) {
        // Update existing task
        await axios.put(`https://task-manager-5-0aq7.onrender.com/api/tasks/${taskData._id}/status`, {
          status: task.status,
          actualEndTime: task.endTime,
        });
      } else {
        // Create a new task
        await axios.post('https://task-manager-5-0aq7.onrender.com/api/tasks', task);
      }

      onTaskSubmit(); // Notify parent component of the successful submission
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>{taskData ? 'Edit Task' : 'Add New Task'}</DialogTitle>
      <DialogContent sx={{ padding: '2rem' }}>
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            label="Task Title"
            fullWidth
            variant="outlined"
            margin="normal"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            sx={{ borderRadius: '8px' }}
          />
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <TextField
            label="Start Time"
            type="datetime-local"
            fullWidth
            variant="outlined"
            margin="normal"
            value={task.startTime}
            onChange={(e) => setTask({ ...task, startTime: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ borderRadius: '8px' }}
          />
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <TextField
            label="End Time"
            type="datetime-local"
            fullWidth
            variant="outlined"
            margin="normal"
            value={task.endTime}
            onChange={(e) => setTask({ ...task, endTime: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ borderRadius: '8px' }}
          />
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              value={task.priority}
              onChange={(e) => setTask({ ...task, priority: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            >
              {[1, 2, 3, 4, 5].map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {`${priority}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Toggle Button for Status */}
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            Status
          </Typography>
          <ToggleButtonGroup
            value={task.status}
            exclusive
            onChange={(e, newStatus) => newStatus && setTask({ ...task, status: newStatus })}
            aria-label="Task Status"
            fullWidth
            sx={{
              '& .MuiToggleButton-root': {
                borderRadius: '20px',
                marginRight: '8px',
                border: '1px solid #ccc',
                '&.Mui-selected': {
                  backgroundColor: '#4caf50',
                  color: '#fff',
                },
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
              },
            }}
          >
            <ToggleButton value="pending" aria-label="Pending">
              Pending
            </ToggleButton>
            <ToggleButton value="finished" aria-label="Finished">
              Finished
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: '1rem' }}>
        <Button onClick={onClose} color="secondary" variant="outlined" sx={{ borderRadius: '8px' }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained" sx={{ borderRadius: '8px' }}>
          {taskData ? 'Update Task' : 'Add Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;

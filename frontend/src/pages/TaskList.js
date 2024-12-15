import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button, Paper, Box, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { styled } from '@mui/system';

// Styled components for a more polished look
const StyledTableCell = styled(TableCell)({
  fontWeight: 'bold',
  color: '#616161',
});

const StyledTableRow = styled(TableRow)({
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
});

const StyledTableContainer = styled(TableContainer)({
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  overflow: 'hidden',
});

// Helper functions for time calculations
const calculateTotalTime = (startTime, endTime, status) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();

  let totalTime = 0;

  if (status === 'completed') {
    totalTime = (end - start) / (1000 * 60 * 60);
  }

  if (status === 'pending') {
    totalTime = (now - start) / (1000 * 60 * 60);
    if (totalTime < 0) totalTime = 0;
  }

  return totalTime.toFixed(2);
};

const calculateEstimatedTime = (startTime, endTime, status) => {
  const now = new Date();
  const end = new Date(endTime);
  let estimatedTime = 0;

  if (status === 'pending') {
    estimatedTime = (end - now) / (1000 * 60 * 60);
    if (estimatedTime < 0) estimatedTime = 0;
  }

  return estimatedTime.toFixed(2);
};

const TaskList = ({ tasks, onEdit, onDelete }) => {
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [sortOrder, setSortOrder] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleSelectTask = (taskId) => {
    setSelectedTasks((prevSelected) =>
      prevSelected.includes(taskId)
        ? prevSelected.filter((id) => id !== taskId)
        : [...prevSelected, taskId]
    );
  };

  const handleDeleteSelected = () => {
    selectedTasks.forEach((taskId) => onDelete(taskId));
    setSelectedTasks([]); // Clear selected tasks after deletion
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handlePriorityFilterChange = (event) => {
    setPriorityFilter(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  // Reset filters to their initial state
  const resetFilters = () => {
    setSortOrder('');
    setPriorityFilter('');
    setStatusFilter('');
  };

  // Sorting and filtering tasks based on user selection
  const sortedAndFilteredTasks = tasks
    .filter((task) => {
      return (
        (priorityFilter ? task.priority === priorityFilter : true) &&
        (statusFilter ? task.status === statusFilter : true)
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'startTimeASC') {
        return new Date(a.startTime) - new Date(b.startTime);
      } else if (sortOrder === 'startTimeDESC') {
        return new Date(b.startTime) - new Date(a.startTime);
      } else if (sortOrder === 'endTimeASC') {
        return new Date(a.endTime) - new Date(b.endTime);
      } else if (sortOrder === 'endTimeDESC') {
        return new Date(b.endTime) - new Date(a.endTime);
      } else {
        return 0;
      }
    });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Button
            onClick={handleDeleteSelected}
            variant="outlined"
            color="error"
            disabled={selectedTasks.length === 0}
          >
            Delete Selected Tasks
          </Button>
        </Box>
        <Box display="flex" gap="20px">
          <FormControl variant="outlined">
            <InputLabel>Sort By</InputLabel>
            <Select value={sortOrder} onChange={handleSortChange} label="Sort By">
              <MenuItem value="startTimeASC">Start Time: ASC</MenuItem>
              <MenuItem value="startTimeDESC">Start Time: DESC</MenuItem>
              <MenuItem value="endTimeASC">End Time: ASC</MenuItem>
              <MenuItem value="endTimeDESC">End Time: DESC</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined">
            <InputLabel>Priority</InputLabel>
            <Select value={priorityFilter} onChange={handlePriorityFilterChange} label="Priority">
              {[1, 2, 3, 4, 5].map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={handleStatusFilterChange} label="Status">
              <MenuItem value="finished">Finished</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>

          <Button
            onClick={resetFilters}
            variant="outlined"
            color="default"
            style={{ marginLeft: '10px' }}
          >
            Reset Filters
          </Button>
        </Box>
      </Box>

      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Select</StyledTableCell>
              <StyledTableCell>Task ID</StyledTableCell>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>Priority</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Start Time</StyledTableCell>
              <StyledTableCell>End Time</StyledTableCell>
              <StyledTableCell>Total Time (hrs)</StyledTableCell>
              <StyledTableCell>Estimated Time to Finish (hrs)</StyledTableCell>
              <StyledTableCell>Edit</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndFilteredTasks.map((task) => (
              <StyledTableRow key={task._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedTasks.includes(task._id)}
                    onChange={() => handleSelectTask(task._id)}
                  />
                </TableCell>
                <TableCell>{task._id}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>
                  <Typography variant="body2" color={task.status === 'completed' ? 'success.main' : 'warning.main'}>
                    {task.status}
                  </Typography>
                </TableCell>
                <TableCell>{new Date(task.startTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(task.endTime).toLocaleString()}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color={task.status === 'completed' ? 'primary.main' : 'textSecondary'}
                    fontWeight="bold"
                  >
                    {calculateTotalTime(task.startTime, task.endTime, task.status)} hrs
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color={task.status === 'pending' ? 'warning.main' : 'textSecondary'}
                    fontWeight="bold"
                  >
                    {calculateEstimatedTime(task.startTime, task.endTime, task.status)} hrs
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Button
                      onClick={() => onEdit(task)}
                      variant="contained"
                      color="primary"
                      size="small"
                      style={{ marginRight: '10px', borderRadius: '20px' }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => onDelete(task._id)}
                      color="error"
                      variant="outlined"
                      size="small"
                      style={{ borderRadius: '20px' }}
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Box>
  );
};

export default TaskList;

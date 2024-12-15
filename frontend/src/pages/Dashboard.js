import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Grid, Card, CardContent, Typography, Box, AppBar, Toolbar, IconButton, Container } from '@mui/material';
import TaskModal from './TaskModal';
import TaskList from './TaskList';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';  // Updated import

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [stats, setStats] = useState(null);  // Store statistics here
  const navigate = useNavigate();  // Updated hook

  // Fetch tasks and statistics from the API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch tasks
        const tasksResponse = await axios.get('http://localhost:5000/api/tasks');
        setTasks(tasksResponse.data);

        // Fetch statistics
        const statsResponse = await axios.get('http://localhost:5000/api/statistics');
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleOpenModal = (task = null) => {
    setSelectedTask(task);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTask(null);
  };

  const handleTaskSubmit = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleLogout = () => {
    navigate('/login'); // Redirect to login page
  };

  if (!stats) {
    return <div>Loading...</div>;  // Show loading state until stats are fetched
  }

  return (
    <div>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container>
        <Grid container spacing={3} mt={3}>
          {/* Task Statistics Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">Total Tasks</Typography>
                <Typography variant="h4">{stats.totalTasks}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">Completed Tasks</Typography>
                <Typography variant="h4">{stats.completedPercentage}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">Pending Tasks</Typography>
                <Typography variant="h4">{stats.pendingPercentage}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">Average Completion Time</Typography>
                <Typography variant="h4">{stats.averageCompletionTime} hrs</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button variant="contained" color="primary" onClick={() => handleOpenModal()} sx={{ mb: 2 }}>
            Add New Task
          </Button>
          <TaskList tasks={tasks} onEdit={handleOpenModal} onDelete={handleDelete} />
          <TaskModal open={openModal} onClose={handleCloseModal} taskData={selectedTask} onTaskSubmit={handleTaskSubmit} />
        </Box>
      </Container>
    </div>
  );
};

export default Dashboard;

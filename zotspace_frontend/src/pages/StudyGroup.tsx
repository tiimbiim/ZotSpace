import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add as AddIcon, FilterList as FilterIcon } from '@mui/icons-material';
import CreateStudyRoom from '../components/CreateStudyRoom';
import './StudyGroup.css';

const StudyGroup: React.FC = () => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false);
  const [userCourses, setUserCourses] = useState<string[]>([]); // This should be populated from user data

  return (
    <div className="study-group-page">
      <header className="study-group-header">
        <h1>Find Study Group</h1>
        <p>Connect with other students for group study sessions</p>
      </header>
      <main className="study-group-content">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Study Groups
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreateDialog(true)}
              sx={{ mr: 2 }}
            >
              Create Room
            </Button>
            <Tooltip title="Filter rooms">
              <IconButton onClick={() => setShowAvailableOnly(!showAvailableOnly)}>
                <FilterIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <div className="search-section">
          <h2>Search Study Groups</h2>
          <div className="search-filters">
            <input 
              type="text" 
              placeholder="Search by subject or course..."
              className="search-input"
            />
            <FormControl fullWidth>
              <InputLabel>Filter by Course</InputLabel>
              <Select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value as string)}
                label="Filter by Course"
              >
                <MenuItem value="">All Courses</MenuItem>
                {userCourses.map((course) => (
                  <MenuItem key={course} value={course}>
                    {course}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="groups-list">
          <h2>Available Study Groups</h2>
          <div className="group-card">
            <h3>CS 143 Study Group</h3>
            <p>Meeting Time: Monday, 2:00 PM</p>
            <p>Location: Science Library</p>
            <p>Members: 4/6</p>
            <button className="join-button">Join Group</button>
          </div>
          {/* More group cards will be added dynamically */}
        </div>
      </main>

      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Study Room</DialogTitle>
        <DialogContent>
          <CreateStudyRoom
            onSuccess={() => {
              setOpenCreateDialog(false);
              // Refresh the study groups list
            }}
            onCancel={() => setOpenCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudyGroup; 
import React, { useState, useEffect } from 'react';
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
import { StudyRoom, studyRoomService } from '../services/studyRoomService';
import CreateStudyRoom from './CreateStudyRoom';

const StudyRooms: React.FC = () => {
  const [studyRooms, setStudyRooms] = useState<StudyRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [userCourses, setUserCourses] = useState<string[]>([]); // This should be populated from user data

  useEffect(() => {
    fetchStudyRooms();
  }, [selectedCourse, showAvailableOnly]);

  const fetchStudyRooms = async () => {
    try {
      setLoading(true);
      const rooms = await studyRoomService.getStudyRooms(
        selectedCourse || undefined,
        showAvailableOnly
      );
      setStudyRooms(rooms);
      setError(null);
    } catch (err) {
      setError('Failed to fetch study rooms. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (roomId: number) => {
    try {
      await studyRoomService.joinStudyRoom(roomId);
      fetchStudyRooms(); // Refresh the list
    } catch (err) {
      setError('Failed to join study room. Please try again later.');
    }
  };

  const handleLeaveRoom = async (roomId: number) => {
    try {
      await studyRoomService.leaveStudyRoom(roomId);
      fetchStudyRooms(); // Refresh the list
    } catch (err) {
      setError('Failed to leave study room. Please try again later.');
    }
  };

  const handleBookSlot = async (roomId: number, slotId: number) => {
    try {
      await studyRoomService.bookSlot(roomId, slotId);
      fetchStudyRooms(); // Refresh the list
    } catch (err) {
      setError('Failed to book slot. Please try again later.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Study Rooms
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

      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Filter by Course</InputLabel>
          <Select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
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
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {studyRooms.map((room) => (
          <Grid item xs={12} md={6} lg={4} key={room.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {room.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Location: {room.location}
                </Typography>
                <Typography variant="body2" paragraph>
                  {room.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Created by: {room.created_by.net_id}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Participants: {room.participants.length}/{room.capacity}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Available Slots: {room.available_slots}
                  </Typography>
                </Box>
                {room.tech_enhanced && (
                  <Chip label="Tech Enhanced" color="primary" size="small" />
                )}
              </CardContent>
              <CardActions>
                {room.participants.some((p) => p.net_id === 'current_user_net_id') ? (
                  <Button
                    color="error"
                    onClick={() => handleLeaveRoom(room.id)}
                  >
                    Leave Room
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    onClick={() => handleJoinRoom(room.id)}
                    disabled={room.participants.length >= room.capacity}
                  >
                    Join Room
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

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
              fetchStudyRooms();
            }}
            onCancel={() => setOpenCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default StudyRooms; 
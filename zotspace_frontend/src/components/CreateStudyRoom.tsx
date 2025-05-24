import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Typography,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormLabel,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { studyRoomService, CreateStudyRoomData } from '../services/studyRoomService';
import { libraryService, LibraryStudyRoom } from '../services/libraryService';

interface CreateStudyRoomProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateStudyRoom: React.FC<CreateStudyRoomProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<CreateStudyRoomData>({
    name: '',
    capacity: 2,
    location: '',
    description: '',
    directions: '',
    tech_enhanced: false,
    slots: [{ start_time: '', end_time: '' }],
    course: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [libraryRooms, setLibraryRooms] = useState<LibraryStudyRoom[]>([]);
  const [locationType, setLocationType] = useState<'custom' | 'library'>('custom');
  const [selectedLibraryRoom, setSelectedLibraryRoom] = useState<string>('');

  useEffect(() => {
    fetchLibraryRooms();
  }, []);

  const fetchLibraryRooms = async () => {
    try {
      const rooms = await libraryService.getStudyRooms();
      setLibraryRooms(rooms);
    } catch (err) {
      setError('Failed to fetch library rooms. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLocationTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newType = e.target.value as 'custom' | 'library';
    setLocationType(newType);
    if (newType === 'library' && selectedLibraryRoom) {
      const room = libraryRooms.find(r => r.id === selectedLibraryRoom);
      if (room) {
        setFormData(prev => ({
          ...prev,
          location: room.location,
          description: room.description,
          directions: room.directions,
          tech_enhanced: room.techEnhanced,
          capacity: room.capacity,
        }));
      }
    }
  };

  const handleLibraryRoomChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const roomId = e.target.value as string;
    setSelectedLibraryRoom(roomId);
    const room = libraryRooms.find(r => r.id === roomId);
    if (room) {
      setFormData(prev => ({
        ...prev,
        location: room.location,
        description: room.description,
        directions: room.directions,
        tech_enhanced: room.techEnhanced,
        capacity: room.capacity,
      }));
    }
  };

  const handleSlotChange = (index: number, field: 'start_time' | 'end_time', value: string) => {
    setFormData((prev) => {
      const newSlots = [...prev.slots];
      newSlots[index] = { ...newSlots[index], [field]: value };
      return { ...prev, slots: newSlots };
    });
  };

  const addSlot = () => {
    setFormData((prev) => ({
      ...prev,
      slots: [...prev.slots, { start_time: '', end_time: '' }],
    }));
  };

  const removeSlot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      slots: prev.slots.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await studyRoomService.createStudyRoom(formData);
      onSuccess();
    } catch (err) {
      setError('Failed to create study room. Please try again.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Room Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Course (Optional)</InputLabel>
            <Select
              value={formData.course}
              onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
              label="Course (Optional)"
            >
              <MenuItem value="">No Course</MenuItem>
              {/* Add your course options here */}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormLabel component="legend">Location Type</FormLabel>
          <RadioGroup
            row
            value={locationType}
            onChange={handleLocationTypeChange}
          >
            <FormControlLabel value="custom" control={<Radio />} label="Custom Location" />
            <FormControlLabel value="library" control={<Radio />} label="Library Room" />
          </RadioGroup>
        </Grid>

        {locationType === 'library' ? (
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Select Library Room</InputLabel>
              <Select
                value={selectedLibraryRoom}
                onChange={handleLibraryRoomChange}
                label="Select Library Room"
              >
                {libraryRooms.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    {room.name} - {room.location} (Capacity: {room.capacity})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ) : (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                inputProps={{ min: 2 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Directions"
                name="directions"
                value={formData.directions}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.tech_enhanced}
                    onChange={handleInputChange}
                    name="tech_enhanced"
                  />
                }
                label="Tech Enhanced Room"
              />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Available Time Slots
          </Typography>
          {formData.slots.map((slot, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Start Time"
                  value={slot.start_time}
                  onChange={(newValue) => handleSlotChange(index, 'start_time', newValue?.toISOString() || '')}
                  sx={{ mr: 2 }}
                />
                <DateTimePicker
                  label="End Time"
                  value={slot.end_time}
                  onChange={(newValue) => handleSlotChange(index, 'end_time', newValue?.toISOString() || '')}
                  sx={{ mr: 2 }}
                />
              </LocalizationProvider>
              <IconButton
                color="error"
                onClick={() => removeSlot(index)}
                disabled={formData.slots.length === 1}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={addSlot}
            variant="outlined"
            sx={{ mt: 1 }}
          >
            Add Time Slot
          </Button>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Typography color="error">{error}</Typography>
          </Grid>
        )}

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="submit" variant="contained">
              Create Room
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateStudyRoom; 
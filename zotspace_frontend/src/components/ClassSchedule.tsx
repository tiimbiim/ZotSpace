import React, { useState, useEffect } from 'react';
import { ClassData, anteaterApi } from '../services/anteaterApi';
import {
  Box,
  Container,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
} from '@mui/material';

const ClassSchedule: React.FC = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await anteaterApi.getEnrollmentHistory();
      setClasses(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch classes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchClasses();
      return;
    }

    try {
      setLoading(true);
      const results = await anteaterApi.searchClasses(searchQuery);
      setClasses(results);
      setError(null);
    } catch (err) {
      setError('Failed to search classes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatMeetingTime = (meeting: ClassData['meetings'][0]) => {
    return `${meeting.days} ${meeting.time}`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Class Schedule
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Search Classes"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by department, course number, or instructor"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {classes.map((classData) => (
            <Grid item xs={12} md={6} lg={4} key={classData.sectionCode}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {classData.department} {classData.courseNumber}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Section {classData.sectionNum} - {classData.sectionType}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Units: {classData.units}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Instructors: {classData.instructors.join(', ')}
                  </Typography>
                  {classData.meetings.map((meeting, index) => (
                    <Typography key={index} variant="body2">
                      Meeting: {formatMeetingTime(meeting)}
                      <br />
                      Location: {meeting.bldg.join(', ')}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ClassSchedule; 
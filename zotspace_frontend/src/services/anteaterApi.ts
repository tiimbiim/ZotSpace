import axios from 'axios';

const API_BASE_URL = 'https://anteaterapi.com/v2';

export interface Meeting {
  bldg: string[];
  days: string;
  time: string;
}

export interface ClassData {
  year: string;
  quarter: string;
  sectionCode: string;
  department: string;
  courseNumber: string;
  sectionType: string;
  sectionNum: string;
  units: string;
  instructors: string[];
  meetings: Meeting[];
  finalExam: string;
  dates: string[];
  maxCapacityHistory: string[];
  totalEnrolledHistory: string[];
  waitlistHistory: string[];
  waitlistCapHistory: string[];
  requestedHistory: string[];
  newOnlyReservedHistory: string[];
  statusHistory: string[];
}

export interface ApiResponse {
  ok: boolean;
  data: ClassData[];
}

export const anteaterApi = {
  async getEnrollmentHistory(): Promise<ClassData[]> {
    try {
      const response = await axios.get<ApiResponse>(`${API_BASE_URL}/rest/enrollmentHistory`);
      if (response.data.ok) {
        return response.data.data;
      }
      throw new Error('Failed to fetch enrollment history');
    } catch (error) {
      console.error('Error fetching enrollment history:', error);
      throw error;
    }
  },

  async searchClasses(query: string): Promise<ClassData[]> {
    try {
      const response = await axios.get<ApiResponse>(`${API_BASE_URL}/rest/enrollmentHistory`);
      if (response.data.ok) {
        const classes = response.data.data;
        return classes.filter(classData => 
          classData.department.toLowerCase().includes(query.toLowerCase()) ||
          classData.courseNumber.toLowerCase().includes(query.toLowerCase()) ||
          classData.instructors.some(instructor => 
            instructor.toLowerCase().includes(query.toLowerCase())
          )
        );
      }
      throw new Error('Failed to search classes');
    } catch (error) {
      console.error('Error searching classes:', error);
      throw error;
    }
  }
}; 
import axios from 'axios';

const API_BASE_URL = '/api';

export interface StudyRoomSlot {
  id: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface StudyRoom {
  id: number;
  name: string;
  capacity: number;
  location: string;
  description: string;
  directions: string;
  tech_enhanced: boolean;
  created_by: {
    net_id: string;
    email: string;
  };
  participants: Array<{
    net_id: string;
    email: string;
  }>;
  slots: StudyRoomSlot[];
  available_slots: number;
}

export interface CreateStudyRoomData {
  name: string;
  capacity: number;
  location: string;
  description?: string;
  directions?: string;
  tech_enhanced: boolean;
  slots: Array<{
    start_time: string;
    end_time: string;
  }>;
}

export const studyRoomService = {
  async getStudyRooms(course?: string, availableOnly?: boolean): Promise<StudyRoom[]> {
    try {
      const params = new URLSearchParams();
      if (course) params.append('course', course);
      if (availableOnly) params.append('available_only', 'true');

      const response = await axios.get<StudyRoom[]>(`${API_BASE_URL}/study-rooms/`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching study rooms:', error);
      throw error;
    }
  },

  async createStudyRoom(data: CreateStudyRoomData): Promise<StudyRoom> {
    try {
      const response = await axios.post<StudyRoom>(`${API_BASE_URL}/study-rooms/`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating study room:', error);
      throw error;
    }
  },

  async joinStudyRoom(roomId: number): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/study-rooms/${roomId}/join/`);
    } catch (error) {
      console.error('Error joining study room:', error);
      throw error;
    }
  },

  async leaveStudyRoom(roomId: number): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/study-rooms/${roomId}/leave/`);
    } catch (error) {
      console.error('Error leaving study room:', error);
      throw error;
    }
  },

  async bookSlot(roomId: number, slotId: number): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/study-rooms/${roomId}/book_slot/`, { slot_id: slotId });
    } catch (error) {
      console.error('Error booking slot:', error);
      throw error;
    }
  }
}; 
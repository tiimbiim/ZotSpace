import axios from 'axios';

const API_BASE_URL = 'https://anteaterapi.com/v2';

export interface LibraryStudyRoom {
  id: string;
  name: string;
  capacity: number;
  location: string;
  description: string;
  directions: string;
  techEnhanced: boolean;
  slots: Array<{
    studyRoomId: string;
    start: string;
    end: string;
    isAvailable: boolean;
  }>;
}

export const libraryService = {
  async getStudyRooms(): Promise<LibraryStudyRoom[]> {
    try {
      const response = await axios.get<{ ok: boolean; data: LibraryStudyRoom[] }>(
        `${API_BASE_URL}/rest/studyRooms`
      );
      if (response.data.ok) {
        return response.data.data;
      }
      throw new Error('Failed to fetch library study rooms');
    } catch (error) {
      console.error('Error fetching library study rooms:', error);
      throw error;
    }
  }
}; 
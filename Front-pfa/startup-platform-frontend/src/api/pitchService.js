// src/services/pitchService.js
import axios from 'axios';

const PITCH_BASE_URL = 'http://localhost:8083/api/pitchs';

const pitchService = {
  generatePitch: async (pitchData) => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Non authentifié');

    const response = await axios.post(`${PITCH_BASE_URL}/generate`, pitchData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getMyPitches: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Non authentifié');

    const response = await axios.get(`${PITCH_BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

export default pitchService;
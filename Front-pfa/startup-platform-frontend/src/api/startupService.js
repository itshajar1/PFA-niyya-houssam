// src/services/startupService.js
import axios from 'axios';

const STARTUP_BASE_URL = 'http://localhost:8082/api/startups';

const startupService = {
  getMyStartup: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Non authentifié');

    const response = await axios.get(`${STARTUP_BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

export default startupService;
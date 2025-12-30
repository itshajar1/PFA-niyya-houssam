
export const BASE_URL = 'http://localhost:8080'; 


export const AUTH_ENDPOINTS = {
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REFRESH_TOKEN: '/api/auth/refresh-token',
  ME: '/api/users/me',
  UPDATE_PROFILE: '/api/users/me',
  DELETE_ACCOUNT: '/api/users/me'
};


export const ROLES = {
  STARTUP: 'STARTUP',
  INVESTOR: 'INVESTOR',
  ADMIN: 'ADMIN'
};
export const SECTEURS = [
  'FinTech',
  'EdTech',
  'HealthTech',
  'E-commerce',
  'AgriTech',
  'CleanTech',
  'BioTech',
  'PropTech',
  'FoodTech'
];

export const ROLES2 = [
  'CEO',
  'CTO',
  'CMO',
  'CFO',
  'COO',
  'Developer',
  'Designer',
  'Marketing',
  'Sales'
];

export const MILESTONE_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
};
// Cambiá solamente esta URL si Django corre en otro puerto u otra PC.
export const API_BASE_URL = 'http://127.0.0.1:8000';
export const DEMO_STORAGE_KEY = 'campuslab_demo_mode';
export const isDemo = () => localStorage.getItem(DEMO_STORAGE_KEY) === 'true';

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';

// A simple utility to fetch and format API calls using Axios with robust fallbacks
export async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // We try fetching from the local server route first (allows Vite proxy /api to work)
  const url = `${BASE_URL}/${cleanEndpoint}`;
  
  try {
    const response = await axios.get<T>(url);
    return response.data;
  } catch (error) {
    console.warn(`Axios fetch to ${url} failed, attempting backend fallback...`, error);
    
    // Fallback: Connect directly to the Flask backend
    const fallbackUrl = `http://127.0.0.1:5000/${cleanEndpoint}`;
    
    const fallbackResponse = await axios.get<T>(fallbackUrl);
    return fallbackResponse.data;
  }
}

export async function postToApi<T>(endpoint: string, data: any): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = `${BASE_URL}/${cleanEndpoint}`;
  
  try {
    const response = await axios.post<T>(url, data);
    return response.data;
  } catch (error) {
    console.warn(`Axios POST to ${url} failed, attempting backend fallback...`, error);
    const fallbackUrl = `http://127.0.0.1:5000/${cleanEndpoint}`;
    const fallbackResponse = await axios.post<T>(fallbackUrl, data);
    return fallbackResponse.data;
  }
}

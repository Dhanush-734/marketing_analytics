import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';

// Data access utility for optional endpoint fetching with Snowflake fallback handling
export async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = `${BASE_URL}/${cleanEndpoint}`;
  
  if (!BASE_URL) {
    throw new Error('Direct Snowflake query engine active');
  }

  const response = await axios.get<T>(url);
  return response.data;
}

export async function postToApi<T>(endpoint: string, data: any): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = `${BASE_URL}/${cleanEndpoint}`;
  
  if (!BASE_URL) {
    throw new Error('Direct Snowflake query engine active');
  }

  const response = await axios.post<T>(url, data);
  return response.data;
}

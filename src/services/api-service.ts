import axios from "axios";
import { toast } from "sonner";

// Base API URL for production (through proxy server)
export const API_BASE_URL = 'http://localhost:3000/api';

// User interface for localStorage
export interface User {
  id: string;
  role: string;
  organization_id?: string;
  name?: string;
  email?: string;
}

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Get the current user from localStorage
 * @returns User object or null if not found
 */
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr) as User;
    // Validate required fields
    if (!user.id || !user.role) {
      console.error('Invalid user data in localStorage');
      localStorage.removeItem("user");
      return null;
    }
    return user;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    localStorage.removeItem("user");
    return null;
  }
};

/**
 * Generic API service for making API requests
 */
export const apiService = {
  /**
   * Make a GET request to the API
   */
  async get<T>(endpoint: string, userId?: string): Promise<T> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (userId) {
        headers['x-uuid'] = userId;
      }
      
      console.log('Request details:', {
        method: 'GET',
        url: `${API_BASE_URL}${endpoint}`,
        headers,
        userId
      });
      
      const response = await api.get(endpoint, { headers });
      console.log(`Response from ${endpoint}:`, response.data);
      return response.data as T;
    } catch (error) {
      console.error(`GET request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * Make a POST request to the API
   */
  async post<T>(endpoint: string, data: any, userId?: string): Promise<T> {
    try {
      console.log(`Fazendo requisição POST para: ${endpoint}`);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (userId) {
        headers['x-uuid'] = userId;
      }
      
      const response = await api.post(endpoint, data, { headers });
      return response.data as T;
    } catch (error) {
      console.error(`POST request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * Make a PUT request to the API
   */
  async put<T>(endpoint: string, data: any, userId?: string): Promise<T> {
    try {
      console.log(`Fazendo requisição PUT para: ${endpoint}`);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (userId) {
        headers['x-uuid'] = userId;
      }
      
      const response = await api.put(endpoint, data, { headers });
      return response.data as T;
    } catch (error) {
      console.error(`PUT request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * Make a DELETE request to the API
   */
  async delete(endpoint: string, userId?: string): Promise<void> {
    try {
      console.log(`Fazendo requisição DELETE para: ${endpoint}`);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (userId) {
        headers['x-uuid'] = userId;
      }
      
      await api.delete(endpoint, { headers });
    } catch (error) {
      console.error(`DELETE request failed for ${endpoint}:`, error);
      throw error;
    }
  }
};

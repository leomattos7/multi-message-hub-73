
import axios from "axios";
import { toast } from "sonner";

// Base API URL for Lambda Express.js endpoint
export const API_BASE_URL = 'https://2suwazl6jc.execute-api.sa-east-1.amazonaws.com/serveless_health_prod';

/**
 * Generic API service that adds the x-uuid header to all requests
 */
export const apiService = {
  /**
   * Make a GET request to the API
   */
  async get<T>(endpoint: string, userId?: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api${endpoint}`, {
        params,
        headers: {
          'Content-Type': 'application/json',
          'x-uuid': userId || '123'
        }
      });
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
      const response = await axios.post(`${API_BASE_URL}/api${endpoint}`, data, {
        headers: {
          'Content-Type': 'application/json',
          'x-uuid': userId || '123'
        }
      });
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
      const response = await axios.put(`${API_BASE_URL}/api${endpoint}`, data, {
        headers: {
          'Content-Type': 'application/json',
          'x-uuid': userId || '123'
        }
      });
      return response.data as T;
    } catch (error) {
      console.error(`PUT request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * Make a DELETE request to the API
   */
  async delete<T>(endpoint: string, userId?: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api${endpoint}`, {
        params,
        headers: {
          'Content-Type': 'application/json',
          'x-uuid': userId || '123'
        }
      });
      return response.data as T;
    } catch (error) {
      console.error(`DELETE request failed for ${endpoint}:`, error);
      throw error;
    }
  }
};

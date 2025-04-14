import axios from "axios";
import { toast } from "sonner";

// Base API URL for Lambda Express.js endpoint
export const API_BASE_URL = '';

/**
 * Generic API service for making API requests
 */
export const apiService = {
  /**
   * Make a GET request to the API
   */
  async get<T>(endpoint: string, userId?: string, params?: Record<string, any>): Promise<T> {
    try {
      console.log(`Fazendo requisição GET para: ${endpoint}`);
      const response = await axios.get(endpoint, {
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
      console.log(`Fazendo requisição POST para: ${endpoint}`);
      const response = await axios.post(endpoint, data, {
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
      console.log(`Fazendo requisição PUT para: ${endpoint}`);
      const response = await axios.put(endpoint, data, {
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
  async delete(endpoint: string, userId?: string, params?: Record<string, any>): Promise<void> {
    try {
      console.log(`Fazendo requisição DELETE para: ${endpoint}`);
      await axios.delete(endpoint, {
        params,
        headers: {
          'Content-Type': 'application/json',
          'x-uuid': userId || '123'
        }
      });
    } catch (error) {
      console.error(`DELETE request failed for ${endpoint}:`, error);
      throw error;
    }
  }
};

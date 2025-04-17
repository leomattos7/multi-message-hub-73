import axios from "axios";
import { toast } from "sonner";

// Base API URL for production (through proxy server)
export const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Generic API service for making API requests
 */
export const apiService = {
  /**
   * Make a GET request to the API
   */
  async get<T>(endpoint: string, userId: string): Promise<T> {
    try {
      console.log(`Fazendo requisição GET para: ${endpoint}`);
      const response = await api.get(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          'x-uuid': userId
        }
      });
      console.log(`Resposta GET para ${endpoint}:`, response.data);
      return response.data as T;
    } catch (error) {
      console.error(`GET request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * Make a POST request to the API
   */
  async post<T>(endpoint: string, data: any, userId: string): Promise<T> {
    try {
      console.log(`Fazendo requisição POST para: ${endpoint}`);
      const response = await api.post(endpoint, data, {
        headers: {
          'Content-Type': 'application/json',
          'x-uuid': userId
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
  async put<T>(endpoint: string, data: any, userId: string): Promise<T> {
    try {
      console.log(`Fazendo requisição PUT para: ${endpoint}`);
      const response = await api.put(endpoint, data, {
        headers: {
          'Content-Type': 'application/json',
          'x-uuid': userId
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
  async delete(endpoint: string, userId: string): Promise<void> {
    try {
      console.log(`Fazendo requisição DELETE para: ${endpoint}`);
      await api.delete(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          'x-uuid': userId
        }
      });
    } catch (error) {
      console.error(`DELETE request failed for ${endpoint}:`, error);
      throw error;
    }
  }
};

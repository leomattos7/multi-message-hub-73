import axios from "axios";
import { toast } from "sonner";

// Base API URL for local development with proxy
export const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:8080/api' 
  : 'https://2suwazl6jc.execute-api.sa-east-1.amazonaws.com/serveless_health_prod/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-uuid': '123' // Default value for development
  },
  withCredentials: false // Disable credentials for CORS
});

/**
 * Generic API service for making API requests
 */
export const apiService = {
  /**
   * Make a GET request to the API
   */
  async get<T>(endpoint: string, userId?: string, params?: Record<string, any>): Promise<T> {
    try {
      console.log(`Fazendo requisição GET para: ${endpoint}`, { params });
      const response = await api.get(endpoint, {
        params,
        headers: {
          'Content-Type': 'application/json',
          'x-uuid': userId || '123' // Use provided userId or fallback to '123'
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
  async post<T>(endpoint: string, data: any, userId?: string): Promise<T> {
    try {
      console.log(`Fazendo requisição POST para: ${endpoint}`);
      const response = await api.post(endpoint, data, {
        headers: {
          'Content-Type': 'application/json',
          'x-uuid': userId || '123' // Use provided userId or fallback to '123'
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
      const response = await api.put(endpoint, data, {
        headers: {
          'Content-Type': 'application/json',
          'x-uuid': userId || '123' // Use provided userId or fallback to '123'
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
      await api.delete(endpoint, {
        params,
        headers: {
          'Content-Type': 'application/json',
          'x-uuid': userId || '123' // Use provided userId or fallback to '123'
        }
      });
    } catch (error) {
      console.error(`DELETE request failed for ${endpoint}:`, error);
      throw error;
    }
  }
};

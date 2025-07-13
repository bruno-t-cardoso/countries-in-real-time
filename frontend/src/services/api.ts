import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, Country, Region, WorldStats } from '../types';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        config.params = {
          ...config.params,
          _t: timestamp,
        };

        // Log request in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data,
          });
        }

        return response;
      },
      (error: AxiosError) => {
        // Enhanced error handling
        const errorMessage = this.getErrorMessage(error);
        
        console.error('❌ API Error:', {
          message: errorMessage,
          status: error.response?.status,
          url: error.config?.url,
          method: error.config?.method,
        });

        // Transform error for better handling
        const transformedError = new Error(errorMessage);
        (transformedError as any).status = error.response?.status;
        (transformedError as any).originalError = error;

        return Promise.reject(transformedError);
      }
    );
  }

  private getErrorMessage(error: AxiosError): string {
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please check your connection and try again.';
    }

    if (error.code === 'ERR_NETWORK') {
      return 'Network error. Please check if the server is running.';
    }

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 404:
          return 'API endpoint not found. Please check the server configuration.';
        case 429:
          return 'Too many requests. Please wait a moment and try again.';
        case 500:
          return 'Server error. Please try again later.';
        case 503:
          return 'Service unavailable. The server might be temporarily down.';
        default:
          return data?.error || data?.message || `HTTP ${status}: ${error.message}`;
      }
    }

    return error.message || 'An unexpected error occurred';
  }

  // Generic request method
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<T> {
    try {
      const response = await this.client.request({
        method,
        url: endpoint,
        data,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // API Methods
  async getCountries(): Promise<ApiResponse<Country[]>> {
    return this.request<ApiResponse<Country[]>>('GET', '/countries');
  }

  async getTopCountries(limit: number = 10): Promise<ApiResponse<Country[]>> {
    return this.request<ApiResponse<Country[]>>('GET', `/countries/top/${limit}`);
  }

  async getBottomCountries(limit: number = 10): Promise<ApiResponse<Country[]>> {
    return this.request<ApiResponse<Country[]>>('GET', `/countries/bottom/${limit}`);
  }

  async getRegions(): Promise<ApiResponse<Region[]>> {
    return this.request<ApiResponse<Region[]>>('GET', '/countries/regions');
  }

  async getWorldStats(): Promise<ApiResponse<WorldStats>> {
    return this.request<ApiResponse<WorldStats>>('GET', '/countries/world-stats');
  }

  async getHealthCheck(): Promise<any> {
    return this.request<any>('GET', '/health');
  }

  // Utility methods
  isOnline(): boolean {
    return navigator.onLine;
  }

  getBaseUrl(): string {
    return `${API_BASE_URL}/api/${API_VERSION}`;
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
export default apiService;
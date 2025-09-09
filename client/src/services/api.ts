// API service to handle all server communications
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Response types
interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

interface PaginatedResponse<T> {
  success: boolean;
  data: {
    [key: string]: T[];
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

// Auth token management
class TokenManager {
  private static TOKEN_KEY = 'renthome_token';

  static setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// Base API client
class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...TokenManager.getAuthHeaders(),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const searchParams = params ? `?${new URLSearchParams(params)}` : '';
    return this.request<T>(`${endpoint}${searchParams}`, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

const apiClient = new APIClient(API_BASE_URL);

// Authentication API
export const authAPI = {
  // Register new user
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) => apiClient.post<APIResponse>('/auth/register', userData),

  // Login user
  login: (credentials: { email: string; password: string }) =>
    apiClient.post<APIResponse>('/auth/login', credentials),

  // Get current user
  getCurrentUser: () => apiClient.get<APIResponse>('/auth/me'),

  // Update user profile
  updateProfile: (profileData: any) =>
    apiClient.put<APIResponse>('/auth/me', profileData),

  // Change password
  changePassword: (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => apiClient.put<APIResponse>('/auth/change-password', passwordData),

  // Logout
  logout: () => apiClient.post<APIResponse>('/auth/logout'),

  // Google OAuth URL
  getGoogleAuthUrl: () => apiClient.get<APIResponse>('/auth/google/url'),
};

// Properties API
export const propertiesAPI = {
  // Get all properties with filtering
  getProperties: (filters?: {
    page?: number;
    limit?: number;
    location?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
    featured?: boolean;
    search?: string;
    sort?: string;
  }) => apiClient.get<PaginatedResponse<any>>('/properties', filters),

  // Get featured properties
  getFeaturedProperties: (limit?: number) =>
    apiClient.get<APIResponse>('/properties/featured', { limit }),

  // Get property by ID
  getPropertyById: (id: string) =>
    apiClient.get<APIResponse>(`/properties/${id}`),

  // Create new property
  createProperty: (propertyData: any) =>
    apiClient.post<APIResponse>('/properties', propertyData),

  // Update property
  updateProperty: (id: string, propertyData: any) =>
    apiClient.put<APIResponse>(`/properties/${id}`, propertyData),

  // Delete property
  deleteProperty: (id: string) =>
    apiClient.delete<APIResponse>(`/properties/${id}`),

  // Add to favorites
  addToFavorites: (id: string) =>
    apiClient.post<APIResponse>(`/properties/${id}/favorite`),

  // Remove from favorites
  removeFromFavorites: (id: string) =>
    apiClient.delete<APIResponse>(`/properties/${id}/favorite`),
};

// Users API
export const usersAPI = {
  // Get user's favorites
  getFavorites: () => apiClient.get<APIResponse>('/users/favorites'),

  // Get user's properties
  getProperties: () => apiClient.get<APIResponse>('/users/properties'),

  // Get user's bookings
  getBookings: () => apiClient.get<APIResponse>('/users/bookings'),

  // Upgrade to owner
  upgradeToOwner: (ownerInfo?: any) =>
    apiClient.post<APIResponse>('/users/upgrade-to-owner', { ownerInfo }),
};

// Admin API
export const adminAPI = {
  // Get dashboard stats
  getDashboardStats: () => apiClient.get<APIResponse>('/admin/dashboard'),

  // Get all users
  getUsers: (filters?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }) => apiClient.get<PaginatedResponse<any>>('/admin/users', filters),

  // Update user
  updateUser: (id: string, userData: any) =>
    apiClient.put<APIResponse>(`/admin/users/${id}`, userData),

  // Get all properties for admin
  getProperties: (filters?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    search?: string;
  }) => apiClient.get<PaginatedResponse<any>>('/admin/properties', filters),

  // Update property status
  updatePropertyStatus: (id: string, status: string, adminNotes?: string) =>
    apiClient.put<APIResponse>(`/admin/properties/${id}/status`, {
      status,
      adminNotes,
    }),

  // Toggle property featured status
  togglePropertyFeatured: (id: string) =>
    apiClient.put<APIResponse>(`/admin/properties/${id}/featured`),

  // Get all bookings
  getBookings: (filters?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => apiClient.get<PaginatedResponse<any>>('/admin/bookings', filters),
};

// Export token manager for authentication
export { TokenManager };

// Default export with all APIs
export default {
  auth: authAPI,
  properties: propertiesAPI,
  users: usersAPI,
  admin: adminAPI,
};

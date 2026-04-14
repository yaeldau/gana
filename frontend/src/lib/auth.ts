import { apiClient } from './api';
import type { User, AuthResponse } from '@/types';

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authApi = {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', input);
    apiClient.setToken(response.token);
    return response;
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', input);
    apiClient.setToken(response.token);
    return response;
  },

  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout');
    apiClient.setToken(null);
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ user: User }>('/api/auth/me');
    return response.user;
  },

  async updateProfile(name: string): Promise<User> {
    const response = await apiClient.put<{ user: User }>('/api/auth/profile', { name });
    return response.user;
  },

  isAuthenticated(): boolean {
    return apiClient.getToken() !== null;
  },
};

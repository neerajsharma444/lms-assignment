import { apiClient } from './client';
import { LoginPayload, RegisterPayload } from '@/types';

export const login = async (data: LoginPayload) => {
  const response = await apiClient.post('/users/login', data);
  return response.data;
};

export const register = async (data: RegisterPayload) => {
  const response = await apiClient.post('/users/register', data);
  return response.data;
};

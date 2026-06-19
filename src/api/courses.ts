import { apiClient } from './client';

export const fetchCourses = async (page = 1) => {
  const response = await apiClient.get(`/public/randomproducts?page=${page}&limit=20`);
  return response.data;
};

export const fetchInstructors = async (page = 1) => {
  const response = await apiClient.get(`/public/randomusers?page=${page}&limit=20`);
  return response.data;
};

export const fetchCourseById = async (id: string) => {
  const response = await apiClient.get(`/public/randomproducts/${id}`);
  return response.data;
};

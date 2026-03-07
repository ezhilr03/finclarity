import apiClient from "./client";

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthData {
  token: string;
  tokenType: string;
  userId: number;
  email: string;
  fullName: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthData> => {
    const res = await apiClient.post<ApiResponse<AuthData>>("/auth/register", payload);
    return res.data.data;
  },

  login: async (payload: LoginPayload): Promise<AuthData> => {
    const res = await apiClient.post<ApiResponse<AuthData>>("/auth/login", payload);
    return res.data.data;
  },
};

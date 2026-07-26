import { apiClient } from "./client";

export type AuthUser = { id: number; email: string };

export type RegisterResponse = { message: string; email: string };
export type VerifyResponse = { user: AuthUser; token: string };
export type LoginResponse = { user: AuthUser; token: string };

export const authApi = {
  register(email: string, password: string) {
    return apiClient
      .post<RegisterResponse>("/users/register", { email, password })
      .then((r) => r.data);
  },

  verifyEmail(email: string, code: string) {
    return apiClient
      .post<VerifyResponse>("/users/verify", { email, code })
      .then((r) => r.data);
  },

  login(email: string, password: string) {
    return apiClient
      .post<LoginResponse>("/users/login", { email, password })
      .then((r) => r.data);
  },
};
import { apiClient } from "./client";

export type PlatformKey = "telegram" | "instagram" | "threads" | "vk";

export interface SocialConnectionMetadata {
  [key: string]: string | number;
}

export interface SocialConnection {
  id: number;
  platform: PlatformKey;
  accountName: string;
  hasAccessToken: boolean;
  hasRefreshToken: boolean;
  expiresAt: string | null;
  metadata: SocialConnectionMetadata | null;
}

export interface CreateSocialConnectionPayload {
  platform: PlatformKey;
  accessToken: string;
  accountName: string;
  refreshToken?: string;
  expiresAt?: string;
  metadata?: SocialConnectionMetadata;
}

export const socialConnectionsApi = {
  list: async (): Promise<SocialConnection[]> => {
    const { data } = await apiClient.get<SocialConnection[]>("/social-connections");
    return data;
  },

  create: async (payload: CreateSocialConnectionPayload): Promise<SocialConnection> => {
    const { data } = await apiClient.post<SocialConnection>("/social-connections", payload);
    return data;
  },
};
import { apiClient } from "./client";

export type PostStatus = "draft" | "scheduled" | "published";
export type SocialNetwork = "instagram" | "telegram" | "vk" | "x";

export type Post = {
  id: number;
  title: string;
  status: PostStatus;
  socialNetwork: SocialNetwork;
  scheduledAt: string | null;
  tags: string[];
  images: string[];
  templateId: number | null;
  authorId: number;
  createdAt: string;
  updatedAt: string;
};

export interface CreatePostPayload {
  title: string;
  socialNetwork: SocialNetwork;
  scheduledAt?: string;
  tags?: string[];
  images?: string[];
}

export const postsApi = {
  // Возвращает посты текущего пользователя, orderBy createdAt desc (сортирует сервер)
  list() {
    return apiClient.get<Post[]>("/posts").then((r) => r.data);
  },

  // status сервер выставляет сам: "scheduled" при наличии scheduledAt, иначе "draft"
  create(payload: CreatePostPayload) {
    return apiClient.post<Post>("/posts", payload).then((r) => r.data);
  },
};
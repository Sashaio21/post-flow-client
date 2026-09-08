import type { PostStatus, SocialNetwork } from "../../api/posts";

// Общие подписи/цвета для постов — используются в PostsPage, UpcomingStrip и PostsFilterBar,
// поэтому вынесены сюда, а не продублированы в каждом файле.

export const platformLabel: Record<SocialNetwork, string> = {
  telegram: "Telegram",
  instagram: "Instagram",
  vk: "VK",
  x: "X",
};

export const platformChipClass: Record<SocialNetwork, string> = {
  telegram: "bg-tg/15 text-tg",
  instagram: "bg-ig/15 text-ig",
  vk: "bg-vk/15 text-vk",
  x: "bg-fg/10 text-fg",
};

export const statusLabel: Record<PostStatus, string> = {
  draft: "Черновик",
  scheduled: "Запланировано",
  published: "Опубликовано",
};

export const statusDotClass: Record<PostStatus, string> = {
  draft: "bg-draft",
  scheduled: "bg-scheduled",
  published: "bg-published",
};

export function formatScheduledAt(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  const days = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
  const day = days[d.getDay()];
  const date = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${date}.${month} · ${hours}:${minutes}`;
}

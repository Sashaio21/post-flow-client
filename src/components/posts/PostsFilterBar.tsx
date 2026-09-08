import type { PostStatus, SocialNetwork } from "../../api/posts";
import { platformLabel, statusLabel } from "./postDisplay";

type PlatformFilter = SocialNetwork | "all";
type StatusFilter = PostStatus | "all";

type PostsFilterBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  platform: PlatformFilter;
  onPlatformChange: (value: PlatformFilter) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
};

const fieldClass =
  "bg-surface border border-line rounded-lg px-3 py-2 text-sm text-fg focus:outline-none focus:border-scheduled";

export function PostsFilterBar({
  search,
  onSearchChange,
  platform,
  onPlatformChange,
  status,
  onStatusChange,
}: PostsFilterBarProps) {
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Поиск по заголовку…"
        className={`flex-1 min-w-[180px] placeholder:text-muted ${fieldClass}`}
      />

      <select
        value={platform}
        onChange={(e) => onPlatformChange(e.target.value as PlatformFilter)}
        className={fieldClass}
      >
        <option value="all">Все платформы</option>
        {Object.entries(platformLabel).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
        className={fieldClass}
      >
        <option value="all">Любой статус</option>
        {Object.entries(statusLabel).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

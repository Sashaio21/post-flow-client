import type { Post } from "../../api/posts";
import { formatScheduledAt } from "./postDisplay";

type UpcomingStripProps = {
  // Уже отфильтрованный/отсортированный/обрезанный список — компонент только рендерит
  posts: Post[];
};

export function UpcomingStrip({ posts }: UpcomingStripProps) {
  return (
    <div className="flex items-center gap-5 bg-surface border border-line rounded-lg px-5 py-4 mb-6 overflow-x-auto">
      <div className="text-[11px] uppercase tracking-wide font-semibold text-muted whitespace-nowrap">
        Ближайшие публикации
      </div>

      {posts.length === 0 ? (
        <div className="text-[12.5px] text-muted">Нет запланированных публикаций</div>
      ) : (
        <div className="relative flex items-start flex-1 min-w-0">
          <div className="absolute top-[7px] left-[55px] right-[55px] h-px bg-line" />

          {posts.map((post) => (
            <div key={post.id} className="relative flex flex-col items-center gap-1.5 flex-1 min-w-[110px]">
              <span className="w-2 h-2 rounded-full bg-scheduled" />
              <span className="font-mono text-xs text-fg">{formatScheduledAt(post.scheduledAt)}</span>
              <span className="text-[11.5px] text-muted text-center max-w-[110px] truncate">
                {post.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

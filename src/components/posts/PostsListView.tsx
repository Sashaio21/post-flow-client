import type { Post } from "../../api/posts";
import { platformLabel, platformChipClass, statusDotClass, formatScheduledAt } from "./postDisplay";

interface PostsListViewProps {
  posts: Post[];
}

export function PostsListView({ posts }: PostsListViewProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-10 border border-dashed border-line rounded-lg text-sm text-muted">
        Ничего не найдено
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex items-center gap-3 bg-surface border border-line rounded-lg px-4 py-3"
        >
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDotClass[post.status]}`} />

          <span
            className={`text-[10.5px] font-semibold px-2 py-0.5 rounded tracking-wide flex-shrink-0 ${platformChipClass[post.socialNetwork]}`}
          >
            {platformLabel[post.socialNetwork]}
          </span>

          <span className="flex-1 min-w-0 text-sm font-medium text-fg truncate">{post.title}</span>

          {post.tags.length > 0 && (
            <div className="hidden sm:flex gap-1 flex-shrink-0">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[10.5px] text-muted bg-surface-2 px-1.5 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <span className="font-mono text-[11.5px] text-muted flex-shrink-0 whitespace-nowrap">
            {formatScheduledAt(post.scheduledAt)}
          </span>
        </div>
      ))}
    </div>
  );
}
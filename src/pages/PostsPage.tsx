import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { postsApi, type Post, type SocialNetwork, type PostStatus } from "../api/posts";
import { UpcomingStrip } from "../components/posts/UpcomingStrip";
import { PostsFilterBar } from "../components/posts/PostsFilterBar";
import { PostsListView } from "../components/posts/PostsListView";
import { PostsCalendarView } from "../components/posts/PostsCalendarView";

type ViewMode = "list" | "calendar";

export function PostsPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<SocialNetwork | "all">("all");
  const [statusFilter, setStatusFilter] = useState<PostStatus | "all">("all");

  const [view, setView] = useState<ViewMode>("list");

  useEffect(() => {
    load();
  }, []);

  function load() {
    setIsLoading(true);
    setError(null);
    postsApi
      .list()
      .then((data) => setPosts(data))
      .catch((err) => {
        const message = isAxiosError(err)
          ? "Не удалось загрузить посты, попробуйте ещё раз"
          : "Что-то пошло не так";
        setError(message);
      })
      .finally(() => setIsLoading(false));
  }

  const upcoming = useMemo(() => {
    if (!posts) return [];
    return posts
      .filter((p) => p.status === "scheduled" && p.scheduledAt)
      .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())
      .slice(0, 4);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter(
      (p) =>
        (platformFilter === "all" || p.socialNetwork === platformFilter) &&
        (statusFilter === "all" || p.status === statusFilter) &&
        (!search || p.title.toLowerCase().includes(search.toLowerCase())),
    );
  }, [posts, platformFilter, statusFilter, search]);

  return (
    <div>
      <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-fg">Посты</h1>
          <p className="text-sm text-muted mt-1">
            Черновики, запланированные и опубликованные — всё на одном экране.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface-2 rounded-lg p-0.5 text-sm">
            <button
              type="button"
              onClick={() => setView("list")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                view === "list" ? "bg-surface text-fg shadow-sm" : "text-muted hover:text-fg"
              }`}
            >
              Список
            </button>
            <button
              type="button"
              onClick={() => setView("calendar")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                view === "calendar" ? "bg-surface text-fg shadow-sm" : "text-muted hover:text-fg"
              }`}
            >
              Календарь
            </button>
          </div>

          <Link
            to="/posts/new"
            className="inline-flex items-center gap-1.5 bg-scheduled text-on-accent font-semibold text-sm px-4 py-2.5 rounded-lg hover:brightness-110 active:translate-y-px transition"
          >
            + Новый пост
          </Link>
        </div>
      </div>


      {!isLoading && view === "list" && !error && posts && <UpcomingStrip posts={upcoming} />}

      {isLoading && <div className="text-sm text-muted py-10 text-center">Загружаем посты…</div>}

      {!isLoading && error && (
        <div className="flex flex-col items-center gap-3 py-10 border border-dashed border-line rounded-lg">
          <p className="text-sm text-danger">{error}</p>
          <button
            type="button"
            onClick={load}
            className="text-sm px-3 py-1.5 rounded-lg border border-line hover:bg-surface-2 text-fg"
          >
            Повторить
          </button>
        </div>
      )}

      {!isLoading && !error && posts && posts.length === 0 && (
        <div className="text-center py-10 border border-dashed border-line rounded-lg">
          <p className="text-sm text-muted mb-3">Постов пока нет.</p>
          <Link
            to="/posts/new"
            className="inline-flex text-sm px-3 py-1.5 rounded-lg bg-scheduled text-on-accent font-semibold hover:brightness-110"
          >
            Создать первый пост
          </Link>
        </div>
      )}

      {!isLoading && !error && posts && posts.length > 0 && (
        <>
          <PostsFilterBar
            search={search}
            onSearchChange={setSearch}
            platform={platformFilter}
            onPlatformChange={setPlatformFilter}
            status={statusFilter}
            onStatusChange={setStatusFilter}
          />

          {view === "list" ? (
            <PostsListView posts={filteredPosts} />
          ) : (
            <PostsCalendarView posts={filteredPosts} />
          )}
        </>
      )}
    </div>
  );
}
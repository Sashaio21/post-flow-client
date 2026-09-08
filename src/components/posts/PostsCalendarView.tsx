import { useMemo, useState } from "react";
import type { Post } from "../../api/posts";
import { platformChipClass } from "./postDisplay";

interface PostsCalendarViewProps {
  posts: Post[];
}

const WEEKDAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Сетка недель для месяца: всегда 6 недель (42 дня), с хвостами соседних
// месяцев по краям — неделя начинается с понедельника, не с воскресенья
function buildCalendarGrid(monthAnchor: Date): Date[] {
  const first = startOfMonth(monthAnchor);
  const startWeekday = (first.getDay() + 6) % 7; // 0 = понедельник
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - startWeekday);

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push(d);
  }
  return days;
}

export function PostsCalendarView({ posts }: PostsCalendarViewProps) {
  // Текущий отображаемый месяц — чисто UI-навигация внутри календаря,
  // странице это состояние не нужно, поэтому живёт здесь, а не в PostsPage
  const [monthAnchor, setMonthAnchor] = useState(() => startOfMonth(new Date()));

  const postsByDay = useMemo(() => {
    const map = new Map<string, Post[]>();
    for (const post of posts) {
      if (!post.scheduledAt) continue;
      const key = new Date(post.scheduledAt).toDateString();
      const list = map.get(key) ?? [];
      list.push(post);
      map.set(key, list);
    }
    return map;
  }, [posts]);

  // Посты без даты в сетку не помещаются — не теряем их молча,
  // выводим отдельным списком под сеткой
  const undatedPosts = useMemo(() => posts.filter((p) => !p.scheduledAt), [posts]);

  const calendarDays = useMemo(() => buildCalendarGrid(monthAnchor), [monthAnchor]);

  const monthLabel = monthAnchor.toLocaleDateString("ru-RU", {
    month: "long",
    year: "numeric",
  });

  function goToPrevMonth() {
    setMonthAnchor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function goToNextMonth() {
    setMonthAnchor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  function goToCurrentMonth() {
    setMonthAnchor(startOfMonth(new Date()));
  }

  return (
    <div>
      <div className="flex justify-end mb-3 gap-3">
        <button
          type="button"
          onClick={goToPrevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-line hover:bg-surface-2 text-fg"
          aria-label="Предыдущий месяц"
        >
          ←
        </button>

        <button
          type="button"
          onClick={goToCurrentMonth}
          className="font-display font-semibold text-fg capitalize hover:text-scheduled transition-colors"
        >
          {monthLabel}
        </button>

        <button
          type="button"
          onClick={goToNextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-line hover:bg-surface-2 text-fg"
          aria-label="Следующий месяц"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-line border border-line rounded-lg overflow-hidden flex-1">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="bg-surface-2 text-center text-[11px] font-semibold text-muted py-1.5">
            {label}
          </div>
        ))}

        {calendarDays.map((day) => {
          const inMonth = day.getMonth() === monthAnchor.getMonth();
          const dayPosts = postsByDay.get(day.toDateString()) ?? [];
          const isToday = sameDay(day, new Date());

          return (
            <div
              key={day.toISOString()}
              className={`bg-surface min-h-[92px] p-1.5 flex flex-col gap-1 ${inMonth ? "" : "opacity-40"}`}
            >
              <span className={`text-[11px] font-mono ${isToday ? "text-scheduled font-bold" : "text-muted"}`}>
                {day.getDate()}
              </span>

              <div className="flex flex-col gap-1">
                {dayPosts.slice(0, 3).map((post) => (
                  <div
                    key={post.id}
                    title={post.title}
                    className={`text-[10px] px-1.5 py-0.5 rounded truncate ${platformChipClass[post.socialNetwork]}`}
                  >
                    {post.title}
                  </div>
                ))}
                {dayPosts.length > 3 && (
                  <span className="text-[10px] text-muted">+{dayPosts.length - 3} ещё</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {undatedPosts.length > 0 && (
        <div className="mt-4">
          <div className="text-[11px] uppercase tracking-wide text-muted font-semibold mb-2">
            Без даты ({undatedPosts.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {undatedPosts.map((post) => (
              <span key={post.id} className={`text-[11px] px-2 py-1 rounded ${platformChipClass[post.socialNetwork]}`}>
                {post.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
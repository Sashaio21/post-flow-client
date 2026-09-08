import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { postsApi, type SocialNetwork } from "../api/posts";
import { platformLabel } from "../components/posts/postDisplay";

const SOCIAL_NETWORKS: SocialNetwork[] = ["instagram", "telegram", "vk", "x"];

export function PostFormPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [socialNetwork, setSocialNetwork] = useState<SocialNetwork>("telegram");
  const [scheduledAt, setScheduledAt] = useState(""); // datetime-local, пусто = черновик
  const [tagsInput, setTagsInput] = useState("");

  // Локальный превью изображений — реальная загрузка не подключена, см. примечание внизу страницы
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleImagesSelected(files: FileList | null) {
    if (!files) return;
    const list = Array.from(files);
    setImageFiles((prev) => [...prev, ...list]);
    setImagePreviews((prev) => [...prev, ...list.map((f) => URL.createObjectURL(f))]);
  }

  function removeImage(index: number) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Укажите заголовок поста");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await postsApi.create({
        title: title.trim(),
        socialNetwork,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
        tags: tags.length > 0 ? tags : undefined,
        // images намеренно не отправляем — загрузка файлов ещё не реализована, см. примечание ниже
      });

      navigate("/posts");
    } catch (err) {
      const message = isAxiosError(err) && err.response?.status === 400
        ? "Проверьте заполненные поля"
        : "Не удалось создать пост, попробуйте ещё раз";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-fg">Новый пост</h1>
        <p className="text-sm text-muted mt-1">
          Черновик сохранится сразу — дату публикации можно указать позже.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-[12.5px] text-muted mb-1.5 font-medium">Заголовок</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: Анонс распродажи"
            className="w-full bg-surface border border-line rounded-lg px-3 py-2 text-sm text-fg"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-[12.5px] text-muted mb-1.5 font-medium">Платформа</label>
          <div className="flex gap-2">
            {SOCIAL_NETWORKS.map((network) => (
              <button
                key={network}
                type="button"
                onClick={() => setSocialNetwork(network)}
                className={`flex-1 border rounded-lg py-2 text-sm font-medium transition-colors ${
                  socialNetwork === network
                    ? "border-scheduled text-fg bg-scheduled/10"
                    : "border-line text-muted hover:text-fg"
                }`}
              >
                {platformLabel[network]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[12.5px] text-muted mb-1.5 font-medium">
            Дата публикации <span className="text-muted/70">(необязательно)</span>
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full bg-surface border border-line rounded-lg px-3 py-2 text-sm text-fg font-mono"
          />
          <p className="text-[11.5px] text-muted mt-1">
            {scheduledAt ? "Пост будет создан со статусом «Запланирован»" : "Без даты пост останется черновиком"}
          </p>
        </div>

        <div>
          <label className="block text-[12.5px] text-muted mb-1.5 font-medium">
            Тэги <span className="text-muted/70">(через запятую, для фильтров на доске — не публикуются как хэштеги)</span>
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="акция, новинки"
            className="w-full bg-surface border border-line rounded-lg px-3 py-2 text-sm text-fg"
          />
        </div>

        <div>
          <label className="block text-[12.5px] text-muted mb-1.5 font-medium">Изображения</label>
          <label className="flex flex-col items-center justify-center border border-dashed border-line rounded-lg py-6 text-sm text-muted cursor-pointer hover:border-fg/40 hover:text-fg transition-colors">
            Перетащите файлы или нажмите, чтобы выбрать
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImagesSelected(e.target.files)}
              className="hidden"
            />
          </label>

          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {imagePreviews.map((src, i) => (
                <div key={src} className="relative w-16 h-16">
                  <img src={src} className="w-full h-full object-cover rounded-lg border border-line" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 flex items-center justify-center rounded-full bg-danger text-on-accent text-[10px]"
                    aria-label="Убрать изображение"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-[11px] text-muted mt-1.5">
            Загрузка изображений на сервер пока не подключена — превью только локальное,
            {imageFiles.length > 0 && " выбранные файлы не будут прикреплены к посту."}
          </p>
        </div>

        {error && <div className="text-[12.5px] text-danger">{error}</div>}

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate("/posts")}
            className="flex-1 border border-line rounded-lg py-2.5 text-sm text-muted hover:text-fg"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-scheduled text-on-accent rounded-lg py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {isSubmitting ? "Создаём…" : "Создать пост"}
          </button>
        </div>
      </form>
    </div>
  );
}
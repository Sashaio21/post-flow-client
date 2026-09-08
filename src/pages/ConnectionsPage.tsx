import { useEffect, useState } from "react";
import {
  type SocialConnection,
  type PlatformKey,
  socialConnectionsApi,
} from "../api/socialConnections";

const platformLabel: Record<PlatformKey, string> = {
  telegram: "Telegram",
  instagram: "Instagram",
  threads: "Threads",
  vk: "VK",
};

const CONNECTABLE_PLATFORMS: PlatformKey[] = ["telegram", "instagram"];

const accessTokenHint: Record<PlatformKey, string> = {
  telegram: "Токен бота из @BotFather",
  instagram: "Access-токен из Meta Graph API",
  threads: "",
  vk: "",
};

interface MetadataFieldDef {
  id: string;
  label: string;
  type: "text" | "number";
  placeholder?: string;
}

// Какие metadata-поля нужны для каждой платформы — клиент сам знает форму,
// не гадает по факту заполнения. Добавите Threads/VK — допишете сюда набор полей.
const platformMetadataFields: Record<PlatformKey, MetadataFieldDef[]> = {
  telegram: [
    { id: "type", label: "Тип", type: "text", placeholder: "канал" },
    { id: "subscribers", label: "Подписчики", type: "number", placeholder: "4820" },
  ],
  instagram: [
    { id: "accountType", label: "Тип аккаунта", type: "text", placeholder: "бизнес-аккаунт" },
    { id: "followers", label: "Подписчики", type: "number", placeholder: "12300" },
    { id: "category", label: "Категория", type: "text", placeholder: "Розница" },
  ],
  threads: [],
  vk: [],
};

function emptyMetadataValues(platform: PlatformKey): Record<string, string> {
  return Object.fromEntries(platformMetadataFields[platform].map((f) => [f.id, ""]));
}

function metaSummary(conn: SocialConnection): string {
  if (!conn.metadata) return "нет metadata";
  const count = conn.metadata.subscribers ?? conn.metadata.followers;
  if (typeof count === "number") return `${count.toLocaleString("ru-RU")} подписчиков`;
  const first = Object.values(conn.metadata)[0];
  return first != null ? String(first) : "";
}

export function ConnectionsPage() {
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [platform, setPlatform] = useState<PlatformKey>(CONNECTABLE_PLATFORMS[0]);
  const [accountName, setAccountName] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [metadataValues, setMetadataValues] = useState<Record<string, string>>(
    emptyMetadataValues(CONNECTABLE_PLATFORMS[0])
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    socialConnectionsApi
      .list()
      .then((data) => {
        if (!cancelled) setConnections(data);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function openModal() {
    setPlatform(CONNECTABLE_PLATFORMS[0]);
    setAccountName("");
    setAccessToken("");
    setMetadataValues(emptyMetadataValues(CONNECTABLE_PLATFORMS[0]));
    setError(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function handlePlatformChange(next: PlatformKey) {
    setPlatform(next);
    // Поля metadata зависят от платформы — при смене платформы старые значения не подходят.
    setMetadataValues(emptyMetadataValues(next));
  }

  function handleMetadataChange(fieldId: string, value: string) {
    setMetadataValues((prev) => ({ ...prev, [fieldId]: value }));
  }

  async function handleSubmit() {
    if (!accessToken.trim() || !accountName.trim()) {
      setError("Заполните название аккаунта и access token");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const fields = platformMetadataFields[platform];
      const metadata =
        fields.length > 0
          ? Object.fromEntries(
              fields
                .filter((f) => metadataValues[f.id]?.trim())
                .map((f) => [
                  f.id,
                  f.type === "number" ? Number(metadataValues[f.id]) : metadataValues[f.id].trim(),
                ])
            )
          : undefined;

      const created = await socialConnectionsApi.create({
        platform,
        accessToken: accessToken.trim(),
        accountName: accountName.trim(),
        metadata,
      });
      setConnections((prev) => [...prev, created]);
      closeModal();
    } catch {
      setError("Не удалось подключить платформу");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl text-fg mb-1">Подключения</h1>
        <p className="text-sm text-muted">Токены доступа никогда не показываются — только статус подключения.</p>
      </div>

      {!isLoading && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3.5">
          {connections.map((c) => (
            <div key={c.id} className="bg-surface border border-line rounded-[10px] p-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="text-[14.5px] font-semibold text-fg">{platformLabel[c.platform]}</div>
                <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded text-${c.platform}`}>
                  {c.hasAccessToken ? "активно" : "истекло"}
                </span>
              </div>
              <div className="text-[13px] text-muted mb-2.5">{c.accountName}</div>
              <div className="flex flex-col gap-1 font-mono text-[11.5px] text-muted">
                <div>hasAccessToken: <span className="text-published">{String(c.hasAccessToken)}</span></div>
                <div>hasRefreshToken: <span className="text-published">{String(c.hasRefreshToken)}</span></div>
                <div>{metaSummary(c)}</div>
              </div>
            </div>
          ))}

          <button
            onClick={openModal}
            className="border border-dashed border-line rounded-[10px] min-h-[100px] flex items-center justify-center text-muted text-[13px] hover:border-fg/40 hover:text-fg transition-colors"
          >
            + Подключить платформу
          </button>
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-surface border border-line rounded-[10px] p-5 w-[340px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[15px] font-semibold text-fg mb-3.5">Подключить платформу</h2>

            <div className="flex gap-2 mb-4">
              {CONNECTABLE_PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePlatformChange(p)}
                  className={`flex-1 border rounded-[8px] py-2 text-[13px] font-medium transition-colors ${
                    platform === p
                      ? `border-${p} text-fg bg-${p}/10`
                      : "border-line text-muted hover:text-fg"
                  }`}
                >
                  {platformLabel[p]}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-[12.5px] text-muted mb-1.5 font-medium">Название аккаунта</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="@brandflow_bot"
                  className="w-full bg-bg border border-line rounded-[8px] px-3 py-2 text-[14px] text-fg"
                />
              </div>

              <div>
                <label className="block text-[12.5px] text-muted mb-1.5 font-medium">Access token</label>
                <input
                  type="text"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder={accessTokenHint[platform]}
                  className="w-full bg-bg border border-line rounded-[8px] px-3 py-2 text-[14px] text-fg font-mono"
                />
              </div>

              {platformMetadataFields[platform].length > 0 && (
                <div className="border-t border-line pt-3 flex flex-col gap-3">
                  <div className="text-[11px] uppercase tracking-wide text-muted font-semibold">
                    Metadata ({platformLabel[platform]})
                  </div>
                  {platformMetadataFields[platform].map((field) => (
                    <div key={field.id}>
                      <label className="block text-[12.5px] text-muted mb-1.5 font-medium">{field.label}</label>
                      <input
                        type={field.type === "number" ? "number" : "text"}
                        value={metadataValues[field.id] ?? ""}
                        onChange={(e) => handleMetadataChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full bg-bg border border-line rounded-[8px] px-3 py-2 text-[14px] text-fg"
                      />
                    </div>
                  ))}
                </div>
              )}

              {error && <div className="text-[12.5px] text-danger">{error}</div>}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={closeModal}
                className="flex-1 border border-line rounded-[8px] py-2 text-[13px] text-muted hover:text-fg"
              >
                Отмена
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-scheduled text-on-accent rounded-[8px] py-2 text-[13px] font-semibold disabled:opacity-60"
              >
                {isSubmitting ? "Подключаем…" : "Подключить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
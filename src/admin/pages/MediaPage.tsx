import { useEffect, useMemo, useState } from "react"
import {
  deleteMedia,
  listMedia,
  updateMediaAlt,
  uploadMedia,
} from "../../content/api"
import { Field, PageHeader, useToast } from "../ui"

type MediaRow = {
  id: string
  path: string
  url: string
  filename: string
  mime: string | null
  size_bytes: number | null
  alt: string
}

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"]

export function MediaPage() {
  const [items, setItems] = useState<MediaRow[]>([])
  const [q, setQ] = useState("")
  const toast = useToast()

  const load = async () => {
    try {
      setItems((await listMedia()) as MediaRow[])
    } catch (err) {
      toast.setError(err instanceof Error ? err.message : "Ошибка")
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return items
    return items.filter(
      (i) =>
        i.filename.toLowerCase().includes(s) ||
        i.alt.toLowerCase().includes(s) ||
        (i.mime || "").toLowerCase().includes(s),
    )
  }, [items, q])

  const onUpload = async (files: FileList | null) => {
    if (!files?.length) return
    toast.setError("")
    try {
      for (const file of Array.from(files)) {
        if (!ALLOWED.includes(file.type)) {
          throw new Error(`Формат не поддерживается: ${file.type || file.name}`)
        }
        await uploadMedia(file)
      }
      toast.setOk("Загружено")
      await load()
    } catch (err) {
      toast.setError(err instanceof Error ? err.message : "Ошибка загрузки")
    }
  }

  return (
    <>
      <PageHeader eyebrow="Медиа" title="Медиатека">
        <label className="adm-btn" style={{ cursor: "pointer" }}>
          Загрузить
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.avif,image/jpeg,image/png,image/webp,image/avif"
            multiple
            hidden
            onChange={(e) => void onUpload(e.target.files)}
          />
        </label>
      </PageHeader>
      {toast.banners}
      <div className="adm-card">
        <Field label="Поиск" value={q} onChange={setQ} />
        <p style={{ fontSize: 12, color: "#6b625c" }}>
          JPG, PNG, WebP, AVIF. После загрузки скопируйте URL в поля контента.
        </p>
      </div>
      <div className="adm-media-grid">
        {filtered.map((item) => (
          <div className="adm-media-item" key={item.id}>
            <img src={item.url} alt={item.alt || item.filename} />
            <div style={{ fontSize: 11, marginBottom: 6 }}>{item.filename}</div>
            <div style={{ fontSize: 10, color: "#6b625c", marginBottom: 6 }}>
              {item.mime || "—"} ·{" "}
              {item.size_bytes
                ? `${Math.round(item.size_bytes / 1024)} KB`
                : "—"}
            </div>
            <Field
              label="Alt"
              value={item.alt}
              onChange={(alt) =>
                setItems((prev) =>
                  prev.map((x) => (x.id === item.id ? { ...x, alt } : x)),
                )
              }
            />
            <div className="adm-row-actions">
              <button
                className="adm-btn ghost"
                type="button"
                onClick={async () => {
                  await updateMediaAlt(item.id, item.alt)
                  toast.setOk("Alt сохранён")
                }}
              >
                Alt
              </button>
              <button
                className="adm-btn ghost"
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(item.url)
                  toast.setOk("URL скопирован")
                }}
              >
                URL
              </button>
              <button
                className="adm-btn ghost"
                type="button"
                onClick={async () => {
                  if (!confirm("Удалить файл из хранилища?")) return
                  try {
                    await deleteMedia(item.id, item.path)
                    toast.setOk("Удалено")
                    await load()
                  } catch (err) {
                    toast.setError(
                      err instanceof Error ? err.message : "Ошибка удаления",
                    )
                  }
                }}
              >
                Удал.
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

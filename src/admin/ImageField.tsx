import { useState } from "react"
import { uploadMedia } from "../content/api"

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml", "image/x-icon", "image/vnd.microsoft.icon"]

export function ImageField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string
  value: string
  onChange: (url: string) => void
  hint?: string
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const onFile = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    setError("")
    if (!ALLOWED.includes(file.type) && !/\.(ico|png|svg|jpe?g|webp|avif)$/i.test(file.name)) {
      setError("Формат не поддерживается")
      return
    }
    setBusy(true)
    try {
      const row = await uploadMedia(file)
      onChange(row.url as string)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="adm-field">
      <label>{label}</label>
      {hint ? (
        <p style={{ margin: "0 0 6px", fontSize: 12, color: "#6b625c" }}>{hint}</p>
      ) : null}
      {value ? (
        <div className="adm-image-preview">
          <img src={value} alt="" />
        </div>
      ) : null}
      <input
        type="text"
        value={value}
        placeholder="URL или загрузите файл"
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="adm-row-actions" style={{ marginTop: 8 }}>
        <label className="adm-btn ghost" style={{ cursor: busy ? "wait" : "pointer" }}>
          {busy ? "Загрузка…" : "Загрузить файл"}
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.avif,.svg,.ico,image/*"
            hidden
            disabled={busy}
            onChange={(e) => void onFile(e.target.files)}
          />
        </label>
        {value ? (
          <button className="adm-btn ghost" type="button" onClick={() => onChange("")}>
            Очистить
          </button>
        ) : null}
      </div>
      {error ? <p className="adm-error">{error}</p> : null}
    </div>
  )
}

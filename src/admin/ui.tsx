import { useEffect, useState, type ReactNode } from "react"

export function PageHeader({
  eyebrow,
  title,
  dirty,
  children,
}: {
  eyebrow: string
  title: string
  dirty?: boolean
  children?: ReactNode
}) {
  return (
    <div className="adm-top">
      <div>
        <span className="adm-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {dirty ? <p className="adm-dirty">Есть несохранённые изменения</p> : null}
      </div>
      {children ? <div className="adm-actions">{children}</div> : null}
    </div>
  )
}

export function Field({
  label,
  value,
  onChange,
  multiline,
  type = "text",
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  type?: string
}) {
  const id = label.replace(/\s+/g, "-").toLowerCase()
  return (
    <div className="adm-field">
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  )
}

export function useToast() {
  const [error, setError] = useState("")
  const [ok, setOk] = useState("")
  useEffect(() => {
    if (!ok) return
    const t = window.setTimeout(() => setOk(""), 3500)
    return () => window.clearTimeout(t)
  }, [ok])
  return {
    error,
    ok,
    setError,
    setOk,
    banners: (
      <>
        {error ? <p className="adm-error">{error}</p> : null}
        {ok ? <p className="adm-ok">{ok}</p> : null}
      </>
    ),
  }
}

export function PointsEditor({
  points,
  onChange,
}: {
  points: string[]
  onChange: (next: string[]) => void
}) {
  return (
    <div className="adm-field">
      <label>Пункты списка (по одному в строке)</label>
      <textarea
        value={points.join("\n")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split("\n")
              .map((s) => s.trimEnd())
              .filter((_, i, arr) => i < arr.length - 1 || arr[i] !== ""),
          )
        }
      />
    </div>
  )
}

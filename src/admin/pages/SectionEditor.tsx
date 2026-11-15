import { useEffect, useMemo, useState, type ReactNode } from "react"
import {
  fetchRevisions,
  fetchSectionDraft,
  publishSection,
  saveSectionDraft,
} from "../../content/api"
import { defaultContent } from "../../content/defaults"
import type { SectionKey } from "../../content/types"
import { Field, PageHeader, useToast } from "../ui"

type Props = {
  sectionKey: SectionKey
  title: string
  eyebrow: string
  defaults: Record<string, string | string[]>
  fields: Array<{ key: string; label: string; multiline?: boolean }>
  preview?: (data: Record<string, string>) => ReactNode
}

function flattenDefaults(d: Record<string, string | string[]>) {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(d)) {
    out[k] = Array.isArray(v) ? v.join("\n") : String(v ?? "")
  }
  return out
}

export function SectionEditor({
  sectionKey,
  title,
  eyebrow,
  defaults,
  fields,
  preview,
}: Props) {
  const base = useMemo(() => flattenDefaults(defaults), [defaults])
  const [data, setData] = useState(base)
  const [saved, setSaved] = useState(base)
  const [revisions, setRevisions] = useState<
    Array<{ id: string; created_at: string; snapshot: unknown }>
  >([])
  const toast = useToast()
  const dirty = JSON.stringify(data) !== JSON.stringify(saved)

  useEffect(() => {
    void (async () => {
      try {
        const row = await fetchSectionDraft(sectionKey)
        let next = base
        if (sectionKey === "marquee" && Array.isArray(row?.draft)) {
          next = { items: (row.draft as string[]).join("\n") }
        } else if (row?.draft && typeof row.draft === "object") {
          const source = row.draft as Record<string, unknown>
          next = flattenDefaults(
            Object.fromEntries(
              Object.keys(defaults).map((k) => [
                k,
                (source[k] as string | string[] | undefined) ?? defaults[k],
              ]),
            ) as Record<string, string | string[]>,
          )
        }
        setData(next)
        setSaved(next)
        setRevisions(
          (await fetchRevisions("section", sectionKey)) as Array<{
            id: string
            created_at: string
            snapshot: unknown
          }>,
        )
      } catch {
        setData(base)
        setSaved(base)
      }
    })()
  }, [sectionKey, base, defaults])

  const toPayload = () => {
    const payload: Record<string, unknown> = {}
    for (const f of fields) {
      const raw = data[f.key] ?? ""
      if (f.key === "marquee" || Array.isArray(defaults[f.key])) {
        payload[f.key] = raw
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
      } else if (f.key === "asideNote" || f.key === "quote") {
        payload[f.key] = raw
      } else {
        payload[f.key] = raw
      }
    }
    // For marquee section the whole published value is the array
    if (sectionKey === "marquee") {
      return (payload.items as string[]) || data.items?.split("\n").filter(Boolean)
    }
    return payload
  }

  const save = async (publish: boolean) => {
    toast.setError("")
    try {
      let payload = toPayload()
      if (sectionKey === "marquee") {
        payload = String(data.items || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
      }
      if (publish) await publishSection(sectionKey, payload)
      else await saveSectionDraft(sectionKey, payload)
      setSaved({ ...data })
      toast.setOk(publish ? "Опубликовано" : "Черновик сохранён")
      setRevisions(
        (await fetchRevisions("section", sectionKey)) as Array<{
          id: string
          created_at: string
          snapshot: unknown
        }>,
      )
    } catch (err) {
      toast.setError(err instanceof Error ? err.message : "Ошибка сохранения")
    }
  }

  const restore = (snapshot: unknown) => {
    if (sectionKey === "marquee" && Array.isArray(snapshot)) {
      const next = { items: snapshot.join("\n") }
      setData(next)
      return
    }
    if (snapshot && typeof snapshot === "object") {
      const next = flattenDefaults({
        ...defaults,
        ...(snapshot as Record<string, string | string[]>),
      })
      setData(next)
    }
  }

  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} dirty={dirty}>
        <button className="adm-btn ghost" type="button" onClick={() => setData(saved)}>
          Отменить
        </button>
        <button className="adm-btn ghost" type="button" onClick={() => void save(false)}>
          Сохранить
        </button>
        <a className="adm-btn ghost" href="/" target="_blank" rel="noreferrer">
          Предпросмотр
        </a>
        <button className="adm-btn" type="button" onClick={() => void save(true)}>
          Опубликовать
        </button>
      </PageHeader>
      {toast.banners}
      <div className="adm-card">
        {fields.map((f) => (
          <Field
            key={f.key}
            label={f.label}
            value={data[f.key] ?? ""}
            multiline={f.multiline}
            onChange={(v) => setData((d) => ({ ...d, [f.key]: v }))}
          />
        ))}
      </div>
      {preview ? <div className="adm-card">{preview(data)}</div> : null}
      {revisions.length > 0 && (
        <div className="adm-card">
          <h2>История</h2>
          <table className="adm-table">
            <thead>
              <tr>
                <th>Дата</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {revisions.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.created_at).toLocaleString("ru-RU")}</td>
                  <td>
                    <button
                      className="adm-btn ghost"
                      type="button"
                      onClick={() => restore(r.snapshot)}
                    >
                      Восстановить в форму
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export function HomePage() {
  const d = defaultContent.hero
  return (
    <SectionEditor
      sectionKey="hero"
      eyebrow="Контент"
      title="Главная страница"
      defaults={{ ...d }}
      fields={[
        { key: "line1", label: "H1 — строка 1" },
        { key: "line2", label: "H1 — строка 2" },
        { key: "line3", label: "H1 — строка 3 (курсив)" },
        { key: "description", label: "Описание", multiline: true },
        { key: "formats", label: "Подпись форматов" },
        { key: "ctaLabel", label: "Текст кнопки" },
        { key: "manifesto", label: "Манифест внизу" },
        { key: "imageUrl", label: "URL изображения", multiline: true },
        { key: "imageAlt", label: "Alt изображения" },
      ]}
    />
  )
}

export function AboutPage() {
  const d = defaultContent.about
  return (
    <SectionEditor
      sectionKey="about"
      eyebrow="Контент"
      title="Обо мне"
      defaults={{ ...d }}
      fields={[
        { key: "eyebrow", label: "Eyebrow" },
        { key: "titleLine1", label: "Заголовок — строка 1" },
        { key: "titleLine2a", label: "Заголовок — строка 2a" },
        { key: "titleLine2b", label: "Заголовок — строка 2b (курсив)" },
        { key: "mainImageUrl", label: "URL главного фото", multiline: true },
        { key: "mainImageAlt", label: "Alt главного фото" },
        { key: "captionName", label: "Подпись — имя" },
        { key: "captionRole", label: "Подпись — роль" },
        { key: "quote", label: "Цитата", multiline: true },
        { key: "body1", label: "Текст 1", multiline: true },
        { key: "body2", label: "Текст 2", multiline: true },
        { key: "detailImageUrl", label: "URL доп. фото", multiline: true },
        { key: "detailImageAlt", label: "Alt доп. фото" },
        { key: "asideNote", label: "Боковая заметка", multiline: true },
      ]}
    />
  )
}

export function ContactsPage() {
  const d = defaultContent.contacts
  return (
    <SectionEditor
      sectionKey="contacts"
      eyebrow="Контент"
      title="Контакты"
      defaults={{ ...d }}
      fields={[
        { key: "email", label: "Email" },
        { key: "phone", label: "Телефон (отображение)" },
        { key: "phoneHref", label: "Телефон (tel: ссылка)" },
        { key: "telegram", label: "Telegram ник" },
        { key: "telegramUrl", label: "Telegram URL" },
        { key: "instagram", label: "Instagram ник" },
        { key: "instagramUrl", label: "Instagram URL" },
        { key: "maxUrl", label: "MAX URL" },
        { key: "ctaTitle", label: "CTA заголовок" },
        { key: "ctaText", label: "CTA текст", multiline: true },
        { key: "ctaButton", label: "CTA кнопка" },
      ]}
    />
  )
}

export function SeoPage() {
  const d = defaultContent.seo
  return (
    <SectionEditor
      sectionKey="seo"
      eyebrow="SEO"
      title="Метаданные"
      defaults={{ ...d }}
      fields={[
        { key: "title", label: "Title" },
        { key: "description", label: "Description", multiline: true },
        { key: "canonical", label: "Canonical" },
        { key: "robots", label: "Robots" },
        { key: "ogTitle", label: "OG Title" },
        { key: "ogDescription", label: "OG Description", multiline: true },
        { key: "ogImage", label: "OG Image URL" },
        { key: "ogImageAlt", label: "OG Image Alt" },
        { key: "twitterTitle", label: "Twitter Title" },
        {
          key: "twitterDescription",
          label: "Twitter Description",
          multiline: true,
        },
        { key: "twitterImage", label: "Twitter Image URL" },
      ]}
      preview={(data) => (
        <div>
          <h2>Превью сниппета</h2>
          <div className="adm-snippet">
            <div className="title">{data.title || "Title"}</div>
            <div className="url">{data.canonical || "https://ym-designer.ru/"}</div>
            <div className="desc">{data.description || "Description"}</div>
          </div>
        </div>
      )}
    />
  )
}

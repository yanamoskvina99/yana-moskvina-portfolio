import { useCallback, useEffect, useState, type ReactNode } from "react"
import {
  deleteCollectionRow,
  fetchCollection,
  upsertCollectionRow,
} from "../../content/api"
import { defaultContent } from "../../content/defaults"
import type { LeafletDetail } from "../../content/types"
import { ImageField } from "../ImageField"
import { Field, PageHeader, PointsEditor, useToast } from "../ui"

type Row = {
  id?: string
  sort_order: number
  is_published: boolean
  payload?: Record<string, unknown>
  question?: string
  answer?: string
}

function emptyLeaflet(): LeafletDetail {
  return { eyebrow: "", title: "", intro: "", points: [], note: "" }
}

function GalleryField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string[]
  onChange: (next: string[]) => void
}) {
  return (
    <div className="adm-card" style={{ marginTop: 8 }}>
      <h2>{label}</h2>
      <p style={{ fontSize: 12, color: "#6b625c", marginTop: 0 }}>
        URL по одному в строке или загрузите файлы по очереди ниже.
      </p>
      <Field
        label="Список URL"
        multiline
        value={value.join("\n")}
        onChange={(raw) =>
          onChange(
            raw
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
          )
        }
      />
      {value.map((url, i) => (
        <ImageField
          key={`${url}-${i}`}
          label={`Кадр ${i + 1}`}
          value={url}
          onChange={(next) => {
            const copy = [...value]
            if (!next) copy.splice(i, 1)
            else copy[i] = next
            onChange(copy)
          }}
        />
      ))}
      <ImageField
        label="Добавить кадр"
        value=""
        onChange={(url) => {
          if (url) onChange([...value, url])
        }}
      />
    </div>
  )
}

export function ServicesAdminPage() {
  return (
    <JsonCollectionPage
      table="services"
      title="Услуги"
      emptyPayload={() => ({
        n: "01",
        title: "Новая услуга",
        text: "",
        fit: "",
        visual: "landing",
        imageUrl: "",
        detail: emptyLeaflet(),
        buttonLabel: "Подробнее",
        buttonHref: "",
      })}
      seed={defaultContent.services.map((s) => {
        const { id: _i, sortOrder, isPublished, ...payload } = s
        return { payload, sort_order: sortOrder, is_published: isPublished }
      })}
      renderFields={(payload, setPayload) => (
        <>
          <div className="adm-grid-2">
            <Field
              label="Номер"
              value={String(payload.n ?? "")}
              onChange={(v) => setPayload({ ...payload, n: v })}
            />
            <Field
              label="Visual class"
              value={String(payload.visual ?? "")}
              onChange={(v) => setPayload({ ...payload, visual: v })}
            />
          </div>
          <Field
            label="Название"
            value={String(payload.title ?? "")}
            onChange={(v) => setPayload({ ...payload, title: v })}
          />
          <Field
            label="Краткое описание"
            multiline
            value={String(payload.text ?? "")}
            onChange={(v) => setPayload({ ...payload, text: v })}
          />
          <Field
            label="Подойдёт, если…"
            multiline
            value={String(payload.fit ?? "")}
            onChange={(v) => setPayload({ ...payload, fit: v })}
          />
          <ImageField
            label="Превью услуги"
            hint="Замените картинку: загрузите файл или вставьте URL"
            value={String(payload.imageUrl ?? "")}
            onChange={(v) => setPayload({ ...payload, imageUrl: v })}
          />
          <Field
            label="Цена (опционально)"
            value={String(payload.priceLabel ?? "")}
            onChange={(v) => setPayload({ ...payload, priceLabel: v })}
          />
          <LeafletFields
            value={(payload.detail as LeafletDetail) || emptyLeaflet()}
            onChange={(detail) => setPayload({ ...payload, detail })}
          />
        </>
      )}
    />
  )
}

export function PortfolioAdminPage() {
  return (
    <JsonCollectionPage
      table="projects"
      title="Портфолио"
      emptyPayload={() => ({
        category: "Лендинг",
        title: "Новый проект",
        niche: "",
        description: "",
        visual: "idel",
        imageUrl: "",
        live: false,
        url: "",
        features: [],
        task: "",
        solution: "",
        result: "",
        tech: "",
      })}
      seed={defaultContent.projects.map((p) => {
        const { id: _i, sortOrder, isPublished, ...payload } = p
        return { payload, sort_order: sortOrder, is_published: isPublished }
      })}
      renderFields={(payload, setPayload) => (
        <>
          <div className="adm-grid-2">
            <Field
              label="Название"
              value={String(payload.title ?? "")}
              onChange={(v) => setPayload({ ...payload, title: v })}
            />
            <Field
              label="Категория"
              value={String(payload.category ?? "")}
              onChange={(v) => setPayload({ ...payload, category: v })}
            />
          </div>
          <Field
            label="Ниша"
            value={String(payload.niche ?? "")}
            onChange={(v) => setPayload({ ...payload, niche: v })}
          />
          <Field
            label="Описание"
            multiline
            value={String(payload.description ?? "")}
            onChange={(v) => setPayload({ ...payload, description: v })}
          />
          <Field
            label="Visual class"
            value={String(payload.visual ?? "")}
            onChange={(v) => setPayload({ ...payload, visual: v })}
          />
          <ImageField
            label="Обложка кейса"
            hint="Главная картинка в портфолио"
            value={String(payload.imageUrl ?? "")}
            onChange={(v) => setPayload({ ...payload, imageUrl: v })}
          />
          <GalleryField
            label="Галерея (доп. кадры)"
            value={
              Array.isArray(payload.gallery)
                ? (payload.gallery as string[])
                : []
            }
            onChange={(gallery) => setPayload({ ...payload, gallery })}
          />
          <Field
            label="Ссылка на проект"
            value={String(payload.url ?? "")}
            onChange={(v) => setPayload({ ...payload, url: v })}
          />
          <Field
            label="Задача"
            multiline
            value={String(payload.task ?? "")}
            onChange={(v) => setPayload({ ...payload, task: v })}
          />
          <Field
            label="Решение"
            multiline
            value={String(payload.solution ?? "")}
            onChange={(v) => setPayload({ ...payload, solution: v })}
          />
          <Field
            label="Результат"
            multiline
            value={String(payload.result ?? "")}
            onChange={(v) => setPayload({ ...payload, result: v })}
          />
          <Field
            label="Технологии"
            value={String(payload.tech ?? "")}
            onChange={(v) => setPayload({ ...payload, tech: v })}
          />
          <PointsEditor
            points={Array.isArray(payload.features) ? (payload.features as string[]) : []}
            onChange={(features) => setPayload({ ...payload, features })}
          />
          <label className="adm-field">
            <span>Живой проект</span>
            <input
              type="checkbox"
              checked={Boolean(payload.live)}
              onChange={(e) => setPayload({ ...payload, live: e.target.checked })}
            />
          </label>
        </>
      )}
    />
  )
}

export function PricesAdminPage() {
  return (
    <JsonCollectionPage
      table="prices"
      title="Цены"
      emptyPayload={() => ({
        title: "Новый тариф",
        price: "от 0 ₽",
        detail: emptyLeaflet(),
      })}
      seed={defaultContent.prices.map((p) => {
        const { id: _i, sortOrder, isPublished, ...payload } = p
        return { payload, sort_order: sortOrder, is_published: isPublished }
      })}
      renderFields={(payload, setPayload) => (
        <>
          <Field
            label="Название"
            value={String(payload.title ?? "")}
            onChange={(v) => setPayload({ ...payload, title: v })}
          />
          <Field
            label="Стоимость"
            value={String(payload.price ?? "")}
            onChange={(v) => setPayload({ ...payload, price: v })}
          />
          <LeafletFields
            value={(payload.detail as LeafletDetail) || emptyLeaflet()}
            onChange={(detail) => setPayload({ ...payload, detail })}
          />
        </>
      )}
    />
  )
}

export function StepsAdminPage() {
  return (
    <JsonCollectionPage
      table="steps"
      title="Этапы работы"
      emptyPayload={() => ({
        n: "01",
        title: "Новый этап",
        description: "",
        imageUrl: "",
      })}
      seed={defaultContent.steps.map((s) => {
        const { id: _i, sortOrder, isPublished, ...payload } = s
        return { payload, sort_order: sortOrder, is_published: isPublished }
      })}
      renderFields={(payload, setPayload) => (
        <>
          <Field
            label="Номер"
            value={String(payload.n ?? "")}
            onChange={(v) => setPayload({ ...payload, n: v })}
          />
          <Field
            label="Название"
            value={String(payload.title ?? "")}
            onChange={(v) => setPayload({ ...payload, title: v })}
          />
          <Field
            label="Описание"
            multiline
            value={String(payload.description ?? "")}
            onChange={(v) => setPayload({ ...payload, description: v })}
          />
          <Field
            label="URL иконки/изображения"
            value={String(payload.imageUrl ?? "")}
            onChange={(v) => setPayload({ ...payload, imageUrl: v })}
          />
        </>
      )}
    />
  )
}

function LeafletFields({
  value,
  onChange,
}: {
  value: LeafletDetail
  onChange: (v: LeafletDetail) => void
}) {
  return (
    <div className="adm-card" style={{ marginTop: 8 }}>
      <h2>Подробнее / leaflet</h2>
      <Field
        label="Eyebrow"
        value={value.eyebrow}
        onChange={(eyebrow) => onChange({ ...value, eyebrow })}
      />
      <Field
        label="Заголовок"
        value={value.title}
        onChange={(title) => onChange({ ...value, title })}
      />
      <Field
        label="Вступление"
        multiline
        value={value.intro}
        onChange={(intro) => onChange({ ...value, intro })}
      />
      <PointsEditor
        points={value.points || []}
        onChange={(points) => onChange({ ...value, points })}
      />
      <Field
        label="Примечание"
        multiline
        value={value.note || ""}
        onChange={(note) => onChange({ ...value, note })}
      />
    </div>
  )
}

function JsonCollectionPage({
  table,
  title,
  emptyPayload,
  renderFields,
}: {
  table: string
  title: string
  emptyPayload: () => Record<string, unknown>
  seed?: Array<Record<string, unknown>>
  renderFields: (
    payload: Record<string, unknown>,
    setPayload: (p: Record<string, unknown>) => void,
  ) => ReactNode
}) {
  const [rows, setRows] = useState<Row[]>([])
  const [editing, setEditing] = useState<Row | null>(null)
  const [payload, setPayload] = useState<Record<string, unknown>>({})
  const toast = useToast()

  const load = useCallback(async () => {
    try {
      const data = (await fetchCollection(table)) as Row[]
      setRows(data)
    } catch (err) {
      toast.setError(err instanceof Error ? err.message : "Ошибка загрузки")
    }
  }, [table])

  useEffect(() => {
    void load()
  }, [load])

  const startNew = () => {
    setEditing({
      sort_order: rows.length + 1,
      is_published: true,
    })
    setPayload(emptyPayload())
  }

  const startEdit = (row: Row) => {
    setEditing(row)
    setPayload({ ...(row.payload || {}) })
  }

  const save = async () => {
    if (!editing) return
    toast.setError("")
    try {
      await upsertCollectionRow(table, {
        ...(editing.id ? { id: editing.id } : {}),
        payload,
        sort_order: editing.sort_order,
        is_published: editing.is_published,
      })
      toast.setOk("Сохранено")
      setEditing(null)
      await load()
    } catch (err) {
      toast.setError(err instanceof Error ? err.message : "Ошибка")
    }
  }

  const remove = async (id: string) => {
    if (!confirm("Удалить запись?")) return
    try {
      await deleteCollectionRow(table, id)
      toast.setOk("Удалено")
      await load()
    } catch (err) {
      toast.setError(err instanceof Error ? err.message : "Ошибка удаления")
    }
  }

  const move = async (index: number, dir: -1 | 1) => {
    const next = index + dir
    if (next < 0 || next >= rows.length) return
    const a = rows[index]
    const b = rows[next]
    try {
      await upsertCollectionRow(table, {
        id: a.id,
        payload: a.payload,
        sort_order: b.sort_order,
        is_published: a.is_published,
      })
      await upsertCollectionRow(table, {
        id: b.id,
        payload: b.payload,
        sort_order: a.sort_order,
        is_published: b.is_published,
      })
      await load()
    } catch (err) {
      toast.setError(err instanceof Error ? err.message : "Ошибка сортировки")
    }
  }

  return (
    <>
      <PageHeader eyebrow="Контент" title={title}>
        <button className="adm-btn" type="button" onClick={startNew}>
          Добавить
        </button>
      </PageHeader>
      {toast.banners}
      <div className="adm-card">
        <table className="adm-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Название</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id}>
                <td>{row.sort_order}</td>
                <td>{String(row.payload?.title ?? "—")}</td>
                <td>{row.is_published ? "Опубликован" : "Скрыт"}</td>
                <td>
                  <div className="adm-row-actions">
                    <button
                      className="adm-btn ghost"
                      type="button"
                      onClick={() => void move(i, -1)}
                    >
                      ↑
                    </button>
                    <button
                      className="adm-btn ghost"
                      type="button"
                      onClick={() => void move(i, 1)}
                    >
                      ↓
                    </button>
                    <button
                      className="adm-btn ghost"
                      type="button"
                      onClick={() => startEdit(row)}
                    >
                      Изменить
                    </button>
                    <button
                      className="adm-btn ghost"
                      type="button"
                      onClick={() => row.id && void remove(row.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="adm-card">
          <h2>{editing.id ? "Редактирование" : "Новая запись"}</h2>
          {renderFields(payload, setPayload)}
          <div className="adm-grid-2">
            <Field
              label="Порядок"
              type="number"
              value={String(editing.sort_order)}
              onChange={(v) =>
                setEditing({ ...editing, sort_order: Number(v) || 0 })
              }
            />
            <label className="adm-field">
              <span>Опубликовано</span>
              <input
                type="checkbox"
                checked={editing.is_published}
                onChange={(e) =>
                  setEditing({ ...editing, is_published: e.target.checked })
                }
              />
            </label>
          </div>
          <div className="adm-actions">
            <button className="adm-btn ghost" type="button" onClick={() => setEditing(null)}>
              Отмена
            </button>
            <button className="adm-btn" type="button" onClick={() => void save()}>
              Сохранить / опубликовать
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export function FaqAdminPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [editing, setEditing] = useState<Row | null>(null)
  const toast = useToast()

  const load = useCallback(async () => {
    try {
      setRows((await fetchCollection("faq")) as Row[])
    } catch (err) {
      toast.setError(err instanceof Error ? err.message : "Ошибка")
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const save = async () => {
    if (!editing) return
    try {
      await upsertCollectionRow("faq", {
        ...(editing.id ? { id: editing.id } : {}),
        question: editing.question,
        answer: editing.answer,
        sort_order: editing.sort_order,
        is_published: editing.is_published,
      })
      toast.setOk("Сохранено")
      setEditing(null)
      await load()
    } catch (err) {
      toast.setError(err instanceof Error ? err.message : "Ошибка")
    }
  }

  return (
    <>
      <PageHeader eyebrow="Контент" title="FAQ">
        <button
          className="adm-btn"
          type="button"
          onClick={() =>
            setEditing({
              question: "",
              answer: "",
              sort_order: rows.length + 1,
              is_published: true,
            })
          }
        >
          Добавить
        </button>
      </PageHeader>
      {toast.banners}
      <div className="adm-card">
        <table className="adm-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Вопрос</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.sort_order}</td>
                <td>{row.question}</td>
                <td>{row.is_published ? "Да" : "Скрыт"}</td>
                <td>
                  <div className="adm-row-actions">
                    <button
                      className="adm-btn ghost"
                      type="button"
                      onClick={() => setEditing(row)}
                    >
                      Изменить
                    </button>
                    <button
                      className="adm-btn ghost"
                      type="button"
                      onClick={async () => {
                        if (!row.id || !confirm("Удалить?")) return
                        await deleteCollectionRow("faq", row.id)
                        await load()
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <div className="adm-card">
          <Field
            label="Вопрос"
            value={editing.question || ""}
            onChange={(question) => setEditing({ ...editing, question })}
          />
          <Field
            label="Ответ"
            multiline
            value={editing.answer || ""}
            onChange={(answer) => setEditing({ ...editing, answer })}
          />
          <Field
            label="Порядок"
            type="number"
            value={String(editing.sort_order)}
            onChange={(v) =>
              setEditing({ ...editing, sort_order: Number(v) || 0 })
            }
          />
          <label className="adm-field">
            <span>Опубликовано</span>
            <input
              type="checkbox"
              checked={editing.is_published}
              onChange={(e) =>
                setEditing({ ...editing, is_published: e.target.checked })
              }
            />
          </label>
          <div className="adm-actions">
            <button className="adm-btn ghost" type="button" onClick={() => setEditing(null)}>
              Отмена
            </button>
            <button className="adm-btn" type="button" onClick={() => void save()}>
              Сохранить
            </button>
          </div>
        </div>
      )}
    </>
  )
}

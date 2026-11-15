import { useState } from "react"
import { seedFromDefaults } from "../../content/api"
import { isSupabaseConfigured } from "../../lib/supabase"
import { SectionEditor } from "./SectionEditor"
import { defaultContent } from "../../content/defaults"
import { PageHeader, useToast } from "../ui"

export function SettingsPage() {
  const toast = useToast()
  const [busy, setBusy] = useState(false)

  const seed = async () => {
    if (
      !confirm(
        "Заполнить базу текущим контентом сайта? Пустые коллекции будут заполнены, секции — перезаписаны published/draft.",
      )
    ) {
      return
    }
    setBusy(true)
    toast.setError("")
    try {
      await seedFromDefaults()
      toast.setOk("Сид выполнен")
    } catch (err) {
      toast.setError(err instanceof Error ? err.message : "Ошибка сида")
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader eyebrow="Система" title="Настройки" />
      {toast.banners}
      <div className="adm-card">
        <h2>Подключение</h2>
        <p style={{ fontSize: 14, lineHeight: 1.5 }}>
          Supabase:{" "}
          <strong>{isSupabaseConfigured ? "подключён" : "не настроен"}</strong>
        </p>
        <p style={{ fontSize: 13, color: "#6b625c", lineHeight: 1.5 }}>
          1. Создайте проект на supabase.com
          <br />
          2. Выполните SQL из{" "}
          <code>supabase/migrations/001_initial.sql</code>
          <br />
          3. Authentication → Disable public sign-ups, Add user (ваш email)
          <br />
          4. Вставьте URL и anon key в <code>.env.local</code>
          <br />
          5. Нажмите «Заполнить из сайта» ниже
        </p>
        <div className="adm-actions">
          <button
            className="adm-btn"
            type="button"
            disabled={!isSupabaseConfigured || busy}
            onClick={() => void seed()}
          >
            Заполнить из сайта (seed)
          </button>
        </div>
      </div>

      <SectionEditor
        sectionKey="services_intro"
        eyebrow="Интро"
        title="Заголовок блока услуг"
        defaults={{ ...defaultContent.servicesIntro }}
        fields={[
          { key: "eyebrow", label: "Eyebrow" },
          { key: "titleLine1", label: "Заголовок 1" },
          { key: "titleLine2", label: "Заголовок 2" },
          { key: "description", label: "Описание", multiline: true },
        ]}
      />

      <SectionEditor
        sectionKey="portfolio_intro"
        eyebrow="Интро"
        title="Заголовок портфолио"
        defaults={{ ...defaultContent.portfolioIntro }}
        fields={[
          { key: "eyebrow", label: "Eyebrow" },
          { key: "titleLine1", label: "Заголовок 1" },
          { key: "titleLine2", label: "Заголовок 2" },
          { key: "description", label: "Описание", multiline: true },
        ]}
      />

      <SectionEditor
        sectionKey="marquee"
        eyebrow="Интро"
        title="Бегущая строка"
        defaults={{ items: defaultContent.marquee.join("\n") }}
        fields={[
          {
            key: "items",
            label: "Фразы (по одной в строке)",
            multiline: true,
          },
        ]}
      />
    </>
  )
}

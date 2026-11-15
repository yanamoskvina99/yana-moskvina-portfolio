import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { isSupabaseConfigured, supabase } from "../../lib/supabase"
import { PageHeader } from "../ui"

export function OverviewPage() {
  const [stats, setStats] = useState({
    services: 0,
    projects: 0,
    faq: 0,
    media: 0,
  })

  useEffect(() => {
    if (!supabase) return
    void (async () => {
      const [s, p, f, m] = await Promise.all([
        supabase.from("services").select("*", { count: "exact", head: true }),
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("faq").select("*", { count: "exact", head: true }),
        supabase.from("media").select("*", { count: "exact", head: true }),
      ])
      setStats({
        services: s.count ?? 0,
        projects: p.count ?? 0,
        faq: f.count ?? 0,
        media: m.count ?? 0,
      })
    })()
  }, [])

  return (
    <>
      <PageHeader eyebrow="YM ADMIN" title="Обзор" />
      {!isSupabaseConfigured && (
        <p className="adm-error">Подключите Supabase в .env.local</p>
      )}
      <div className="adm-stats">
        <div className="adm-stat">
          <strong>{stats.services}</strong>
          <span>Услуги</span>
        </div>
        <div className="adm-stat">
          <strong>{stats.projects}</strong>
          <span>Проекты</span>
        </div>
        <div className="adm-stat">
          <strong>{stats.faq}</strong>
          <span>FAQ</span>
        </div>
        <div className="adm-stat">
          <strong>{stats.media}</strong>
          <span>Медиа</span>
        </div>
      </div>
      <div className="adm-card" style={{ marginTop: 20 }}>
        <h2>Быстрые ссылки</h2>
        <div className="adm-actions">
          <Link className="adm-btn ghost" to="/admin/home">
            Главная
          </Link>
          <Link className="adm-btn ghost" to="/admin/portfolio">
            Портфолио
          </Link>
          <Link className="adm-btn ghost" to="/admin/media">
            Медиатека
          </Link>
          <Link className="adm-btn ghost" to="/admin/settings">
            Настройки / сид
          </Link>
          <a className="adm-btn" href="/" target="_blank" rel="noreferrer">
            Открыть сайт
          </a>
        </div>
      </div>
    </>
  )
}

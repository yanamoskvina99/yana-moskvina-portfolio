import { NavLink, Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./AuthProvider"

const links = [
  { to: "/admin", end: true, label: "Обзор" },
  { to: "/admin/home", label: "Главная" },
  { to: "/admin/about", label: "Обо мне" },
  { to: "/admin/services", label: "Услуги" },
  { to: "/admin/portfolio", label: "Портфолио" },
  { to: "/admin/prices", label: "Цены" },
  { to: "/admin/steps", label: "Этапы работы" },
  { to: "/admin/faq", label: "FAQ" },
  { to: "/admin/contacts", label: "Контакты" },
  { to: "/admin/seo", label: "SEO" },
  { to: "/admin/media", label: "Медиатека" },
  { to: "/admin/settings", label: "Настройки" },
]

export function AdminLayout() {
  const { user, loading, configured, signOut } = useAuth()

  if (loading) {
    return (
      <div className="ym-admin adm-login">
        <p className="adm-eyebrow">Загрузка…</p>
      </div>
    )
  }

  if (!configured) {
    return <Navigate to="/admin/login" replace />
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="ym-admin adm-shell">
      <aside className="adm-sidebar">
        <div className="adm-brand">
          <strong>YM</strong>
          <span>Admin</span>
        </div>
        <nav className="adm-nav" aria-label="Разделы админки">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="adm-sidebar-foot">
          <span style={{ fontSize: 11, opacity: 0.65 }}>{user.email}</span>
          <button type="button" onClick={() => void signOut()}>
            Выйти
          </button>
          <a href="/" style={{ color: "inherit", fontSize: 11, opacity: 0.7 }}>
            ← На сайт
          </a>
        </div>
      </aside>
      <main className="adm-main">
        <Outlet />
      </main>
    </div>
  )
}

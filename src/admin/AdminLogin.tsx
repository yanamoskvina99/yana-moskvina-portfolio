import { FormEvent, useState } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthProvider"

export function AdminLogin() {
  const { user, loading, configured, signIn, resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [ok, setOk] = useState("")
  const [busy, setBusy] = useState(false)

  if (!loading && user) return <Navigate to="/admin" replace />

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setOk("")
    setBusy(true)
    try {
      await signIn(email.trim(), password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа")
    } finally {
      setBusy(false)
    }
  }

  const onReset = async () => {
    setError("")
    setOk("")
    if (!email.trim()) {
      setError("Укажите email для восстановления")
      return
    }
    setBusy(true)
    try {
      await resetPassword(email.trim())
      setOk("Письмо для сброса пароля отправлено (если аккаунт существует).")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сброса")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ym-admin adm-login">
      <form className="adm-login-card" onSubmit={onSubmit}>
        <span className="adm-eyebrow">YM ADMIN</span>
        <h1>Вход</h1>
        {!configured && (
          <p className="adm-error">
            Supabase не настроен. Добавьте VITE_SUPABASE_URL и
            VITE_SUPABASE_ANON_KEY в .env.local и перезапустите Vite.
          </p>
        )}
        {error && <p className="adm-error">{error}</p>}
        {ok && <p className="adm-ok">{ok}</p>}
        <div className="adm-field">
          <label htmlFor="adm-email">Email</label>
          <input
            id="adm-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="adm-field">
          <label htmlFor="adm-pass">Пароль</label>
          <input
            id="adm-pass"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="adm-actions" style={{ marginTop: 8 }}>
          <button className="adm-btn" type="submit" disabled={busy || !configured}>
            Войти
          </button>
          <button
            className="adm-btn ghost"
            type="button"
            disabled={busy || !configured}
            onClick={onReset}
          >
            Сброс пароля
          </button>
        </div>
      </form>
    </div>
  )
}

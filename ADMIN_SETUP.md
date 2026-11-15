# YM ADMIN — подключение на Reg.ru + Supabase

## 1. Supabase

1. Создай проект на [supabase.com](https://supabase.com) (регион Frankfurt).
2. **SQL Editor** → вставь и выполни файл `supabase/migrations/001_initial.sql`.
3. **Authentication → Providers → Email**: включён.
4. **Authentication → Settings**: отключи **Allow new users to sign up**.
5. **Authentication → Users → Add user**: свой email и пароль (вход в `/admin`).
6. **Project Settings → API**: скопируй **Project URL** и **anon public** key.

## 2. Локально

Создай / заполни `.env.local`:

```bash
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Перезапусти Vite (`npm run dev`).

Открой `http://127.0.0.1:5173/admin/login` → войди → **Настройки → Заполнить из сайта (seed)**.

## 3. Выкладка на Reg.ru

```bash
npm run build
```

Залей содержимое папки `dist/` в корень сайта (или `public_html`).  
Файл `.htaccess` должен оказаться рядом с `index.html` (он копируется из `public/`).

Проверь:

- `https://ym-designer.ru/` — сайт
- `https://ym-designer.ru/admin` — админка

Если `/admin` даёт 404 — на хостинге не включён `mod_rewrite` или `.htaccess` не подхватился.

## 4. Как пользоваться

1. Войти на `/admin`.
2. Править тексты / услуги / проекты / FAQ / SEO.
3. **Опубликовать** — изменения появляются на сайте без повторной заливки кода.
4. Картинки: **Медиатека → Загрузить → скопировать URL** в поле изображения.

Повторная заливка `dist` нужна только когда меняется код/дизайн, не контент.

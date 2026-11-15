import { useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { useSiteContent } from "./content/ContentProvider"

function iconMime(url: string): string | undefined {
  if (/\.svg($|\?)/i.test(url)) return "image/svg+xml"
  if (/\.png($|\?)/i.test(url)) return "image/png"
  if (/\.jpe?g($|\?)/i.test(url)) return "image/jpeg"
  if (/\.webp($|\?)/i.test(url)) return "image/webp"
  if (/\.ico($|\?)/i.test(url)) return "image/x-icon"
  return undefined
}

function applyHeadIcons(favicon: string, apple: string) {
  const head = document.head
  head
    .querySelectorAll('link[rel*="icon"], link[rel="apple-touch-icon"]')
    .forEach((node) => node.remove())

  const icon = document.createElement("link")
  icon.rel = "icon"
  icon.href = favicon
  const mime = iconMime(favicon)
  if (mime) icon.type = mime
  head.appendChild(icon)

  const shortcut = document.createElement("link")
  shortcut.rel = "shortcut icon"
  shortcut.href = favicon
  head.appendChild(shortcut)

  const touch = document.createElement("link")
  touch.rel = "apple-touch-icon"
  touch.href = apple
  touch.setAttribute("sizes", "180x180")
  head.appendChild(touch)
}

export function SeoHelmet() {
  const { content } = useSiteContent()
  const s = content.seo
  const favicon = s.faviconUrl || "/favicon.png?v=ym-wine-1"
  const apple = s.appleTouchIconUrl || "/apple-touch-icon.png?v=ym-wine-1"

  useEffect(() => {
    applyHeadIcons(favicon, apple)
  }, [favicon, apple])

  return (
    <Helmet>
      <title>{s.title}</title>
      <meta name="description" content={s.description} />
      <meta name="robots" content={s.robots} />
      <link rel="canonical" href={s.canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:site_name" content="Яна Москвина — веб-дизайнер" />
      <meta property="og:title" content={s.ogTitle} />
      <meta property="og:description" content={s.ogDescription} />
      <meta property="og:image" content={s.ogImage} />
      <meta property="og:image:alt" content={s.ogImageAlt} />
      <meta property="og:url" content={s.canonical} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={s.twitterTitle} />
      <meta name="twitter:description" content={s.twitterDescription} />
      <meta name="twitter:image" content={s.twitterImage} />
    </Helmet>
  )
}

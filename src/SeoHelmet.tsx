import { Helmet } from "react-helmet-async"
import { useSiteContent } from "./content/ContentProvider"

export function SeoHelmet() {
  const { content } = useSiteContent()
  const s = content.seo
  return (
    <Helmet>
      <title>{s.title}</title>
      <meta name="description" content={s.description} />
      <meta name="robots" content={s.robots} />
      <link rel="canonical" href={s.canonical} />
      <meta property="og:title" content={s.ogTitle} />
      <meta property="og:description" content={s.ogDescription} />
      <meta property="og:image" content={s.ogImage} />
      <meta property="og:image:alt" content={s.ogImageAlt} />
      <meta property="og:url" content={s.canonical} />
      <meta name="twitter:title" content={s.twitterTitle} />
      <meta name="twitter:description" content={s.twitterDescription} />
      <meta name="twitter:image" content={s.twitterImage} />
    </Helmet>
  )
}

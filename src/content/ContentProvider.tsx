import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import {
  fetchPublishedContent,
  normalizeContacts,
  sanitizeContentAssets,
} from "./api"
import { defaultContent } from "./defaults"
import type { SiteContent } from "./types"

const CACHE_KEY = "ym-published-content-v2"

function withNormalizedContacts(content: SiteContent): SiteContent {
  return {
    ...content,
    contacts: normalizeContacts(content.contacts),
  }
}

function assetFingerprint() {
  return [
    defaultContent.hero.imageUrl,
    defaultContent.about.mainImageUrl,
    defaultContent.about.detailImageUrl,
    defaultContent.seo.faviconUrl,
    defaultContent.seo.appleTouchIconUrl,
    defaultContent.projects.map((p) => p.imageUrl).join("|"),
  ].join("::")
}

function readCachedContent(): SiteContent | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as {
      fingerprint?: string
      content?: SiteContent
    }
    if (!parsed?.content || parsed.fingerprint !== assetFingerprint()) return null
    return sanitizeContentAssets(withNormalizedContacts(parsed.content))
  } catch {
    return null
  }
}

function writeCachedContent(content: SiteContent) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        fingerprint: assetFingerprint(),
        content,
      }),
    )
  } catch {
    /* quota / private mode */
  }
}

type Ctx = {
  content: SiteContent
  loading: boolean
  refresh: () => Promise<void>
}

const ContentContext = createContext<Ctx>({
  content: defaultContent,
  loading: false,
  refresh: async () => {},
})

export function ContentProvider({ children }: { children: ReactNode }) {
  const cached = readCachedContent()
  const [content, setContent] = useState<SiteContent>(
    () => cached ?? withNormalizedContacts(defaultContent),
  )
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(Boolean(cached))

  const refresh = async () => {
    setLoading(true)
    try {
      const next = withNormalizedContacts(await fetchPublishedContent())
      setContent(next)
      writeCachedContent(next)
    } finally {
      setLoading(false)
      setReady(true)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  if (!ready) {
    return (
      <div className="site-boot" aria-busy="true" aria-live="polite">
        <div className="site-boot-mark">
          <span className="site-boot-spinner" aria-hidden="true" />
          <span className="site-boot-logo">YM</span>
        </div>
        <p className="site-boot-label">Загрузка</p>
      </div>
    )
  }

  return (
    <ContentContext.Provider value={{ content, loading, refresh }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useSiteContent() {
  return useContext(ContentContext)
}

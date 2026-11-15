import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { fetchPublishedContent } from "./api"
import { defaultContent } from "./defaults"
import type { SiteContent } from "./types"

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
  const [content, setContent] = useState<SiteContent>(defaultContent)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    setLoading(true)
    try {
      const next = await fetchPublishedContent()
      setContent(next)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  return (
    <ContentContext.Provider value={{ content, loading, refresh }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useSiteContent() {
  return useContext(ContentContext)
}

export type LeafletDetail = {
  eyebrow: string
  title: string
  intro: string
  points: string[]
  note?: string
}

export type HeroContent = {
  line1: string
  line2: string
  line3: string
  description: string
  formats: string
  ctaLabel: string
  manifesto: string
  imageUrl: string
  imageAlt: string
}

export type AboutContent = {
  eyebrow: string
  titleLine1: string
  titleLine2a: string
  titleLine2b: string
  mainImageUrl: string
  mainImageAlt: string
  captionName: string
  captionRole: string
  quote: string
  body1: string
  body2: string
  detailImageUrl: string
  detailImageAlt: string
  asideNote: string
}

export type ServiceItem = {
  id: string
  n: string
  title: string
  text: string
  fit: string
  visual: string
  imageUrl: string
  detail: LeafletDetail
  priceLabel?: string
  buttonLabel?: string
  buttonHref?: string
  sortOrder: number
  isPublished: boolean
}

export type ProjectItem = {
  id: string
  category: string
  title: string
  niche: string
  description: string
  visual: string
  live?: boolean
  url?: string
  imageUrl?: string
  label?: string
  features?: string[]
  gallery?: string[]
  galleryDesktop?: string[]
  galleryDesktopCaptions?: (string | undefined)[]
  galleryMobile?: string[]
  task?: string
  solution?: string
  result?: string
  tech?: string
  sortOrder: number
  isPublished: boolean
}

export type PriceItem = {
  id: string
  title: string
  price: string
  detail: LeafletDetail
  buttonLabel?: string
  buttonHref?: string
  sortOrder: number
  isPublished: boolean
}

export type StepItem = {
  id: string
  n: string
  title: string
  description: string
  imageUrl?: string
  sortOrder: number
  isPublished: boolean
}

export type FaqItem = {
  id: string
  question: string
  answer: string
  sortOrder: number
  isPublished: boolean
}

export type ContactsContent = {
  email: string
  phone: string
  phoneHref: string
  telegram: string
  telegramUrl: string
  instagram: string
  instagramUrl: string
  maxUrl: string
  ctaLine1: string
  ctaLine2: string
  ctaLine3: string
  ctaText: string
  ctaButton: string
}

export type SeoContent = {
  title: string
  description: string
  canonical: string
  robots: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  ogImageAlt: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  faviconUrl: string
  appleTouchIconUrl: string
}

export type PortfolioIntro = {
  eyebrow: string
  titleLine1: string
  titleLine2: string
  description: string
}

export type ServicesIntro = {
  eyebrow: string
  titleLine1: string
  titleLine2: string
  description: string
}

export type SiteContent = {
  hero: HeroContent
  about: AboutContent
  servicesIntro: ServicesIntro
  services: ServiceItem[]
  portfolioIntro: PortfolioIntro
  projects: ProjectItem[]
  prices: PriceItem[]
  steps: StepItem[]
  faqs: FaqItem[]
  contacts: ContactsContent
  seo: SeoContent
  marquee: string[]
}

export type SectionKey =
  | "hero"
  | "about"
  | "services_intro"
  | "portfolio_intro"
  | "contacts"
  | "seo"
  | "marquee"
  | "settings"

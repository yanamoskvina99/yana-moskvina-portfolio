import { FormEvent, useEffect, useRef, useState } from "react"
import yanaFlowers from "./assets/yana-flowers.jpg"
import yanaEditorial from "./assets/yana-editorial.jpg"
import yanaPortrait from "./assets/yana-portrait.jpg"
import yanaBw from "./assets/yana-bw.jpg"
import idelMockup from "./assets/idel/mockup.png"
import marketplacePreview from "./assets/marketplace/preview.png"
import marketplaceHome from "./assets/marketplace/home.png"
import marketplaceAds from "./assets/marketplace/ads.png"
import marketplaceModeration from "./assets/marketplace/moderation.png"
import marketplaceMobileHome from "./assets/marketplace/mobile-home.png"
import marketplaceMobileAds from "./assets/marketplace/mobile-ads.png"
import marketplaceMobileFilters from "./assets/marketplace/mobile-filters.png"
import marketplaceMobileProfile from "./assets/marketplace/mobile-profile.png"
import asteraPreview from "./assets/astera/preview.png"
import asteraDetail from "./assets/astera/detail.png"
import bug8earPreview from "./assets/bug8ear/preview.png"
import bug8earDetail from "./assets/bug8ear/detail.png"

type Leaflet = {
  eyebrow: string
  title: string
  intro: string
  points: string[]
  note?: string
}

type Project = {
  category: string
  title: string
  niche: string
  description: string
  visual: string
  live?: boolean
  url?: string
  image?: string
  label?: string
  features?: string[]
  gallery?: string[]
  galleryDesktop?: string[]
  galleryDesktopCaptions?: (string | undefined)[]
  galleryMobile?: string[]
}

const services = [
  {
    n: "01",
    title: "Цифровая визитка",
    text: "Мобильная страница, которая собирает услуги, контакты и важные ссылки в одном месте.",
    fit: "нужна эстетичная визитка для соцсетей с услугами и удобной связью.",
    visual: "visiting",
    detail: {
      eyebrow: "Услуги / Цифровая визитка",
      title: "Всё важное — в одном месте",
      intro:
        "Индивидуальная страница для знакомства с вами, вашими услугами и возможностями сотрудничества.",
      points: [
        "Индивидуальная визуальная концепция",
        "Персональное представление и информация о вас",
        "Презентация услуг и стоимости",
        "Фотографии и визуальные материалы",
        "Ссылки на социальные сети и мессенджеры",
        "Кнопки связи и заявки",
        "Удобная мобильная навигация",
      ],
      note: "Одна ссылка вместо разрозненных контактов, сторис и сообщений.",
    },
  },
  {
    n: "02",
    title: "Лендинг",
    text: "Одностраничный сайт с последовательным сценарием: от первого впечатления до целевого действия.",
    fit: "нужно презентовать продукт, услугу, событие или новый запуск.",
    visual: "landing",
    detail: {
      eyebrow: "Услуги / Лендинг",
      title: "Одна история — один точный маршрут",
      intro:
        "Лендинг показывает, в чём польза предложения, и ведёт к заявке, покупке или знакомству.",
      points: [
        "Анализ задачи и аудитории",
        "Смысловая структура и прототип",
        "Индивидуальный дизайн",
        "Анимации, формы и адаптивная версия",
      ],
      note: "Хороший выбор для сфокусированного предложения, которому не нужна сложная многоуровневая навигация.",
    },
  },
  {
    n: "03",
    title: "Многостраничный сайт",
    text: "Сайт из нескольких разделов: направления, услуги и навигация между ними.",
    fit: "бренду важно подробно рассказать о себе и выстроить удобную навигацию.",
    visual: "pages",
    detail: {
      eyebrow: "Услуги / Многостраничный сайт",
      title: "Несколько разделов — одна система",
      intro:
        "У каждого раздела своя задача, а оформление, тон и навигация остаются общими.",
      points: [
        "Анализ и карта разделов",
        "Сценарии и логика переходов",
        "Единая визуальная система",
        "Адаптивные страницы и функциональность",
      ],
      note: "Подходит компаниям, студиям и брендам, которым нужен полноценный ресурс с потенциалом развития.",
    },
  },
]

const priceOffers: Array<{ title: string; price: string; detail: Leaflet }> = [
  {
    title: "Сайт без админ-панели",
    price: "от 10 000 ₽",
    detail: {
      eyebrow: "Прайс / Разработка",
      title: "Сайт без админ-панели",
      intro:
        "Индивидуальный сайт, готовый к публикации и работе с вашей аудиторией.",
      points: [
        "Индивидуальный дизайн и разработка",
        "Мобильная адаптация",
        "Анимации и интерактивные элементы",
        "Формы обратной связи",
        "Публикация сайта",
      ],
      note: "После передачи самостоятельное изменение контента без CMS может потребовать помощи разработчика.",
    },
  },
  {
    title: "Сайт с индивидуальной админ-панелью",
    price: "от 30 000 ₽",
    detail: {
      eyebrow: "Прайс / Основное предложение",
      title: "Сайт с админ-панелью",
      intro:
        "Сайт и персональная защищённая панель для самостоятельного обновления содержания.",
      points: [
        "Индивидуальный дизайн и разработка",
        "Мобильная адаптация",
        "Авторизация, защищённый доступ и база данных",
        "Редактирование текстов, изображений, цен, услуг и карточек",
        "Публикация сайта",
      ],
      note: "Панель меняет контент, но не визуальную концепцию, структуру, шрифты, фирменные цвета и общий дизайн.",
    },
  },
  {
    title: "Настройка Яндекс Метрики",
    price: "от 10 000 ₽",
    detail: {
      eyebrow: "Прайс / Аналитика",
      title: "Настройка Яндекс Метрики",
      intro:
        "Корректная техническая настройка аналитики для понимания действий посетителей.",
      points: [
        "Установка счётчика",
        "Настройка целей и событий",
        "Отслеживание форм и нажатий",
        "Электронная коммерция при необходимости",
        "Проверка корректности работы",
      ],
    },
  },
]

const projects: Project[] = [
  {
    category: "Лендинг",
    title: "Идель Баши",
    niche: "Всесезонный кемпинг",
    description:
      "Сайт кемпинга у подножия Иремеля: атмосферная подача места, проживание, сценарии отдыха и понятный путь к бронированию.",
    visual: "idel",
    live: true,
    url: "https://idel-bashi.ru/",
    image: idelMockup,
  },
  {
    category: "Лендинг",
    title: "Астера",
    niche: "Глэмпинг в Башкирии",
    description:
      "Авторский лендинг глэмпинга «Астера» в природном парке Зилим, рядом с деревней Толпарово. Поблизости река Зилим и горы Кук-Таш и Мамбет. Сайт показывает уединённый отдых среди леса и гор: тёмно-оливковая палитра, крупные пейзажи, асимметричная журнальная вёрстка, тонкие линии, топографические контуры и рукописные акценты.",
    visual: "astera",
    image: asteraPreview,
    features: [
      "Первый экран с атмосферным пейзажем и позиционированием глэмпинга",
      "Знакомство с проектом и его философией",
      "Фотографии территории и вариантов отдыха",
      "Окружение и природные достопримечательности",
      "Географическая карта с расположением глэмпинга",
    ],
    gallery: [asteraPreview, asteraDetail],
  },
  {
    category: "Интернет-магазин",
    title: "Маркетплейс",
    niche: "Африканский marketplace",
    description:
      "Концепция маркетплейса для мусульманской аудитории: объявления, поиск товаров и услуг, кабинеты продавца и покупателя. Структура близка к привычному классифайду, оформление — к исламской эстетике: глубокий зелёный, золото, песочные оттенки, орнамент и архитектурные мотивы.",
    visual: "marketplace",
    image: marketplacePreview,
    features: [
      "Каталог товаров и объявлений по категориям",
      "Поиск и фильтрация предложений",
      "Карточки товаров с фотографиями и ценами",
      "Личный кабинет пользователя",
      "Размещение и управление объявлениями",
      "Интерфейс модерации публикаций",
    ],
    galleryDesktop: [
      marketplaceHome,
      marketplaceAds,
      marketplaceModeration,
    ],
    galleryDesktopCaptions: [
      undefined,
      "Личный кабинет пользователя",
      "Панель модерации объявлений",
    ],
    galleryMobile: [
      marketplaceMobileHome,
      marketplaceMobileAds,
      marketplaceMobileFilters,
      marketplaceMobileProfile,
    ],
  },
  {
    category: "Лендинг",
    title: "BUG8EAR",
    niche: "Киберпанк-портфолио full-stack разработчика",
    label: "Лендинг / Концепт",
    description:
      "Персональный сайт-портфолио full-stack разработчика Артёма — пространство, где характер автора читается с первого экрана. Визуальная концепция опирается на футуристичную эстетику киберпанка: глубокий тёмный фон, насыщенный красный, мягкое свечение акцентов и выразительная типографика. Вместе они складывают цельную цифровую идентичность — смелую, современную и запоминающуюся. Сайт ведёт от главной страницы к знакомству с разработчиком, обзору технологий, портфолио проектов и контактам, сохраняя единый визуальный ритм на всём пути.",
    visual: "bug8ear",
    image: bug8earPreview,
    gallery: [bug8earPreview, bug8earDetail],
  },
]

const steps = [
  [
    "01",
    "Знакомство и обсуждение задачи",
    "Обсуждаем идею, цели проекта, особенности бизнеса и пожелания.",
  ],
  [
    "02",
    "Анализ и структура",
    "Вместе определяем разделы, содержание и логику пути пользователя.",
  ],
  [
    "03",
    "Визуальная концепция",
    "Разрабатываю направление и согласовываю его с вами до следующих этапов.",
  ],
  [
    "04",
    "Дизайн и разработка",
    "Создаю страницы, функциональность, анимации и адаптивную версию.",
  ],
  [
    "05",
    "Проверка и запуск",
    "Тестирую элементы, публикую сайт и передаю готовый проект.",
  ],
]

const CONTACT_EMAIL = "yana.moskwina.99@gmail.com"
const WEB3FORMS_ACCESS_KEY = "3b56c485-bceb-4c31-9150-47b5db077c2b"
const FORM_ENDPOINT = "https://api.web3forms.com/submit"
const FORM_TIMEOUT_MS = 15000

const faqs = [
  [
    "Сколько времени занимает разработка сайта?",
    "Срок зависит от формата, сложности и объёма проекта. После обсуждения задачи согласуем сроки индивидуально.",
  ],
  [
    "Что нужно подготовить перед началом работы?",
    "Достаточно понимания своей идеи или задачи. Структуру, содержание и необходимые материалы можно обсудить вместе.",
  ],
  [
    "Нужно ли самостоятельно писать тексты и искать фотографии?",
    "Всё зависит от проекта и исходных материалов. Обсудим, что уже есть и что потребуется подготовить дополнительно.",
  ],
  [
    "Можно ли будет самостоятельно редактировать сайт?",
    "Да, если проект предусматривает индивидуальную админ-панель. Она позволяет изменять содержание сайта. Без неё для редактирования может понадобиться помощь разработчика.",
  ],
  [
    "Входят ли домен и хостинг в стоимость?",
    "Нет, домен и хостинг оплачиваются отдельно.",
  ],
  [
    "Сколько правок предусмотрено?",
    "Предусмотрено до пяти небольших раундов правок в рамках согласованного задания. Изменения функциональности и объёма обсуждаются отдельно.",
  ],
  [
    "Предусмотрена ли поддержка после запуска?",
    "Да, предусмотрено 14 дней гарантийной поддержки после сдачи проекта.",
  ],
  [
    "Можно ли доработать сайт в будущем?",
    "Да. Можно добавить новые разделы и функции. Объём доработок обсуждается отдельно.",
  ],
  [
    "Что делать, если я пока не знаю, какой сайт мне нужен?",
    "Это нормально. Обсудим задачу, особенности бизнеса и подберём подходящий формат.",
  ],
]

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 13 13 3M5 3h8v8" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true">
      <path d="M2.5 2.5 11.5 11.5M11.5 2.5 2.5 11.5" />
    </svg>
  )
}

function SocialIcon({
  name,
}: {
  name: "instagram" | "telegram" | "max" | "mail" | "phone"
}) {
  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.7" cy="6.7" r=".8" className="fill" />
      </svg>
    )
  }
  if (name === "telegram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m3 11 17-7-4 16-5.7-5-3.5 2.7.7-5.2L17 7l-6.7 8" />
      </svg>
    )
  }
  if (name === "mail") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
        <path d="m4.5 7.5 7.5 6 7.5-6" />
      </svg>
    )
  }
  if (name === "phone") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.2 4.8h2.2l1.1 2.6-1.4 1.4a12 12 0 0 0 5.1 5.1l1.4-1.4 2.6 1.1v2.2c0 .7-.5 1.2-1.2 1.2A14.2 14.2 0 0 1 7 6c0-.7.5-1.2 1.2-1.2Z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 18V6l4.8 7L12 8l3.2 5L20 6v12M4 18h16" />
    </svg>
  )
}

function ProjectVisual({
  project,
  decorative = true,
}: {
  project: Project
  decorative?: boolean
}) {
  const kind = project.visual
  if (!project.image) return null
  return (
    <div
      className={`project-visual project-${kind} has-mockup`}
      aria-hidden={decorative ? true : undefined}
    >
      <img
        className="project-mockup"
        src={project.image}
        alt={decorative ? "" : project.title}
      />
    </div>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState("Все")
  const [project, setProject] = useState<typeof projects[number] | null>(null)
  const [leaflet, setLeaflet] = useState<Leaflet | null>(null)
  const [briefOpen, setBriefOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [consentError, setConsentError] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string
    contact?: string
    task?: string
  }>({})
  const [submitMessage, setSubmitMessage] = useState("")
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  )
  const [policyOpen, setPolicyOpen] = useState(false)
  const [modalClosing, setModalClosing] = useState(false)
  const [cookieReady, setCookieReady] = useState(false)
  const [cookiePreference, setCookiePreference] = useState<string | null>(null)
  const [cookieDetailsOpen, setCookieDetailsOpen] = useState(false)
  const [showToTop, setShowToTop] = useState(false)
  const [toTopLift, setToTopLift] = useState(22)
  const priceSectionRef = useRef<HTMLElement>(null)
  const closeTimerRef = useRef<number | null>(null)
  const briefNameRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLElement | null>(null)
  const lastFocusRef = useRef<HTMLElement | null>(null)
  const resumeBriefRef = useRef(false)
  const dialogOpen = Boolean(project || leaflet || briefOpen || policyOpen)
  const modalOpen = Boolean(dialogOpen || menuOpen)

  const rememberFocus = () => {
    lastFocusRef.current = document.activeElement as HTMLElement | null
  }

  const openBrief = () => {
    rememberFocus()
    setConsentError(false)
    setFieldErrors({})
    setSubmitMessage("")
    setSubmitState("idle")
    setPolicyOpen(false)
    resumeBriefRef.current = false
    setBriefOpen(true)
    setMenuOpen(false)
  }

  const openPolicy = (fromBrief = false) => {
    if (!fromBrief) rememberFocus()
    resumeBriefRef.current = fromBrief && briefOpen
    setBriefOpen(false)
    setProject(null)
    setLeaflet(null)
    setPolicyOpen(true)
    setMenuOpen(false)
  }

  const openProject = (item: (typeof projects)[number]) => {
    rememberFocus()
    setProject(item)
    setMenuOpen(false)
  }

  const openLeaflet = (detail: Leaflet) => {
    rememberFocus()
    setLeaflet(detail)
    setMenuOpen(false)
  }

  const closeMenu = () => setMenuOpen(false)

  const closeAll = () => {
    if (menuOpen && !dialogOpen) {
      setMenuOpen(false)
      return
    }
    if (modalClosing) return
    setModalClosing(true)
    closeTimerRef.current = window.setTimeout(() => {
      const reopenBrief = resumeBriefRef.current && policyOpen
      setProject(null)
      setLeaflet(null)
      setPolicyOpen(false)
      setMenuOpen(false)
      setModalClosing(false)
      setConsentError(false)
      if (reopenBrief) {
        resumeBriefRef.current = false
        setBriefOpen(true)
        return
      }
      setBriefOpen(false)
      lastFocusRef.current?.focus?.()
      lastFocusRef.current = null
    }, 280)
  }

  useEffect(() => {
    try {
      setCookiePreference(window.localStorage.getItem("ym-cookie-preference"))
    } catch {
      setCookiePreference(null)
    }
    setCookieReady(true)
  }, [])

  useEffect(() => {
    const hero = document.getElementById("top")
    if (!hero) return
    const observer = new IntersectionObserver(([entry]) => {
      setShowToTop(!entry.isIntersecting)
    })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  const cookieVisible = cookieReady && !cookiePreference

  useEffect(() => {
    if (!cookieVisible) {
      setToTopLift(22)
      return
    }
    const banner = document.querySelector(".cookie-banner")
    if (!banner) return
    const update = () => {
      setToTopLift(Math.round(banner.getBoundingClientRect().height) + 36)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(banner)
    return () => observer.disconnect()
  }, [cookieVisible, cookieDetailsOpen])

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current)
    }
  }, [modalOpen])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      closeAll()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [menuOpen, dialogOpen, modalClosing, policyOpen, briefOpen])

  useEffect(() => {
    if (!dialogOpen || modalClosing) return
    const id = window.requestAnimationFrame(() => {
      if (briefOpen && submitState === "idle") {
        briefNameRef.current?.focus()
        return
      }
      const root = dialogRef.current
      const focusable = root?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      focusable?.focus()
    })
    return () => window.cancelAnimationFrame(id)
  }, [dialogOpen, briefOpen, policyOpen, project, leaflet, modalClosing, submitState])

  useEffect(() => {
    if (!dialogOpen || modalClosing) return
    const onTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return
      const root = dialogRef.current
      if (!root) return
      const nodes = [
        ...root.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ].filter((node) => !node.hasAttribute("disabled") && node.tabIndex !== -1)
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener("keydown", onTab)
    return () => window.removeEventListener("keydown", onTab)
  }, [dialogOpen, modalClosing, briefOpen, policyOpen, project, leaflet, submitState])

  useEffect(() => {
    const section = priceSectionRef.current
    if (!section) return
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let frame = 0
    const setProgress = () => {
      const styles = section.style
      if (reducedMotion.matches) {
        styles.setProperty("--price-scene-opacity", "1")
        styles.setProperty("--envelope-y", "0px")
        styles.setProperty("--flap-angle", "178deg")
        styles.setProperty("--flap-z", "0")
        styles.setProperty("--letter-y", "0%")
        styles.setProperty("--letter-clip-bottom", "0%")
        styles.setProperty("--letter-opacity", "1")
        return
      }
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(
        Math.max(-section.getBoundingClientRect().top / distance, 0),
        1,
      )
      const phase = (start: number, end: number) =>
        Math.min(Math.max((progress - start) / (end - start), 0), 1)
      const appear = phase(0.02, 0.14)
      const flap = phase(0.15, 0.34)
      const reveal = phase(0.36, 0.43)
      const letter = phase(0.47, 0.88)
      styles.setProperty("--price-scene-opacity", `${0.12 + appear * 0.88}`)
      styles.setProperty("--envelope-y", `${38 - appear * 38}px`)
      styles.setProperty("--flap-angle", `${flap * 178}deg`)
      styles.setProperty("--flap-z", flap < 0.55 ? "6" : "0")
      styles.setProperty("--letter-y", `${(1 - letter) * 90}%`)
      styles.setProperty("--letter-clip-bottom", `${85 - letter * 85}%`)
      styles.setProperty("--letter-opacity", `${reveal}`)
    }
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(setProgress)
    }
    setProgress()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    reducedMotion.addEventListener("change", update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      reducedMotion.removeEventListener("change", update)
    }
  }, [])

  const submitBrief = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get("name") ?? "").trim()
    const contact = String(data.get("contact") ?? "").trim()
    const format = String(data.get("format") ?? "").trim()
    const task = String(data.get("task") ?? "").trim()
    const nextErrors: { name?: string; contact?: string; task?: string } = {}
    if (!name) nextErrors.name = "Укажите, как к вам обращаться."
    if (!contact) nextErrors.contact = "Добавьте удобный контакт для связи."
    if (!task) nextErrors.task = "Кратко опишите задачу или идею."
    const consentMissing = data.get("consent") !== "on"
    setFieldErrors(nextErrors)
    setConsentError(consentMissing)
    setSubmitMessage("")
    setSubmitState("idle")
    if (Object.keys(nextErrors).length > 0 || consentMissing) {
      const focusId = nextErrors.name
        ? "brief-name"
        : nextErrors.contact
          ? "brief-contact"
          : nextErrors.task
            ? "brief-task"
            : "brief-consent"
      form.querySelector<HTMLElement>(`#${focusId}`)?.focus()
      return
    }

    if (!WEB3FORMS_ACCESS_KEY) {
      setSubmitState("error")
      setSubmitMessage(
        `Форма ещё не подключена к почте. Напишите напрямую на ${CONTACT_EMAIL} или в Telegram — отвечу лично.`,
      )
      return
    }

    setSubmitState("sending")
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), FORM_TIMEOUT_MS)
    const contactLooksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          // Plain subject lands in Gmail Primary more reliably than long dashy titles.
          subject: `Новая заявка: ${name}`,
          from_name: "Yana Moskvina",
          name,
          // Web3Forms uses `email` as Reply-To. Only send it when the visitor
          // actually left an address — never point Reply-To at the inbox itself.
          ...(contactLooksLikeEmail ? { email: contact } : {}),
          contact,
          format: format || "Не выбрано",
          message: [
            "Новая заявка с сайта yana-moskvina.",
            "",
            `Имя: ${name}`,
            `Контакт: ${contact}`,
            `Формат: ${format || "Не выбрано"}`,
            "",
            "Задача:",
            task,
          ].join("\n"),
        }),
      })
      const payload = (await response.json().catch(() => null)) as {
        success?: boolean
        message?: string
      } | null

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || `Form API responded with ${response.status}`)
      }

      setSubmitState("success")
      setSubmitMessage(
        "Спасибо, что поделились своей идеей! Я свяжусь с вами в ближайшее время, чтобы обсудить детали проекта. Если хотите пообщаться быстрее — буду рада видеть вас в Telegram.",
      )
      form.reset()
    } catch {
      setSubmitState("error")
      setSubmitMessage(
        "Не удалось отправить заявку. Напишите напрямую на почту или в Telegram — отвечу лично.",
      )
    } finally {
      window.clearTimeout(timeoutId)
    }
  }

  const saveCookiePreference = (preference: "all" | "necessary") => {
    try {
      window.localStorage.setItem("ym-cookie-preference", preference)
    } catch {
      // The in-memory choice still dismisses the banner for this visit.
    }
    setCookiePreference(preference)
    setCookieDetailsOpen(false)
  }

  const visibleProjects =
    filter === "Все"
      ? projects
      : projects.filter((item) => item.category === filter)

  return (
    <main>
      <header className="site-header">
        <a href="#top" className="logo" aria-label="Яна Москвина — на главную">
          <span className="logo-mark">
            YM<span>©</span>
          </span>
          <span className="logo-sign">Яна Москвина / Веб-дизайнер</span>
        </a>
        <nav
          id="site-nav"
          className={menuOpen ? "nav open" : "nav"}
          aria-label="Основная навигация"
        >
          <a href="#services" onClick={closeMenu}>
            Услуги
          </a>
          <a href="#portfolio" onClick={closeMenu}>
            Проекты
          </a>
          <a href="#about" onClick={closeMenu}>
            Обо мне
          </a>
          <a href="#faq" onClick={closeMenu}>
            FAQ
          </a>
          <button type="button" onClick={openBrief}>
            Обсудить проект <Arrow />
          </button>
        </nav>
        <button
          className="menu-button"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
        >
          <span />
          <span />
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <h1>
            Цифровые
            <br />
            пространства
            <br />
            <i>с характером</i>
          </h1>
          <p>
            Делаю сайты, в которых внешний вид не спорит с задачей: структура
            понятна, а путь к заявке короткий.
          </p>
          <span className="hero-formats">
            Цифровые визитки · Лендинги · Многостраничные сайты
          </span>
          <button
            className="primary-button"
            type="button"
            onClick={openBrief}
          >
            Обсудить проект <Arrow />
          </button>
        </div>
        <figure className="hero-portrait">
          <div className="hero-portrait-frame">
            <img src={yanaFlowers} alt="Яна Москвина с букетом цветов" />
          </div>
        </figure>
        <div className="hero-manifesto">ЭСТЕТИКА / СТРУКТУРА / СМЫСЛ</div>
      </section>

      <div
        className="marquee"
        aria-label="Веб-дизайн, цифровые страницы, визуальные концепции, продуманная структура, сайты с характером, дизайн для брендов, эстетика и смысл"
      >
        <div>
          {Array.from({ length: 2 }, (_, copy) => (
            <span className="marquee-track" key={copy} aria-hidden={copy > 0}>
              {[
                "Веб-дизайн",
                "Цифровые страницы",
                "Визуальные концепции",
                "Продуманная структура",
                "Сайты с характером",
                "Дизайн для брендов",
                "Эстетика и смысл",
                "Веб-дизайн",
                "Цифровые страницы",
                "Визуальные концепции",
                "Продуманная структура",
                "Сайты с характером",
                "Дизайн для брендов",
                "Эстетика и смысл",
              ].map((phrase, index) => (
                <span key={`${copy}-${index}`}>
                  {phrase}
                  <i />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <section className="about section-pad" id="about">
        <div className="about-title">
          <span className="eyebrow">За кадром / Обо мне</span>
          <h2>
            <span className="about-title-line">За дизайном</span>
            <br />
            <span className="about-title-line">
              стоит <i>человек</i>
            </span>
          </h2>
        </div>
        <figure className="about-main-photo">
          <img
            src={yanaEditorial}
            alt="Яна Москвина у зеркала"
            loading="lazy"
          />
          <figcaption>
            Яна Москвина
            <br />
            Веб-дизайнер
          </figcaption>
        </figure>
        <blockquote className="about-quote">
          «Красота привлекает внимание.
          <br />
          Структура превращает его в интерес».
        </blockquote>
        <div className="about-copy">
          <span className="dropcap">Я</span>
          <p>
            {" "}
            — Москвина Яна, веб-дизайнер. Собираю страницы для услуг, запусков
            и брендов. Сначала разбираюсь в задаче и аудитории, затем в
            структуре — и только потом в визуале.
          </p>
          <p>
            Образование в сфере маркетинга и рекламы помогает мне точнее видеть
            позиционирование бренда и сильные стороны продукта. AI-инструменты я
            использую для поиска идей, визуальных экспериментов и ускорения
            отдельных процессов, но концепция, структура, композиция и финальные
            решения всегда остаются за мной.
          </p>
        </div>
        <div className="about-aside">
          <figure className="about-detail-photo">
            <img src={yanaBw} alt="Туфли на геометрическом полу" loading="lazy" />
          </figure>
          <div className="about-note">
            ЭСТЕТИКА
            <br />
            СТРУКТУРА
            <br />
            СМЫСЛ
          </div>
        </div>
      </section>

      <section className="services section-pad" id="services">
        <div className="section-heading">
          <span className="eyebrow">Услуги / 01—03</span>
          <h2>
            Что могу
            <br />
            <i>создать?</i>
          </h2>
          <p>
            Три формата под разные задачи: визитка, лендинг и сайт из
            нескольких разделов.
          </p>
        </div>
        <div className="service-list">
          {services.map((service) => (
            <article className="service-card" key={service.n}>
              <span className="service-number">{service.n}</span>
              <div className="service-copy">
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <p className="service-fit">
                  <b>Подойдёт, если…</b> {service.fit}
                </p>
                <button
                  className="text-link"
                  onClick={() => openLeaflet(service.detail)}
                >
                  Подробнее <Arrow />
                </button>
              </div>
              <div
                className={`service-preview ${service.visual}`}
                aria-hidden="true"
              >
                <div className="mini-nav">
                  <span />
                  <span />
                </div>
                <strong>
                  {service.visual === "visiting" ? "Визитка" : service.title}
                </strong>
                <i />
              </div>
            </article>
          ))}
        </div>
        <div className="service-footer">
          <a href="#price">
            Посмотреть стоимость работ <Arrow />
          </a>
          <button onClick={openBrief}>
            Не знаете, какой формат подойдёт? Давайте обсудим задачу.
          </button>
        </div>
      </section>

      <section
        className="price-section"
        id="price"
        ref={priceSectionRef}
        aria-labelledby="price-title"
      >
        <div className="price-sticky">
          <div className="price-heading">
            <span className="eyebrow">Стоимость / 01—03</span>
            <h2 id="price-title">
              Стоимость
              <br />
              <i>работы</i>
            </h2>
            <p>Прокрутите, чтобы открыть письмо</p>
          </div>
          <div className="envelope-scene">
            <div className="envelope" aria-label="Письмо с прайс-листом">
              <div className="envelope-back" />
              <div className="price-letter">
                <div className="letter-mark">YM</div>
                <div className="letter-heading">
                  <span>Веб-дизайн / 2026</span>
                  <h3>Прайс-лист</h3>
                  <p>Индивидуальная работа над вашим проектом</p>
                </div>
                <div className="letter-services">
                  {priceOffers.map((offer, index) => (
                    <article
                      className={index === 1 ? "featured" : ""}
                      key={offer.title}
                    >
                      <span className="letter-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h4>{offer.title}</h4>
                        <span className="letter-price">{offer.price}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => openLeaflet(offer.detail)}
                      >
                        Подробнее
                      </button>
                    </article>
                  ))}
                </div>
                <button
                  className="letter-cta"
                  onClick={openBrief}
                >
                  Обсудить проект <Arrow />
                </button>
              </div>
              <div className="envelope-flap" />
              <div className="envelope-front">
                <div className="envelope-fold left" />
                <div className="envelope-fold right" />
                <div className="envelope-fold bottom" />
              </div>
              <div className="wax-seal" aria-hidden="true">
                <span>YM</span>
              </div>
            </div>
          </div>
          <div className="price-progress" aria-hidden="true">
            <span>Листайте</span>
            <i />
          </div>
        </div>
      </section>

      <section className="portfolio section-pad" id="portfolio">
        <div className="portfolio-head">
          <div>
            <span className="eyebrow">Избранные работы / 2026</span>
            <h2>
              Мои работы
              <br />
              <i>и концепты</i>
            </h2>
          </div>
          <p>
            Запущенные сайты и концепты: кемпинг, глэмпинг, маркетплейс и
            портфолио разработчика.
          </p>
        </div>
        <div className="filters" role="group" aria-label="Фильтр проектов">
          {["Все", ...new Set(projects.map((item) => item.category))].map((category) => (
            <button
              className={filter === category ? "active" : ""}
              onClick={() => setFilter(category)}
              key={category}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="project-grid">
          {visibleProjects.map((item, index) => (
            <article className="project-card" key={item.title}>
              <button
                type="button"
                className="project-card-media"
                onClick={() => openProject(item)}
                aria-label={`Смотреть проект ${item.title}`}
              >
                <ProjectVisual project={item} />
              </button>
              <div className="project-meta">
                <div>
                  <span>
                    {item.label ?? `${item.category} / 0${index + 1}`}
                  </span>
                  <h3>{item.title}</h3>
                  <p>
                    {item.live
                      ? `${item.niche} · Живой проект`
                      : `${item.niche} · Авторский концепт`}
                  </p>
                </div>
                <button type="button" onClick={() => openProject(item)}>
                  Смотреть проект <Arrow />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="process section-pad">
        <div className="process-intro">
          <span className="eyebrow">Процесс / 01—05</span>
          <h2>
            От идеи до
            <br />
            готового <i>сайта</i>
          </h2>
          <img src={yanaPortrait} alt="Яна Москвина" loading="lazy" />
        </div>
        <div className="steps">
          {steps.map(([n, title, text]) => (
            <article key={n}>
              <span>{n}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="faq section-pad" id="faq">
        <div className="faq-heading">
          <span className="eyebrow">FAQ</span>
          <h2>
            Вопрос —<br />
            <i>ответ</i>
          </h2>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <article className={openFaq === index ? "open" : ""} key={question}>
              <button
                type="button"
                id={`faq-trigger-${index}`}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                aria-expanded={openFaq === index}
                aria-controls={`faq-panel-${index}`}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{question}</strong>
                <i />
              </button>
              <div
                id={`faq-panel-${index}`}
                role="region"
                aria-labelledby={`faq-trigger-${index}`}
              >
                <p>{answer}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="final-cta" id="contact">
        <div className="final-cta-main">
          <span className="eyebrow">Есть идея для проекта?</span>
          <h2>
            <span className="cta-line">Ваш следующий</span>
            <span className="cta-line">проект начинается</span>
            <i>здесь</i>
          </h2>
          <div className="final-cta-group">
            <p>
              Расскажите, что хочется создать. Начнём с живого разговора — без
              сложных анкет и готовых решений.
            </p>
            <button className="light-button" type="button" onClick={openBrief}>
              Обсудить проект <Arrow />
            </button>
            <div className="socials">
              <a
                href="https://www.instagram.com/elfiaannka/"
                target="_blank"
                rel="noreferrer noopener"
              >
                <SocialIcon name="instagram" /> Instagram <Arrow />
              </a>
              <a href="https://t.me/anntelegram" target="_blank" rel="noreferrer noopener">
                <SocialIcon name="telegram" /> Telegram <Arrow />
              </a>
              <a
                href="https://max.ru/u/f9LHodD0cOJc1XjY6e_iWtirE3b_NsmNwEy8XSkJaU2FLf0Z5PYJNrfUfvY"
                target="_blank"
                rel="noreferrer noopener"
              >
                <SocialIcon name="max" /> MAX <Arrow />
              </a>
              <a href="mailto:yana.moskwina.99@gmail.com">
                <SocialIcon name="mail" /> Почта <Arrow />
              </a>
              <a href="tel:+79222952912" aria-label="Позвонить +7 (922) 295-29-12">
                <SocialIcon name="phone" /> Телефон <Arrow />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-line">
          <span>ЯНА МОСКВИНА · ВЕБ-ДИЗАЙНЕР · {new Date().getFullYear()}</span>
          <button
            className="footer-action"
            type="button"
            onClick={() => openPolicy(false)}
          >
            Политика конфиденциальности
          </button>
          <button
            className="footer-action"
            type="button"
            onClick={() => {
              setCookiePreference(null)
              setCookieDetailsOpen(true)
            }}
          >
            Настройки файлов cookie
          </button>
          <a href="#top">
            Наверх <Arrow />
          </a>
        </div>
      </section>

      {(project || leaflet || briefOpen || policyOpen) && (
        <div
          className={`modal-backdrop${modalClosing ? " closing" : ""}`}
          role="presentation"
          onMouseDown={closeAll}
        >
          {project && (
            <section
              className="project-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-title"
              ref={dialogRef}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={closeAll}
                aria-label="Закрыть"
              >
                <CloseIcon />
              </button>
              <ProjectVisual project={project} decorative={false} />
              <span className="eyebrow">
                {project.category} /{" "}
                {project.live ? "Живой проект" : "Авторский концепт"}
              </span>
              <h2 id="project-title">{project.title}</h2>
              <p>{project.description}</p>
              <dl>
                <div>
                  <dt>Ниша</dt>
                  <dd>{project.niche}</dd>
                </div>
                <div>
                  <dt>Формат</dt>
                  <dd>{project.category}</dd>
                </div>
              </dl>
              {project.features && project.features.length > 0 && (
                <div className="project-features">
                  <h3>Основные особенности</h3>
                  <ul>
                    {project.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              {(project.galleryDesktop?.length ||
                project.galleryMobile?.length ||
                (project.gallery && project.gallery.length > 1)) && (
                <div className="project-gallery">
                  {project.galleryDesktop && project.galleryDesktop.length > 0 && (
                    <div className="project-gallery-section">
                      <h3>Десктопная версия</h3>
                      <div className="project-gallery-desktop">
                        {project.galleryDesktop.map((shot, index) => {
                          const caption = project.galleryDesktopCaptions?.[index]
                          return (
                            <figure key={`${project.title}-desktop-${index}`}>
                              <img
                                src={shot}
                                alt={caption || ""}
                                loading="lazy"
                              />
                              {caption ? <figcaption>{caption}</figcaption> : null}
                            </figure>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  {project.galleryMobile && project.galleryMobile.length > 0 && (
                    <div className="project-gallery-section">
                      <h3>Мобильная версия</h3>
                      <div
                        className={`project-gallery-mobile${
                          project.galleryMobile.length >= 4 ? " cols-4" : ""
                        }`}
                      >
                        {project.galleryMobile.map((shot, index) => (
                          <figure key={`${project.title}-mobile-${index}`}>
                            <img src={shot} alt="" loading="lazy" />
                          </figure>
                        ))}
                      </div>
                    </div>
                  )}
                  {!project.galleryDesktop &&
                    !project.galleryMobile &&
                    project.gallery &&
                    project.gallery.length > 1 && (
                      <div className="project-gallery-section">
                        <h3>Экраны концепции</h3>
                        <div className="project-gallery-desktop">
                          {project.gallery.slice(1).map((shot, index) => (
                            <figure key={`${project.title}-shot-${index}`}>
                              <img src={shot} alt="" loading="lazy" />
                            </figure>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
              {project.live && project.url ? (
                <a
                  className="project-live-link"
                  href={project.url}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Открыть сайт <Arrow />
                </a>
              ) : (
                <p className="modal-note">
                  Представлены только доступные материалы авторской концепции.
                  Это не коммерческий клиентский проект.
                </p>
              )}
            </section>
          )}
          {leaflet && (
            <section
              className="leaflet-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="leaflet-title"
              ref={dialogRef}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button
                className="modal-close paper-close"
                onClick={closeAll}
                aria-label="Закрыть"
              >
                <CloseIcon />
              </button>
              <div className="leaflet-paper">
                <span className="eyebrow">{leaflet.eyebrow}</span>
                <h2 id="leaflet-title">{leaflet.title}</h2>
                <p>{leaflet.intro}</p>
                <ul>
                  {leaflet.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                {leaflet.note && <p className="leaflet-note">{leaflet.note}</p>}
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => {
                    setLeaflet(null)
                    openBrief()
                  }}
                >
                  Обсудить проект <Arrow />
                </button>
              </div>
            </section>
          )}
          {briefOpen && (
            <section
              className="contact-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="brief-title"
              aria-describedby="brief-intro"
              ref={dialogRef}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button
                className="modal-close paper-close"
                onClick={closeAll}
                aria-label="Закрыть"
              >
                <CloseIcon />
              </button>
              <div className="contact-paper-content">
                {submitState === "success" ? (
                  <div className="form-success" role="status">
                    <h2 id="brief-title">
                      Я получила
                      <br />
                      вашу <i>заявку</i>
                    </h2>
                    <p id="brief-intro">{submitMessage}</p>
                    <div className="form-success-actions">
                      <a
                        className="primary-button"
                        href="https://t.me/anntelegram"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Написать в Telegram <Arrow />
                      </a>
                    </div>
                  </div>
                ) : submitState === "error" ? (
                  <div className="form-success" role="status">
                    <h2 id="brief-title">
                      Не удалось <i>отправить</i>
                    </h2>
                    <p id="brief-intro" className="form-status">
                      {submitMessage}
                    </p>
                    <div className="form-success-actions">
                      <a
                        className="primary-button"
                        href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Заявка с сайта")}`}
                      >
                        Написать на почту <Arrow />
                      </a>
                      <a
                        className="primary-button"
                        href="https://t.me/anntelegram"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Написать в Telegram <Arrow />
                      </a>
                      <button
                        type="button"
                        className="text-link"
                        onClick={() => {
                          setSubmitState("idle")
                          setSubmitMessage("")
                        }}
                      >
                        Попробовать снова
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 id="brief-title">
                      Расскажите <i>об идее</i>
                    </h2>
                    <p id="brief-intro">
                      Заполните короткий бриф, чтобы мы могли обсудить ваш проект.
                    </p>
                  <form onSubmit={submitBrief}>
                    <label htmlFor="brief-name">
                      Ваше имя
                      <input
                        id="brief-name"
                        name="name"
                        ref={briefNameRef}
                        required
                        autoComplete="name"
                        placeholder="Как к вам обращаться?"
                        aria-invalid={Boolean(fieldErrors.name)}
                        aria-describedby={
                          fieldErrors.name ? "brief-name-error" : undefined
                        }
                        onChange={() =>
                          setFieldErrors((prev) => ({ ...prev, name: undefined }))
                        }
                      />
                    </label>
                    {fieldErrors.name && (
                      <p className="form-error" id="brief-name-error" role="alert">
                        {fieldErrors.name}
                      </p>
                    )}
                    <label htmlFor="brief-contact">
                      Контакт для связи
                      <input
                        id="brief-contact"
                        name="contact"
                        required
                        autoComplete="tel"
                        placeholder="Telegram, телефон, email или другой способ"
                        aria-invalid={Boolean(fieldErrors.contact)}
                        aria-describedby={
                          fieldErrors.contact ? "brief-contact-error" : undefined
                        }
                        onChange={() =>
                          setFieldErrors((prev) => ({
                            ...prev,
                            contact: undefined,
                          }))
                        }
                      />
                    </label>
                    {fieldErrors.contact && (
                      <p
                        className="form-error"
                        id="brief-contact-error"
                        role="alert"
                      >
                        {fieldErrors.contact}
                      </p>
                    )}
                    <label htmlFor="brief-format">
                      Формат сайта
                      <select id="brief-format" name="format" defaultValue="">
                        <option value="">Не выбрано</option>
                        <option>Цифровая визитка</option>
                        <option>Лендинг</option>
                        <option>Многостраничный сайт</option>
                        <option>Пока не знаю</option>
                      </select>
                    </label>
                    <label htmlFor="brief-task">
                      Описание проекта
                      <textarea
                        id="brief-task"
                        name="task"
                        required
                        placeholder="Кратко расскажите, какой сайт вам нужен и что важно учесть"
                        rows={4}
                        aria-invalid={Boolean(fieldErrors.task)}
                        aria-describedby={
                          fieldErrors.task ? "brief-task-error" : undefined
                        }
                        onChange={() =>
                          setFieldErrors((prev) => ({ ...prev, task: undefined }))
                        }
                      />
                    </label>
                    {fieldErrors.task && (
                      <p className="form-error" id="brief-task-error" role="alert">
                        {fieldErrors.task}
                      </p>
                    )}
                    <label className="consent" htmlFor="brief-consent">
                      <input
                        id="brief-consent"
                        type="checkbox"
                        name="consent"
                        aria-invalid={consentError}
                        aria-describedby={
                          consentError ? "brief-consent-error" : undefined
                        }
                        onChange={() => setConsentError(false)}
                      />
                      <span>
                        Я согласен(на) с{" "}
                        <button
                          type="button"
                          className="policy-link"
                          onClick={() => openPolicy(true)}
                        >
                          политикой конфиденциальности
                        </button>{" "}
                        и даю согласие на обработку персональных данных.
                      </span>
                    </label>
                    {consentError && (
                      <p className="form-error" id="brief-consent-error" role="alert">
                        Для продолжения необходимо дать согласие на обработку
                        персональных данных.
                      </p>
                    )}
                    <button
                      className="primary-button"
                      type="submit"
                      disabled={submitState === "sending"}
                    >
                      {submitState === "sending"
                        ? "Отправляю…"
                        : "Отправить заявку"}{" "}
                      <Arrow />
                    </button>
                  </form>
                  </>
                )}
              </div>
            </section>
          )}
          {policyOpen && (
            <section
              className="policy-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="policy-title"
              ref={dialogRef}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button
                className="modal-close paper-close"
                onClick={closeAll}
                aria-label="Закрыть"
              >
                <CloseIcon />
              </button>
              <div className="policy-copy">
                <span className="eyebrow">Документы / Конфиденциальность</span>
                <h2 id="policy-title">Политика конфиденциальности</h2>
                <p>
                  Оператор персональных данных — Москвина Яна, веб-дизайнер.
                  Контакт для связи по вопросам обработки данных:{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                </p>
                <p>
                  Сайт собирает только сведения, которые вы сами передаёте через
                  форму заявки или мессенджеры: имя, контакт для связи, выбранный
                  формат сайта и описание задачи.
                </p>
                <p>
                  Данные используются исключительно для ответа на обращение и
                  обсуждения возможного сотрудничества. Правовое основание —
                  ваше согласие, которое вы подтверждаете перед отправкой формы.
                </p>
                <p>
                  Заявки доставляются на электронную почту оператора через сервис
                  Web3Forms. Аналитические и рекламные cookie на сайте не
                  подключены. Выбор в баннере cookie сохраняется только локально
                  в вашем браузере.
                </p>
                <p>
                  Данные хранятся столько, сколько нужно для переписки по заявке,
                  и не передаются третьим лицам для рекламы или продажи. Вы можете
                  запросить уточнение, ограничение обработки или удаление данных —
                  напишите на почту, в Telegram или Instagram.
                </p>
                <button className="primary-button" type="button" onClick={closeAll}>
                  Понятно <Arrow />
                </button>
              </div>
            </section>
          )}
        </div>
      )}
      {cookieReady && !cookiePreference && (
        <aside
          className="cookie-banner"
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-title"
          aria-live="polite"
        >
          <span className="cookie-mark" aria-hidden="true">
            YM
          </span>
          <div className="cookie-copy">
            <h2 id="cookie-title">Файлы cookie</h2>
            <p>
              Используем только необходимые cookie, чтобы сайт работал корректно.
              Аналитика и реклама пока не подключены.
            </p>
            {cookieDetailsOpen && (
              <div className="cookie-details" id="cookie-details">
                <div>
                  <strong>Необходимые</strong>
                  <span>Всегда активны: сохраняют только ваш выбор.</span>
                </div>
                <div>
                  <strong>Необязательные</strong>
                  <span>Сейчас не используются и не устанавливаются.</span>
                </div>
              </div>
            )}
            <button
              type="button"
              className="policy-link"
              onClick={() => openPolicy(false)}
            >
              Политика конфиденциальности
            </button>
          </div>
          <div className="cookie-actions">
            <button type="button" onClick={() => saveCookiePreference("all")}>
              Принять
            </button>
            <button
              type="button"
              onClick={() => saveCookiePreference("necessary")}
            >
              Только необходимые
            </button>
            <button
              type="button"
              className="cookie-settings"
              onClick={() => setCookieDetailsOpen(!cookieDetailsOpen)}
              aria-expanded={cookieDetailsOpen}
              aria-controls="cookie-details"
            >
              {cookieDetailsOpen ? "Скрыть" : "Подробнее"}
            </button>
          </div>
        </aside>
      )}
      <button
        type="button"
        className={showToTop && !modalOpen ? "to-top visible" : "to-top"}
        style={{ bottom: toTopLift }}
        aria-label="Наверх"
        aria-hidden={!showToTop || modalOpen}
        tabIndex={showToTop && !modalOpen ? 0 : -1}
        onClick={() => {
          const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
          window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
        }}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
        </svg>
      </button>
    </main>
  )
}

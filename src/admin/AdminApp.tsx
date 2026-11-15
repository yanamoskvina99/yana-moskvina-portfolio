import { Navigate, Route, Routes } from "react-router-dom"
import "./admin.css"
import { AuthProvider } from "./AuthProvider"
import { AdminLayout } from "./AdminLayout"
import { AdminLogin } from "./AdminLogin"
import { OverviewPage } from "./pages/Overview"
import {
  AboutPage,
  ContactsPage,
  HomePage,
  SeoPage,
} from "./pages/SectionEditor"
import {
  FaqAdminPage,
  PortfolioAdminPage,
  PricesAdminPage,
  ServicesAdminPage,
  StepsAdminPage,
} from "./pages/Collections"
import { MediaPage } from "./pages/MediaPage"
import { SettingsPage } from "./pages/SettingsPage"

export function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route element={<AdminLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesAdminPage />} />
          <Route path="portfolio" element={<PortfolioAdminPage />} />
          <Route path="prices" element={<PricesAdminPage />} />
          <Route path="steps" element={<StepsAdminPage />} />
          <Route path="faq" element={<FaqAdminPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="seo" element={<SeoPage />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  )
}

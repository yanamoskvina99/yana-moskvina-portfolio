import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import App from "./App"
import { AdminApp } from "./admin/AdminApp"
import { ContentProvider } from "./content/ContentProvider"
import { SeoHelmet } from "./SeoHelmet"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route
            path="/*"
            element={
              <ContentProvider>
                <SeoHelmet />
                <App />
              </ContentProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)

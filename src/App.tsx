import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Businesses from './pages/Businesses'
import BusinessPage from './pages/BusinessPage'
import PortalPage from './pages/PortalPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="businesses" element={<Businesses />} />
        <Route path="businesses/:slug" element={<BusinessPage />} />
        {/* gated portals: short standalone links, entry form first */}
        <Route path="barber" element={<PortalPage slug="barber" />} />
        <Route path="collabs" element={<PortalPage slug="collabs" />} />
        <Route path="credit" element={<PortalPage slug="credit" />} />
        <Route path="trading" element={<PortalPage slug="trading" />} />
        <Route path="cutlist" element={<PortalPage slug="the-cut-list" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

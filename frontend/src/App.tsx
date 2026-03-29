import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import type { ReactNode } from 'react'

// Public pages
import Home from './pages/Home'
import Histoire from './pages/Histoire'
import Catalogue from './pages/Catalogue'
import PortfolioPage from './pages/PortfolioPage'
import PortfolioDetail from './pages/PortfolioDetail'
import Contact from './pages/Contact'

// Admin pages
import AdminLogin from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import ContactsAdmin from './pages/admin/ContactsAdmin'
import Reservations from './pages/admin/Reservations'
import CatalogueManager from './pages/admin/CatalogueManager'
import PortfolioManager from './pages/admin/PortfolioManager'
import NewsletterAdmin from './pages/admin/NewsletterAdmin'
import LabelsManager from './pages/admin/LabelsManager'

function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="bg-background text-on-background font-body min-h-screen">
        {children}
      </div>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/histoire" element={<PublicLayout><Histoire /></PublicLayout>} />
          <Route path="/catalogue" element={<PublicLayout><Catalogue /></PublicLayout>} />
          <Route path="/portfolio" element={<PublicLayout><PortfolioPage /></PublicLayout>} />
          <Route path="/portfolio/:id" element={<PublicLayout><PortfolioDetail /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/reservation" element={<Navigate to="/contact" replace />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/admin/contacts" element={<PrivateRoute><ContactsAdmin /></PrivateRoute>} />
          <Route path="/admin/reservations" element={<PrivateRoute><Reservations /></PrivateRoute>} />
          <Route path="/admin/catalogue" element={<PrivateRoute><CatalogueManager /></PrivateRoute>} />
          <Route path="/admin/portfolio" element={<PrivateRoute><PortfolioManager /></PrivateRoute>} />
          <Route path="/admin/newsletter" element={<PrivateRoute><NewsletterAdmin /></PrivateRoute>} />
          <Route path="/admin/labels" element={<PrivateRoute><LabelsManager /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

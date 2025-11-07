import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import Login from './pages/Login'
import Register from './pages/Register'
import FeedPage from './pages/FeedPage'
import KanbanPage from './pages/KanbanPage'
import { getCurrentUser } from './utils/auth'
import AuthenticatedLayout from './layouts/AuthenticatedLayout'

function PrivateRoute({ children }) {
  const user = getCurrentUser()
  return user ? children : <Navigate to="/login" replace />
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={
          <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Login />
          </Motion.div>
        } />
        <Route path="/register" element={
          <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Register />
          </Motion.div>
        } />
        <Route path="/feed" element={
          <PrivateRoute>
            <AuthenticatedLayout>
              <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <FeedPage />
              </Motion.div>
            </AuthenticatedLayout>
          </PrivateRoute>
        } />
        <Route path="/kanban" element={
          <PrivateRoute>
            <AuthenticatedLayout>
              <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <KanbanPage />
              </Motion.div>
            </AuthenticatedLayout>
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AnimatedRoutes />
  )
}

import "./App.css"
import AppRoutes from "./routes/AppRoutes"
import useAffiliateTracker from "./hooks/useAffiliateTracker"
import { AuthProvider } from "./pages/Library/context/AuthContext"
import { ToastProvider } from "./pages/Library/context/ToastContext"

function App() {
  useAffiliateTracker();
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  )
}

export default App

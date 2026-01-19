import "./App.css"
import AppRoutes from "./routes/AppRoutes"
import useAffiliateTracker from "./hooks/useAffiliateTracker"

function App() {
  useAffiliateTracker();
  return <AppRoutes />
}

export default App

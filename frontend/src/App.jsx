import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import { Home } from "./pages/Home"
import { ScanDashboard } from "./pages/ScanDashboard"
import { ScanDetails } from "./pages/ScanDetails"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground font-sans antialiased">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scan/:id" element={<ScanDashboard />} />
            <Route path="/scan/:id/details" element={<ScanDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

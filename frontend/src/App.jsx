import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import { Landing } from "./pages/Landing"
import { NewScan } from "./pages/NewScan"
import { ScansHistory } from "./pages/ScansHistory"
import { About } from "./pages/About"
import { ScanDashboard } from "./pages/ScanDashboard"
import { ScanDetails } from "./pages/ScanDetails"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground font-sans antialiased">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/new-scan" element={<NewScan />} />
            <Route path="/scans" element={<ScansHistory />} />
            <Route path="/about" element={<About />} />
            <Route path="/scan/:id" element={<ScanDashboard />} />
            <Route path="/scan/:id/details" element={<ScanDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

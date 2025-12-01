import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Shield, Search, ArrowRight } from "lucide-react"
import { startScan } from "../api/scanApi"
import { cn } from "../lib/utils"

const MODULES = [
    { id: "passive_recon", name: "Passive Recon", desc: "WHOIS, DNS, Server Info" },
    { id: "active_recon", name: "Active Recon", desc: "Headers, Tech Fingerprint" },
    { id: "dir_discovery", name: "Dir Discovery", desc: "Hidden Paths & Files" },
    { id: "auth_check", name: "Auth Check", desc: "Login Forms, Security Headers" },
    { id: "param_abuse", name: "Param Abuse", desc: "Suspicious Parameters" },
    { id: "phishing", name: "Phishing Check", desc: "Heuristics, Brand Imitation" },
    { id: "osint", name: "OSINT", desc: "Public Dorks, Mentions" },
]

export function Home() {
    const [url, setUrl] = useState("")
    const [selectedModules, setSelectedModules] = useState(MODULES.map(m => m.id))
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleStartScan = async () => {
        if (!url) return
        setLoading(true)
        try {
            const { id } = await startScan(url, selectedModules)
            navigate(`/scan/${id}`)
        } catch (err) {
            console.error(err)
            alert("Failed to start scan")
        } finally {
            setLoading(false)
        }
    }

    const toggleModule = (id) => {
        setSelectedModules(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        )
    }

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="text-center mb-12 space-y-4">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
                    <Shield className="h-12 w-12 text-primary" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    Senpai AI
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Advanced AI-powered web discovery and security reconnaissance.
                    Enter a target to begin.
                </p>
            </div>

            <div className="bg-card border rounded-xl p-6 shadow-lg mb-12">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                    <button
                        onClick={handleStartScan}
                        disabled={loading || !url}
                        className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                    >
                        {loading ? "Starting..." : "Start Scan"}
                        {!loading && <ArrowRight className="h-5 w-5" />}
                    </button>
                </div>

                <div>
                    <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                        Select Modules
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {MODULES.map(m => (
                            <div
                                key={m.id}
                                onClick={() => toggleModule(m.id)}
                                className={cn(
                                    "p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3",
                                    selectedModules.includes(m.id)
                                        ? "bg-primary/5 border-primary"
                                        : "hover:bg-accent/50 opacity-70"
                                )}
                            >
                                <div className={cn(
                                    "h-4 w-4 rounded border mt-1 flex items-center justify-center transition-colors",
                                    selectedModules.includes(m.id) ? "bg-primary border-primary" : "border-muted-foreground"
                                )}>
                                    {selectedModules.includes(m.id) && <div className="h-2 w-2 bg-white rounded-sm" />}
                                </div>
                                <div>
                                    <div className="font-medium text-sm">{m.name}</div>
                                    <div className="text-xs text-muted-foreground">{m.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

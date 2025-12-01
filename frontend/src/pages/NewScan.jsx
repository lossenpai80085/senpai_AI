import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, ArrowRight, CheckCircle2 } from "lucide-react"
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

export function NewScan() {
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

    const selectAll = () => setSelectedModules(MODULES.map(m => m.id))
    const deselectAll = () => setSelectedModules([])

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    Configure New Scan
                </h1>
                <p className="text-xl text-muted-foreground">
                    Enter a target URL and select the modules you want to run
                </p>
            </div>

            <div className="bg-card border rounded-xl p-8 shadow-lg space-y-8">
                {/* URL Input */}
                <div>
                    <label className="block text-sm font-medium mb-3">Target URL</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-lg"
                        />
                    </div>
                </div>

                {/* Module Selection */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                            Select Modules ({selectedModules.length}/{MODULES.length})
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={selectAll}
                                className="text-sm text-primary hover:underline"
                            >
                                Select All
                            </button>
                            <span className="text-muted-foreground">|</span>
                            <button
                                onClick={deselectAll}
                                className="text-sm text-primary hover:underline"
                            >
                                Deselect All
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {MODULES.map(m => (
                            <div
                                key={m.id}
                                onClick={() => toggleModule(m.id)}
                                className={cn(
                                    "p-4 rounded-lg border cursor-pointer transition-all flex items-start gap-3 hover:shadow-md",
                                    selectedModules.includes(m.id)
                                        ? "bg-primary/5 border-primary ring-2 ring-primary/20"
                                        : "hover:bg-accent/50 opacity-70"
                                )}
                            >
                                <div className={cn(
                                    "h-5 w-5 rounded border mt-0.5 flex items-center justify-center transition-colors flex-shrink-0",
                                    selectedModules.includes(m.id) ? "bg-primary border-primary" : "border-muted-foreground"
                                )}>
                                    {selectedModules.includes(m.id) && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm mb-1">{m.name}</div>
                                    <div className="text-xs text-muted-foreground">{m.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Start Button */}
                <div className="pt-4">
                    <button
                        onClick={handleStartScan}
                        disabled={loading || !url || selectedModules.length === 0}
                        className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all text-lg shadow-lg hover:shadow-xl"
                    >
                        {loading ? (
                            <>
                                <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                Starting Scan...
                            </>
                        ) : (
                            <>
                                Start Scan
                                <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </button>
                    {selectedModules.length === 0 && (
                        <p className="text-sm text-orange-500 mt-2 text-center">
                            Please select at least one module
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

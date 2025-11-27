import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getScanStatus, getScanResult } from "../api/scanApi"
import { ModuleCard } from "../components/ModuleCard"
import { AISummary } from "../components/AISummary"
import { ChatBox } from "../components/ChatBox"
import { Loader2, ArrowLeft, RefreshCw } from "lucide-react"

export function ScanDashboard() {
    const { id } = useParams()
    const [scan, setScan] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchScan = async () => {
        try {
            const data = await getScanResult(id)
            setScan(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchScan()
        const interval = setInterval(() => {
            getScanStatus(id).then(status => {
                if (status.status === "running" || status.status === "pending") {
                    fetchScan()
                }
            })
        }, 3000)
        return () => clearInterval(interval)
    }, [id])

    if (loading) return (
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )

    if (!scan) return <div className="p-8 text-center">Scan not found</div>

    const modules = scan.findings ? [...new Set(scan.findings.map(f => f.module))] : []
    // Also include modules that were run but have no findings (need to track this better in backend, but for now infer)

    // Group findings by module
    const findingsByModule = scan.findings.reduce((acc, f) => {
        acc[f.module] = (acc[f.module] || 0) + 1
        return acc
    }, {})

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
                <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Scan Results</h1>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                        Status: <span className="font-semibold uppercase">{scan.status}</span>
                    </span>
                    {scan.status === "running" && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
            </div>

            {scan.summary && (
                <div className="mb-12">
                    <AISummary summary={scan.summary} />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold">Modules</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* We should ideally show all modules that were requested, but we only have findings here. 
                For MVP, we iterate over unique modules found + maybe a list of all possible modules if we had the scan config.
                Let's just show modules with findings or inferred from backend if we had that info.
                Actually, let's just show the modules we found data for.
            */}
                        {Object.keys(findingsByModule).map(moduleName => (
                            <Link key={moduleName} to={`/scan/${id}/details?module=${moduleName}`}>
                                <ModuleCard
                                    name={moduleName}
                                    status={scan.status === "running" ? "running" : "completed"}
                                    findingsCount={findingsByModule[moduleName]}
                                />
                            </Link>
                        ))}
                        {/* If no findings yet and running */}
                        {scan.status === "running" && Object.keys(findingsByModule).length === 0 && (
                            <div className="col-span-2 text-center py-8 text-muted-foreground">
                                Scanning in progress... findings will appear here.
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <h2 className="text-xl font-semibold mb-6">AI Assistant</h2>
                    <ChatBox scanId={id} />
                </div>
            </div>
        </div>
    )
}

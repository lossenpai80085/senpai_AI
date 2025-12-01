import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Filter, Eye, Trash2, RefreshCw, Clock, CheckCircle, XCircle, Loader } from "lucide-react"
import { cn } from "../lib/utils"
import { getAllScans } from "../api/scanApi"

export function ScansHistory() {
    const [scans, setScans] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("all") // all, completed, running, pending, failed
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        loadScans()
    }, [])

    const loadScans = async () => {
        setLoading(true)
        try {
            const data = await getAllScans(0, 50, filter === "all" ? null : filter)
            setScans(data.scans || [])
        } catch (err) {
            console.error("Failed to load scans:", err)
        } finally {
            setLoading(false)
        }
    }

    const filteredScans = scans.filter(scan => {
        const matchesFilter = filter === "all" || scan.status === filter
        const matchesSearch = scan.target.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesFilter && matchesSearch
    })

    const getStatusIcon = (status) => {
        switch (status) {
            case "completed": return <CheckCircle className="h-5 w-5 text-green-500" />
            case "running": return <Loader className="h-5 w-5 text-blue-500 animate-spin" />
            case "failed": return <XCircle className="h-5 w-5 text-red-500" />
            default: return <Clock className="h-5 w-5 text-yellow-500" />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "completed": return "bg-green-500/10 text-green-500 border-green-500/20"
            case "running": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
            case "failed": return "bg-red-500/10 text-red-500 border-red-500/20"
            default: return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
        }
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Scans History</h1>
                <p className="text-muted-foreground">View and manage all your security scans</p>
            </div>

            {/* Filters and Search */}
            <div className="bg-card border rounded-xl p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by target URL..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>

                    {/* Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-muted-foreground" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-4 py-2.5 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="running">Running</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Scans List */}
            {loading ? (
                <div className="text-center py-16">
                    <Loader className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading scans...</p>
                </div>
            ) : filteredScans.length === 0 ? (
                <div className="text-center py-16 bg-card border rounded-xl">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">No scans found</h3>
                    <p className="text-muted-foreground mb-6">
                        {scans.length === 0
                            ? "Start your first security scan to see results here"
                            : "No scans match your current filters"}
                    </p>
                    <button
                        onClick={() => navigate("/new-scan")}
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all inline-flex items-center gap-2"
                    >
                        Start New Scan
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredScans.map((scan) => (
                        <div
                            key={scan.id}
                            className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group"
                            onClick={() => navigate(`/scan/${scan.id}`)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(scan.status)}
                                    <span className={cn(
                                        "text-xs px-2 py-1 rounded-full border font-medium uppercase tracking-wide",
                                        getStatusColor(scan.status)
                                    )}>
                                        {scan.status}
                                    </span>
                                </div>
                            </div>

                            <h3 className="font-semibold text-lg mb-2 truncate group-hover:text-primary transition-colors">
                                {scan.target}
                            </h3>

                            <div className="text-sm text-muted-foreground space-y-1 mb-4">
                                <p>Modules: {scan.modules?.length || 0}</p>
                                <p>Created: {new Date(scan.created_at).toLocaleDateString()}</p>
                            </div>

                            <div className="flex gap-2 pt-4 border-t">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        navigate(`/scan/${scan.id}`)
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all text-sm font-medium"
                                >
                                    <Eye className="h-4 w-4" />
                                    View
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        // Implement re-scan
                                    }}
                                    className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-all"
                                    title="Re-scan"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        // Implement delete
                                    }}
                                    className="px-3 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-all"
                                    title="Delete"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

import { useEffect, useState } from "react"
import { useParams, useSearchParams, Link } from "react-router-dom"
import { getScanResult } from "../api/scanApi"
import { FindingCard } from "../components/FindingCard"
import { ArrowLeft, Loader2 } from "lucide-react"

export function ScanDetails() {
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const moduleName = searchParams.get("module")
    const [findings, setFindings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFindings = async () => {
            try {
                const data = await getScanResult(id)
                if (data.findings) {
                    const filtered = moduleName
                        ? data.findings.filter(f => f.module === moduleName)
                        : data.findings
                    setFindings(filtered)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchFindings()
    }, [id, moduleName])

    if (loading) return (
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Link to={`/scan/${id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold capitalize">
                    {moduleName ? moduleName.replace(/_/g, " ") : "All Findings"}
                </h1>
                <p className="text-muted-foreground mt-2">
                    {findings.length} findings detected
                </p>
            </div>

            <div className="space-y-4">
                {findings.map(finding => (
                    <FindingCard key={finding.id} finding={finding} />
                ))}
                {findings.length === 0 && (
                    <div className="text-center py-12 border rounded-lg bg-muted/10">
                        No findings to display.
                    </div>
                )}
            </div>
        </div>
    )
}

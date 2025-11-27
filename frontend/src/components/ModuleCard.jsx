import { CheckCircle, AlertTriangle, XCircle, Loader2 } from "lucide-react"
import { cn } from "../lib/utils"

export function ModuleCard({ name, status, findingsCount, onClick }) {
    const getStatusIcon = () => {
        if (status === "running") return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        if (status === "completed") return <CheckCircle className="h-5 w-5 text-green-500" />
        if (status === "failed") return <XCircle className="h-5 w-5 text-red-500" />
        return <div className="h-5 w-5 rounded-full border-2 border-muted" />
    }

    return (
        <div
            onClick={onClick}
            className={cn(
                "p-4 rounded-lg border bg-card text-card-foreground shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary/50",
                "flex items-center justify-between"
            )}
        >
            <div className="flex items-center gap-3">
                {getStatusIcon()}
                <span className="font-medium capitalize">{name.replace(/_/g, " ")}</span>
            </div>

            {findingsCount > 0 && (
                <span className="bg-destructive/10 text-destructive text-xs px-2 py-1 rounded-full font-bold">
                    {findingsCount} Issues
                </span>
            )}
        </div>
    )
}

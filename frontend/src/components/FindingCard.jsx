import { AlertTriangle, Info, AlertOctagon, ShieldAlert } from "lucide-react"
import { cn } from "../lib/utils"
import { useState } from "react"

export function FindingCard({ finding }) {
    const [expanded, setExpanded] = useState(false)

    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case "critical": return "text-red-600 bg-red-100 dark:bg-red-900/20";
            case "high": return "text-orange-600 bg-orange-100 dark:bg-orange-900/20";
            case "medium": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
            case "low": return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
            default: return "text-gray-600 bg-gray-100 dark:bg-gray-800";
        }
    }

    const getIcon = (severity) => {
        switch (severity?.toLowerCase()) {
            case "critical": return <ShieldAlert className="h-5 w-5" />;
            case "high": return <AlertOctagon className="h-5 w-5" />;
            case "medium": return <AlertTriangle className="h-5 w-5" />;
            default: return <Info className="h-5 w-5" />;
        }
    }

    return (
        <div className="border rounded-lg p-4 bg-card hover:bg-accent/5 transition-colors">
            <div className="flex items-start justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex gap-3">
                    <div className={cn("p-2 rounded-full h-fit", getSeverityColor(finding.severity))}>
                        {getIcon(finding.severity)}
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{finding.title}</h3>
                        <p className="text-sm text-muted-foreground">{finding.module}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={cn("px-2 py-1 rounded text-xs font-bold uppercase", getSeverityColor(finding.severity))}>
                        {finding.severity}
                    </span>
                    <span className="text-xs text-muted-foreground">Score: {finding.score}/10</span>
                </div>
            </div>

            {expanded && (
                <div className="mt-4 pl-12 space-y-3 text-sm animate-in fade-in slide-in-from-top-2">
                    <div>
                        <span className="font-semibold block mb-1">Explanation:</span>
                        <p className="text-muted-foreground">{finding.explanation}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span className="font-semibold block mb-1">Impact:</span>
                            <p className="text-muted-foreground">{finding.impact}</p>
                        </div>
                        <div>
                            <span className="font-semibold block mb-1">Fix:</span>
                            <p className="text-muted-foreground">{finding.fix}</p>
                        </div>
                    </div>
                    <div>
                        <span className="font-semibold block mb-1">Raw Evidence:</span>
                        <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                            {finding.raw_evidence}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    )
}

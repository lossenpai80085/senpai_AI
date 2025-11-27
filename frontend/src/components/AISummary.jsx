import { Shield, AlertTriangle, CheckCircle, FileText } from "lucide-react"
import { cn } from "../lib/utils"

export function AISummary({ summary }) {
    if (!summary) return null

    const getRiskColor = (risk) => {
        switch (risk?.toLowerCase()) {
            case "critical": return "text-red-600 border-red-200 bg-red-50 dark:bg-red-900/10";
            case "high": return "text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-900/10";
            case "medium": return "text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10";
            default: return "text-green-600 border-green-200 bg-green-50 dark:bg-green-900/10";
        }
    }

    return (
        <div className="space-y-6">
            <div className={cn("border rounded-lg p-6", getRiskColor(summary.overall_risk))}>
                <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-8 w-8" />
                    <div>
                        <h2 className="text-2xl font-bold">Overall Risk: {summary.overall_risk}</h2>
                        <p className="text-sm opacity-90">AI Assessment</p>
                    </div>
                </div>
                <p className="text-lg leading-relaxed">{summary.summary_text}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6 bg-card">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <AlertTriangle className="h-5 w-5" />
                        <h3 className="font-semibold text-lg">Top Risks</h3>
                    </div>
                    <ul className="space-y-2">
                        {summary.top_risks && summary.top_risks.map((risk, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-destructive flex-shrink-0" />
                                <span>{risk}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="border rounded-lg p-6 bg-card">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <CheckCircle className="h-5 w-5" />
                        <h3 className="font-semibold text-lg">Remediation Plan</h3>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p className="whitespace-pre-wrap">{summary.remediation_plan}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

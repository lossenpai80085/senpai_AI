import { Link } from "react-router-dom"
import { Shield, Search, Lock, AlertTriangle, Globe, Code, Eye, ArrowRight } from "lucide-react"

const FEATURES = [
    {
        icon: Globe,
        name: "Passive Recon",
        desc: "WHOIS, DNS Records, Server Information",
        color: "text-blue-500"
    },
    {
        icon: Code,
        name: "Active Recon",
        desc: "HTTP Headers, Technology Fingerprinting",
        color: "text-green-500"
    },
    {
        icon: Search,
        name: "Dir Discovery",
        desc: "Hidden Paths & Files Detection",
        color: "text-purple-500"
    },
    {
        icon: Lock,
        name: "Auth Check",
        desc: "Login Forms, Security Headers Analysis",
        color: "text-yellow-500"
    },
    {
        icon: AlertTriangle,
        name: "Param Abuse",
        desc: "Suspicious Parameter Detection",
        color: "text-orange-500"
    },
    {
        icon: Eye,
        name: "Phishing Check",
        desc: "Heuristics & Brand Imitation Detection",
        color: "text-red-500"
    },
    {
        icon: Globe,
        name: "OSINT",
        desc: "Public Dorks & Online Mentions",
        color: "text-cyan-500"
    },
]

export function Landing() {
    return (
        <div className="min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-6 animate-pulse">
                        <Shield className="h-16 w-16 text-primary" />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                            Senpai AI
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Advanced AI-powered web discovery and security reconnaissance.
                        Comprehensive vulnerability assessment with intelligent analysis.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        <Link
                            to="/new-scan"
                            className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl"
                        >
                            Start New Scan
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            to="/scans"
                            className="bg-muted text-foreground px-8 py-4 rounded-lg font-semibold hover:bg-muted/80 transition-all flex items-center justify-center gap-2 text-lg border"
                        >
                            View Scans History
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Security Modules</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Comprehensive security scanning with 7 specialized reconnaissance modules
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {FEATURES.map((feature) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={feature.name}
                                className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer group"
                            >
                                <div className={`${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon className="h-10 w-10" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{feature.name}</h3>
                                <p className="text-sm text-muted-foreground">{feature.desc}</p>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* CTA Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-600/10 rounded-2xl p-12 text-center border">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Scan?</h2>
                    <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                        Get comprehensive security insights powered by AI in minutes
                    </p>
                    <Link
                        to="/new-scan"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-all text-lg shadow-lg"
                    >
                        Launch Scanner
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

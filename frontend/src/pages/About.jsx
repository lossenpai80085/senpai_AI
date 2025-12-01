import { Shield, Code, Search, Lock, AlertTriangle, Eye, Globe, BookOpen, Target, Zap } from "lucide-react"

const MODULES_INFO = [
    {
        icon: Globe,
        name: "Passive Reconnaissance",
        description: "Gather information without directly interacting with the target",
        features: [
            "WHOIS lookup for domain registration details",
            "DNS record enumeration (A, MX, TXT, NS records)",
            "Server information detection",
            "IP geolocation and ASN information"
        ],
        color: "text-blue-500"
    },
    {
        icon: Code,
        name: "Active Reconnaissance",
        description: "Direct interaction with the target to gather technical details",
        features: [
            "HTTP header analysis",
            "Technology stack fingerprinting",
            "Server software detection",
            "Framework and CMS identification"
        ],
        color: "text-green-500"
    },
    {
        icon: Search,
        name: "Directory Discovery",
        description: "Find hidden files and directories on the target",
        features: [
            "Smart wordlist-based brute forcing",
            "Common path detection",
            "Backup file discovery",
            "Admin panel detection"
        ],
        color: "text-purple-500"
    },
    {
        icon: Lock,
        name: "Authentication Check",
        description: "Analyze authentication mechanisms and security headers",
        features: [
            "Login form detection",
            "Security header analysis (HSTS, CSP, X-Frame-Options)",
            "Cookie security assessment",
            "Authentication method identification"
        ],
        color: "text-yellow-500"
    },
    {
        icon: AlertTriangle,
        name: "Parameter Abuse",
        description: "Detect potentially vulnerable URL parameters",
        features: [
            "Suspicious parameter identification",
            "Common injection points",
            "Parameter tampering opportunities",
            "Input validation weaknesses"
        ],
        color: "text-orange-500"
    },
    {
        icon: Eye,
        name: "Phishing Detection",
        description: "Identify phishing attempts and brand impersonation",
        features: [
            "Heuristic analysis",
            "Brand imitation detection",
            "Suspicious domain patterns",
            "SSL certificate validation"
        ],
        color: "text-red-500"
    },
    {
        icon: Globe,
        name: "OSINT (Open Source Intelligence)",
        description: "Gather publicly available information",
        features: [
            "Google Dorks generation",
            "Public exposure detection",
            "Social media mentions",
            "Leaked credentials search"
        ],
        color: "text-cyan-500"
    },
]

const FAQ_ITEMS = [
    {
        question: "How long does a typical scan take?",
        answer: "Scan duration varies based on the number of modules selected and target complexity. Most scans complete within 30-90 seconds."
    },
    {
        question: "Is this legal to use?",
        answer: "Only use Senpai AI on websites you own or have explicit permission to test. Unauthorized scanning may be illegal in your jurisdiction."
    },
    {
        question: "How is the data analyzed?",
        answer: "Senpai AI uses Google Gemini to provide intelligent analysis of scan results, risk scoring, and actionable recommendations."
    },
    {
        question: "Can I download reports?",
        answer: "Yes! You can download professional PDF reports for any completed scan from the scan dashboard."
    }
]

export function About() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            {/* Header */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-6">
                    <Shield className="h-12 w-12 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">About Senpai AI</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Your intelligent security reconnaissance assistant powered by advanced AI
                </p>
            </div>

            {/* How It Works */}
            <div className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card border rounded-xl p-6 text-center">
                        <div className="bg-primary/10 text-primary rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                            <Target className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">1. Configure Scan</h3>
                        <p className="text-sm text-muted-foreground">
                            Enter your target URL and select the security modules you want to run
                        </p>
                    </div>
                    <div className="bg-card border rounded-xl p-6 text-center">
                        <div className="bg-primary/10 text-primary rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                            <Zap className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">2. Automated Scanning</h3>
                        <p className="text-sm text-muted-foreground">
                            Our reconnaissance modules analyze your target comprehensively
                        </p>
                    </div>
                    <div className="bg-card border rounded-xl p-6 text-center">
                        <div className="bg-primary/10 text-primary rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">3. AI Analysis</h3>
                        <p className="text-sm text-muted-foreground">
                            Google Gemini provides intelligent insights and actionable recommendations
                        </p>
                    </div>
                </div>
            </div>

            {/* Modules */}
            <div className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-center">Security Modules</h2>
                <div className="space-y-6">
                    {MODULES_INFO.map((module) => {
                        const Icon = module.icon
                        return (
                            <div key={module.name} className="bg-card border rounded-xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className={`${module.color} mt-1`}>
                                        <Icon className="h-8 w-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-xl mb-2">{module.name}</h3>
                                        <p className="text-muted-foreground mb-4">{module.description}</p>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {module.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm">
                                                    <span className="text-primary mt-0.5">✓</span>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Best Practices */}
            <div className="mb-16 bg-primary/5 border border-primary/20 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6">Security Best Practices</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                        <span className="text-primary text-lg">→</span>
                        <p>Always obtain permission before scanning any website</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-primary text-lg">→</span>
                        <p>Use results responsibly to improve security posture</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-primary text-lg">→</span>
                        <p>Don't rely solely on automated tools for security assessments</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-primary text-lg">→</span>
                        <p>Keep your API keys and credentials secure</p>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div>
                <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {FAQ_ITEMS.map((item, idx) => (
                        <div key={idx} className="bg-card border rounded-xl p-6">
                            <h3 className="font-semibold text-lg mb-2">{item.question}</h3>
                            <p className="text-muted-foreground">{item.answer}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-16 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <h3 className="font-bold text-lg mb-2 text-yellow-600 dark:text-yellow-500">⚠️ Legal Disclaimer</h3>
                <p className="text-sm text-muted-foreground">
                    Senpai AI is designed for educational purposes and authorized security testing only.
                    Unauthorized access to computer systems is illegal. Users are solely responsible for
                    ensuring they have proper authorization before scanning any target. The developers
                    assume no liability for misuse of this tool.
                </p>
            </div>
        </div>
    )
}

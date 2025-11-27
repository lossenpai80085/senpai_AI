import { ShieldCheck } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"
import { Link } from "react-router-dom"

export function Navbar() {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-16 items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <span>NIGHUD AI</span>
                </Link>

                <div className="flex items-center gap-4">
                    <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                        New Scan
                    </Link>
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    )
}

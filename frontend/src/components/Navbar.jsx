import { ShieldCheck } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"
import { Link, useLocation } from "react-router-dom"
import { cn } from "../lib/utils"

export function Navbar() {
    const location = useLocation()

    const isActive = (path) => location.pathname === path

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-16 items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:text-primary transition-colors">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <span>Senpai AI</span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link
                        to="/"
                        className={cn(
                            "text-sm font-medium hover:text-primary transition-colors",
                            isActive("/") && "text-primary"
                        )}
                    >
                        Home
                    </Link>
                    <Link
                        to="/new-scan"
                        className={cn(
                            "text-sm font-medium hover:text-primary transition-colors",
                            isActive("/new-scan") && "text-primary"
                        )}
                    >
                        New Scan
                    </Link>
                    <Link
                        to="/scans"
                        className={cn(
                            "text-sm font-medium hover:text-primary transition-colors",
                            isActive("/scans") && "text-primary"
                        )}
                    >
                        History
                    </Link>
                    <Link
                        to="/about"
                        className={cn(
                            "text-sm font-medium hover:text-primary transition-colors",
                            isActive("/about") && "text-primary"
                        )}
                    >
                        About
                    </Link>
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    )
}

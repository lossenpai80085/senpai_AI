import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "../lib/utils"

export function ThemeToggle() {
    const [theme, setTheme] = useState("dark")

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "dark"
        setTheme(savedTheme)
        document.documentElement.classList.toggle("dark", savedTheme === "dark")
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark"
        setTheme(newTheme)
        localStorage.setItem("theme", newTheme)
        document.documentElement.classList.toggle("dark", newTheme === "dark")
    }

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "p-2 rounded-full transition-colors",
                "hover:bg-accent hover:text-accent-foreground"
            )}
            aria-label="Toggle Theme"
        >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
    )
}

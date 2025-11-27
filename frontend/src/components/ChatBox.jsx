import { useState, useRef, useEffect } from "react"
import { Send, Bot, User } from "lucide-react"
import { cn } from "../lib/utils"
import { chatWithScan } from "../api/scanApi"

export function ChatBox({ scanId }) {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hello! I'm NIGHUD AI. Ask me anything about the scan results." }
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || loading) return

        const userMsg = { role: "user", content: input }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setLoading(true)

        try {
            const response = await chatWithScan(scanId, userMsg.content)
            setMessages(prev => [...prev, { role: "assistant", content: response.answer }])
        } catch (error) {
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error." }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-[500px] border rounded-lg bg-card overflow-hidden">
            <div className="bg-muted/50 p-4 border-b flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <span className="font-semibold">AI Security Assistant</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <div key={i} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "")}>
                        <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                            msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}>
                            {msg.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                        </div>
                        <div className={cn(
                            "p-3 rounded-lg max-w-[80%] text-sm",
                            msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div className="bg-muted p-3 rounded-lg text-sm animate-pulse">
                            Thinking...
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t bg-muted/20">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Ask about vulnerabilities..."
                        className="flex-1 bg-background border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

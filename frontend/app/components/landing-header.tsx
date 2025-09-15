import { BookOpen } from "lucide-react"
import { Link } from "react-router"
import { Button } from "./ui/button"
import { ModeToggle } from "./mode-toggle"

export function Header() {
    return (
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-serif font-bold text-foreground">TalkBookAI</span>
                </div>
                <nav className="flex items-center gap-6">
                    <Link to="#features" className="hidden md:block text-muted-foreground hover:text-foreground transition-colors">
                        Features
                    </Link>
                    <Link to="/login" className="hidden md:block text-muted-foreground hover:text-foreground transition-colors">
                        Login
                    </Link>
                    <ModeToggle />
                    <Button className="hidden md:block" asChild>
                        <Link to="/signup">Get Started</Link>
                    </Button>
                </nav>
            </div>
        </header>
    )
}
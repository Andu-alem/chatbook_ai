import { BookOpen } from "lucide-react"
import { Link } from "react-router"

export function FooterSection() {
    return (
        <footer className="py-12 px-4 border-t border-border">
            <div className="container mx-auto max-w-6xl">
                <div className="grid md:grid-cols-3 gap-10">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen className="h-6 w-6 text-primary" />
                            <span className="text-xl font-serif font-bold">TalkBookAI</span>
                        </div>
                        <p className="text-muted-foreground mb-4">
                            Chat with your favorite books through AI-powered conversations.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>
                            <Link to="#features" className="hover:text-foreground transition-colors">
                                Features
                            </Link>
                            </li>
                            <li>
                            <Link to="/about" className="hover:text-foreground transition-colors">
                                About
                            </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
                    <p>&copy; { new Date().getFullYear() } TalkBookAI. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
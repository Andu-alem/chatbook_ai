import { Link } from "react-router"
import { Button } from "./ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
    return (
        <section className="py-20 px-4">
            <div className="container mx-auto text-center max-w-4xl">
                <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
                    Talk with your books like never before
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                    Ask questions, get summaries, and explore your favorite books with AI-powered conversations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <Button size="lg" className="text-lg px-8 py-6" asChild>
                        <Link to="/signup">
                            Get Started Free
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent" asChild>
                        <Link to="/login">Sign In</Link>
                    </Button>
                </div>

                {/* Hero Image Placeholder */}
                <div className="relative max-w-4xl mx-auto">
                    <img
                        src="/talkbook-image.png"
                        alt="TalkBookAI Interface Preview"
                        className="rounded-lg shadow-2xl border border-border"
                    />
                </div>
            </div>
        </section>
    )
}
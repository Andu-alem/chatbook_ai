import { ArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import { Link } from "react-router"

export function CTASection() {
    return (
        <section className="py-20 px-4 bg-primary text-primary-foreground">
            <div className="container mx-auto max-w-4xl text-center">
                <h2 className="text-4xl font-serif font-bold mb-6">Ready to Try TalkBookAI?</h2>
                <p className="text-xl mb-8 opacity-90">
                    Be among the first readers to experience AI-powered book conversations.
                </p>
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                    <Link to="/signup">
                        Start Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </div>
        </section>
    )
}
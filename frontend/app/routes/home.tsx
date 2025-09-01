import type { Route } from "./+types/home"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { BookOpen, MessageSquare, Brain, Library, ArrowRight, Zap } from "lucide-react"
import { Link } from "react-router"
import { ModeToggle } from "~/components/mode-toggle"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TalkBookAI - Home" },
    {
      name: "description",
      content:
        "TalkBookAI lets you chat with your books. Ask questions, get summaries, and explore your library with AI-powered conversations.",
    },
  ]
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-serif font-bold text-foreground">TalkBookAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
            <ModeToggle />
            <Button asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
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
              src="/modern-chat-interface-with-books-and-ai-assistant.png"
              alt="TalkBookAI Interface Preview"
              className="rounded-lg shadow-2xl border border-border"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Features for Book Lovers</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover how TalkBookAI helps you connect with your books in new ways.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-serif font-semibold mb-3">AI-Powered Q&A</h3>
                <p className="text-muted-foreground">
                  Ask any question about your books and get intelligent, contextual answers instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-serif font-semibold mb-3">Smart Summaries</h3>
                <p className="text-muted-foreground">
                  Generate comprehensive summaries and key insights from any book in seconds.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-serif font-semibold mb-3">Chat Memory</h3>
                <p className="text-muted-foreground">
                  Your AI assistant remembers previous conversations for deeper, contextual discussions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Library className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-serif font-semibold mb-3">Book Library</h3>
                <p className="text-muted-foreground">
                  Organize and manage your entire book collection in one intelligent platform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
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
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link to="/privacy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 TalkBookAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

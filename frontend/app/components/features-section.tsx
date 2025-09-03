import { Brain, Library, MessageSquare, Zap } from "lucide-react"
import { Card, CardContent } from "./ui/card"

export function FeaturesSection() {
    return (
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
    )
}
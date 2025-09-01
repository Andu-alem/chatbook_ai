import type { Route } from "./+types/detail"
import { ArrowLeft, BookOpen, MessageSquare } from "lucide-react"
import { Link, redirect, useFetcher } from "react-router"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import type { Book, UserType } from "~/types/types"
import { fetchWithAuth } from "~/utils/auth-client"
import { ModeToggle } from "~/components/mode-toggle"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TalkBookAI - Book Detail" },
    { name: "description", content: "Get detailed information about your favourite book and start chatting with the author to understand the book better." },
  ]
}


export async function clientLoader({
    params
}: Route.ClientLoaderArgs) {
    try {
        // Fetch books
        const booksData = await fetchWithAuth(`/books/${params["book-id"]}`, { method: "GET" })
    
        // Fetch user
        const userData = await fetchWithAuth("/auth/user", { method: "GET" })
    
        return {
            book: booksData as Book,
            user: userData as UserType,
        }
    } catch (error) {
        console.error("Error fetching book data:", error)
        localStorage.removeItem("access_token")
        return redirect("/login")
    }
}

export default function BookDetailPage({
    loaderData
}: Route.ComponentProps) {
    const fetcher = useFetcher()
    return (
        <div className="space-y-5 relative min-h-[100vh] pb-10 bg-background">
            {/* Header */}
            <div className="flex items-center justify-between top-0 sticky backdrop-blur-2xl p-3 md:px-7">
                <Link to="/" className="flex items-center justify-center gap-2">
                    <BookOpen className="size-7 sm:size-8 text-primary" />
                    <span className="text-xl sm:text-2xl font-serif font-bold text-foreground">TalkBookAI</span>
                </Link>
                <div className="flex items-center gap-4">
                    <ModeToggle />
                    <span className="hidden sm:inline text-sm text-muted-foreground">Signed in as { loaderData.user.name }</span>
                    <fetcher.Form method="post" action="/logout">
                        <Button type="submit" variant="outline" size="sm" disabled={fetcher.state !== "idle"}>
                            {fetcher.state === "submitting" ? "Logging out..." : "Sign Out"}
                        </Button>
                    </fetcher.Form>
                </div>
            </div>

            <div className="w-11/12 md:w-10/12 mx-auto">
                <Button 
                    variant="link" 
                    className="cursor-pointer" 
                    onClick={ () => window.history.back() }
                    asChild>
                    <div>
                        <ArrowLeft className="size-5" />
                        Back
                    </div>
                </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-11/12 md:w-10/12 mx-auto mb-10">
                <img
                    src={ loaderData.book.cover_url }
                    alt={ loaderData.book.title }
                    className="w-11/12 mx-auto h-[55vh] sm:h-[70vh] rounded-lg border sm:flex-1"
                />
                <div className="sm:flex-1 space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold">{ loaderData.book.title }</h3>
                        <div className="flex gap-5">
                            <span className="text-foreground/70">By: { loaderData.book.author }</span>
                            <div>
                                {
                                    loaderData.book.genere.split(",").map((genere, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-xs mr-2">
                                            {genere.trim()}
                                        </Badge>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <p className="text-sm">{ loaderData.book.description }</p>
                    <div className="flex items-center justify-end gap-4">
                        <Button size="sm" asChild>
                            <Link to={`/books/${ loaderData.book.id }/chat`}>
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Chat
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
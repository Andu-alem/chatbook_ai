import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import type { Route } from "./+types/index"
import { Link, redirect, useFetcher } from "react-router"
import { Badge } from "~/components/ui/badge"
import { BookOpen, MessageSquare, User } from "lucide-react"
import { Button } from "~/components/ui/button"
import type { Book, UserType } from "~/types/types"
import { fetchWithAuth } from "~/utils/auth-client";

export async function clientLoader() {
  try {
    // Fetch books
    const booksData = await fetchWithAuth("/books", { method: "GET" });

    // Fetch user
    const userData = await fetchWithAuth("/auth/user", { method: "GET" });

    return {
        books: booksData.books as Book[],
        user: userData as UserType,
    };
  } catch (err) {
    console.error("Error fetching books:", err);

    // fallback demo books
    const bookData = {
      id: "some id",
      title: "The Alchemist",
      author: "paulo coelho",
      genere: "Phsycology",
      description:
        "An easy and proven way to build good habits and break bad ones.",
        cover_url: "htp://shldclsda.com",
    };
    const books = [bookData, bookData, bookData, bookData, bookData, bookData];
    return {
        books: books,
        user: { name: "John Doe", email: "john@example.com"}
    }
  }
}


export default function DashboardIndex({
    loaderData
}: Route.ComponentProps) {
    const fetcher = useFetcher()
    const books: Book[]|[] = loaderData.books || []
    const user: UserType = loaderData.user || { name: "John Doe", email: "john@ex.com"}
    return (
        <div className="space-y-5 relative">
            {/* Header */}
            <div className="flex items-center justify-between top-0 sticky backdrop-blur-2xl p-3 md:px-7">
                <div className="flex items-center justify-center gap-2">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-serif font-bold text-foreground">TalkBookAI</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="capitalize">{ user.name }</span>
                    <fetcher.Form method="post" action="/logout">
                        <Button type="submit" variant="outline" size="sm" disabled={fetcher.state !== "idle"}>
                            {fetcher.state === "submitting" ? "Logging out..." : "Sign Out"}
                        </Button>
                    </fetcher.Form>
                </div>
            </div>
            

            <div className="w-11/12 md:w-10/12 mx-auto">
                <p className="text-muted-foreground">Choose your favourite book from our collection and chat with the author about the book's concept, ask questions about specific concepts, understand the book more.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-11/12 md:w-10/12 mx-auto">
                {
                    books.map((book, index: number) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            {
                                                book.genere.split(",").map((genere, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-xs">
                                                        {genere.trim()}
                                                    </Badge>
                                                ))
                                            }
                                        </div>
                                        <CardTitle className="text-lg font-serif line-clamp-2">{book.title}</CardTitle>
                                            <CardDescription className="flex items-center gap-1 mt-1">
                                            <User className="h-3 w-3" />
                                            {book.author}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div>
                                    <img src={book.cover_url} alt={book.title} className="w-full h-52 mb-4 rounded-md bg-muted" />
                                </div>
                                {book.description && <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{book.description}</p>}
                                <div className="flex items-center justify-end gap-4">
                                  <Button variant="outline" size="sm" asChild>
                                        <Link to={`/books/${book.id}`}>View Details</Link>
                                    </Button>
                                    <Button size="sm" asChild>
                                        <Link to={`/books/${book.id}/chat`}>
                                            <MessageSquare className="h-3 w-3 mr-1" />
                                            Chat
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                }
            </div>
        </div>
    )
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import type { Route } from "./+types/index"
import { Link, redirect } from "react-router"
import { Badge } from "~/components/ui/badge"
import { MessageSquare, User } from "lucide-react"
import { Button } from "~/components/ui/button"

export async function clientLoader() {
    const access_token = localStorage.getItem("access_token")
    if (!access_token) {
        console.log("No access token found, redirecting to login")
        throw redirect("/login")
    }
    try {
        const books = await fetch("https://chatbook-ai.onrender.com/books", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // Assuming you have a way to get the token, e.g., from localStorage
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            }
        })
        if (books.status === 401) {
            // Token might be expired, try to refresh
            const refreshResponse = await fetch("https://chatbook-ai.onrender.com/auth/refresh", {
                method: "POST",
                credentials: "include", // Include cookies
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (refreshResponse.status === 200) {
                const data = await refreshResponse.json()
                localStorage.setItem("access_token", data.new_access_token)
                // Retry fetching books with the new token
                const retryBooks = await fetch("https://chatbook-ai.onrender.com/books", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${data.new_access_token}`
                    }
                })
                if (retryBooks.status !== 200) {
                    console.log("Failed to fetch books after token refresh, redirecting to login")
                    throw redirect("/login")
                }
                const booksData = await retryBooks.json()
                console.log("Fetched books data after token refresh:", booksData)
                return booksData
            } else {
                // Handle refresh token failure (e.g., redirect to login)
                console.log("Refresh token failed, redirecting to login")
                return redirect("/login")
            }
        } else if (books.status !== 200) {
            console.log("Failed to fetch books, redirecting to login")
            throw redirect("/login")
        }

        const booksData = await books.json()
        console.log("Fetched books data:", booksData)
        return booksData
    } catch {
        const bookData = {
            id: "some id",
            title: "The Alchemist",
            author: "paulo coelho",
            genere: "Phsycology",
            description: "An easy and proven way to build good habits and break bad ones."
        }
        const books = [bookData, bookData, bookData, bookData, bookData, bookData]
        return { books }
    }
}

export default function DashboardIndex({
    loaderData
}: Route.ComponentProps) {
    return (
        <div className="p-4 space-y-5">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-serif font-bold text-foreground">TalkBookAI Library</h1>
                <p className="text-muted-foreground">Choose your favourite book from our collection and chat with the author about the book's concept, ask questions about specific concepts, understand the book more.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {
                    loaderData.books.map((book, index: number) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="secondary" className="text-xs">
                                                {book.genere}
                                            </Badge>
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
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{book.description}</p>
                                <div className="flex items-center justify-end">
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
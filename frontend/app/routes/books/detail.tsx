import type { Route } from "./+types/detail"
import { ArrowLeft, BookOpen, MessageSquare } from "lucide-react";
import { Link, redirect } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import type { Book } from "~/types/types";

export async function clientLoader({
    params
}: Route.ClientLoaderArgs) {
    const access_token = localStorage.getItem("access_token")
    if (!access_token) {
        console.log("No access token found, redirecting to login")
        throw redirect("/login")
    }
    try {
        const bookResponse = await fetch(`http://127.0.0.1:8000/books/${params["book-id"]}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // Assuming you have a way to get the token, e.g., from localStorage
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            }
        })
        if (bookResponse.status === 401) {
            // Token might be expired, try to refresh
            console.log("Access token expired, attempting to refresh")
            try{
                const refreshResponse = await fetch("http://127.0.0.1:8000/auth/refresh-token", {
                    method: "POST",
                    credentials: "include", // Include cookies
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                console.log("Refresh response status:", refreshResponse.status)
                if (refreshResponse.status === 200) {
                    const data = await refreshResponse.json()
                    localStorage.setItem("access_token", data.access_token)
                    // Retry fetching books with the new token
                    const retryBook = await fetch(`http://127.0.0.1:8000/books/${params["book-id"]}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${data.access_token}`
                        }
                    })
                    if (retryBook.status !== 200) {
                        console.log("Failed to fetch book after token refresh, redirecting to login")
                        localStorage.removeItem("access_token")
                        return redirect("/login")
                    }
                    const bookData = await retryBook.json()
                    console.log("Fetched book data after token refresh:", bookData)
                    return bookData as Book
                } else {
                    // Handle refresh token failure (e.g., redirect to login)
                    console.log("Refresh token failed, redirecting to login")
                    localStorage.removeItem("access_token")
                    return redirect("/login")
                }
            } catch (error) {
                console.error("Error during token refresh:", error)
                localStorage.removeItem("access_token")
                return redirect("/login")
            }
        } else if (bookResponse.status !== 200) {
            console.log("Failed to fetch book, redirecting to login")
            localStorage.removeItem("access_token")
            return redirect("/login")
        }
        const bookData = await bookResponse.json()
        console.log("Fetched book data:", bookData)
        return bookData as Book
    } catch (error) {
        console.error("Error fetching book data:", error)
        localStorage.removeItem("access_token")
        return redirect("/login")
    }
}

export default function BookDetailPage({
    loaderData
}: Route.ComponentProps) {
    
    return (
        <div className="space-y-5 relative">
            {/* Header */}
            <div className="flex items-center justify-between top-0 sticky backdrop-blur-2xl p-3 md:px-7">
                <div className="flex items-center justify-center gap-2">
                    <BookOpen className="size-7 sm:size-8 text-primary" />
                    <span className="text-xl sm:text-2xl font-serif font-bold text-foreground">TalkBookAI</span>
                </div>
                <div className="flex items-center gap-4">
                    <span>John Doe</span>
                    <Button>Sign Out</Button>
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
                    src={ loaderData.cover_url }
                    alt={ loaderData.title }
                    className="w-full h-[55vh] sm:h-[70vh] rounded-lg border sm:flex-1"
                />
                <div className="sm:flex-1 space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold">{ loaderData.title }</h3>
                        <div className="flex gap-5">
                            <span className="text-foreground/70">By: { loaderData.author }</span>
                            <div>
                                {
                                    loaderData.genere.split(",").map((genere, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-xs mr-2">
                                            {genere.trim()}
                                        </Badge>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <p>{ loaderData.description }</p>
                    <div className="flex items-center justify-end gap-4">
                        <Button size="sm" asChild>
                            <Link to={`/books/${ loaderData.id }/chat`}>
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
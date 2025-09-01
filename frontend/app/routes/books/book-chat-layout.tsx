import { Outlet, redirect } from "react-router"
import { AppSidebar } from "~/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar"
import type { Route } from "./+types/book-chat-layout"
import type { Book, UserType } from "~/types/types"
import { fetchWithAuth } from "~/utils/auth-client"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TalkBookAI - Chat with your favourite book" },
    { name: "description", content: "Choose your favourite book from our collection and chat with the author about the book's concept, ask questions about specific concepts, understand the book more." },
  ]
}

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
  } catch (error) {
      console.error("Error fetching books data:", error)
      localStorage.removeItem("access_token")
      return redirect("/login")
  }
}

export default function ChatLayout({
  loaderData
}: Route.ComponentProps) {
  return (
    <SidebarProvider>
      <AppSidebar 
        books={ loaderData.books }
        user={ loaderData.user } />
      <SidebarInset>
        <div className="px-4">
            <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

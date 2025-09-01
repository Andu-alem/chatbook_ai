import { Outlet, redirect } from "react-router"
import { AppSidebar } from "~/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar"
import type { Route } from "./+types/book-chat-layout"
import type { Book, UserType } from "~/types/types"
import { fetchWithAuth } from "~/utils/auth-client"

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
  // const books = [
  //   {
  //     id: "1",
  //     title: "The Alchemist",
  //     author: "paul",
  //     genere: "motivational",
  //     description: "descr",
  //     cover_url: "url"
  //   }
  // ]
  // return {
  //   books: [...books, ...books, ...books],
  //   user: {
  //     name: "Andi doe",
  //     email: "john@gmail.com"
  //   }
  // }
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

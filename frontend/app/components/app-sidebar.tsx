import { BookOpen, MessageSquare, User, Library, LogOut, Loader2 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar"
import { Button } from "~/components/ui/button"
import { Link, useFetcher } from "react-router"
import type { Book, UserType } from "~/types/types"


export function AppSidebar({ 
    books,
    user
}: { 
    books: Book[],
    user: UserType
}) {
    const fetcher = useFetcher()

    return (
        <Sidebar>
            <SidebarHeader className="border-b border-sidebar-border">
                <Link to="/" className="flex items-center gap-2 px-4 py-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <span className="text-lg font-serif font-bold text-sidebar-foreground">TalkBookAI</span>
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link to="/books">
                                        <Library className="size-4" />
                                        <span>Books</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <div className="flex gap-2">
                                        <MessageSquare className="size-4" />
                                        <span>Chat With</span>
                                    </div>
                                </SidebarMenuButton>
                                {books && (
                                    <SidebarMenuSub>
                                    {books.map((book) => (
                                        <SidebarMenuSubItem key={book.title}>
                                        <SidebarMenuSubButton asChild>
                                            <Link to={`/books/${book.id}/chat`}>
                                                <span>{book.title}</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                    </SidebarMenuSub>
                                )}
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center gap-3 px-2 py-2">
                            <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                                <User className="h-4 w-4 text-sidebar-accent-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-sidebar-foreground truncate capitalize">{user.name}</p>
                                <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
                            </div>
                        </div>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <fetcher.Form method="post" action="/logout">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                                disabled={ fetcher.state !== "idle" }
                            >
                                {
                                    fetcher.state === "submitting" ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="size-4 mr-2" />
                                            Logging Out..
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <LogOut className="size-4 mr-2" />
                                            Sign Out
                                        </div>
                                    )
                                }
                            </Button>
                        </fetcher.Form>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

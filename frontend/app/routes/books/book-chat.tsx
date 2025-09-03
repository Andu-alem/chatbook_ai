import { useState, useEffect, useRef } from "react"
import type { Route } from "./+types/book-chat"
import { redirect, useFetcher } from "react-router"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { Bot, Send, User } from "lucide-react"
import { Card, CardContent } from "~/components/ui/card"
import { SidebarTrigger } from "~/components/ui/sidebar"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import { fetchWithAuth } from "~/utils/auth-client"
import type { Book, History } from "~/types/types"
import { ModeToggle } from "~/components/mode-toggle"

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (!params["book-id"]) {
    return redirect("/books")
  }

  try {
    const historyData = await fetchWithAuth(
      `/books/chat-history/${params["book-id"]}`,
      { method: "GET" }
    )
    
    const bookData = await fetchWithAuth(`/books/${params["book-id"]}`, { method: "GET" })

    return {
      history: historyData.history as History[],
      bookData: bookData as Book
    }
  } catch (err) {

    return { 
      history: null,
      bookData: null
    }
  }
}



export async function clientAction({ request, params }: Route.ClientActionArgs) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const formData = await request.formData()
  const message = String(formData.get("message")).trim()
  if (!message) return null

  const access_token = sessionStorage.getItem("access_token")
  // if (!access_token) return redirect("/login")

  try {
    const response = await fetch(
      `${backendUrl}/books/${params["book-id"]}/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`,
        },
        body: JSON.stringify({ query: message }),
      }
    )

    if (response.status === 401) {
      sessionStorage.removeItem("access_token")
      return redirect("/login")
    }

    if (!response.ok) return null

    const data = await response.json()
    return { answer: data.answer }
  } catch {
    return { answer: null }
  }
}

export default function BookChat({
  loaderData,
}: Route.ComponentProps) {
  const fetcher = useFetcher()
  const [messages, setMessages] = useState<History[]>([])
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])
  // When fetcher receives new data, append assistant reply
  useEffect(() => {
    if (fetcher.data?.answer) {
      setMessages((prev) => [...prev, { role: "ai", content: fetcher.data.answer }])
    }
  }, [fetcher.data])

  useEffect(() => {
    if (loaderData?.history) {
      setMessages(loaderData.history)
    }
  }, [loaderData])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.message as HTMLInputElement
    const userMessage = input.value.trim()
    if (!userMessage) return

    // Add user message immediately
    setMessages((prev) => [...prev, { role: "human", content: userMessage }])

    fetcher.submit(form)

    input.value = "" // clear input
  }

  return (
    <div className="h-screen flex flex-col gap-4 p-2 sm:p-4">
      <div className="flex items-center justify-between p-2 pb-0">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 visible md:hidden" />
          <div className="flex flex-col md:flex-row md:items-center gap-2 font-serif">
            <h1 className="text-xl font-bold">TalkBookAI</h1>
            <span className="text-xs font-normal">Chatting with "{ loaderData.bookData?.title || "the book" }" author</span>
          </div>
        </div>
        <ModeToggle />
      </div>

      <ScrollArea className="border rounded-lg h-[61%] md:h-[65%] p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "human" ? "justify-end" : "justify-start"}`}>
              {msg.role === "ai" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[70%] ${msg.role === "ai" ? "items-end" : "items-start"}`}
              >
                <Card
                    className={`${
                      msg.role === "ai"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border-border hover:bg-muted/50"
                    } transition-colors p-0`}
                  >
                    <CardContent className="px-3 py-4">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                    </CardContent>
                  </Card>
              </div>

              {msg.role === "human" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {fetcher.state === "submitting" && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="bg-card border-border">
                <CardContent className="p-3">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">Thinking...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-2 border-t border-border bg-card rounded-lg">
        <div className="max-w-4xl mx-auto">
          <fetcher.Form method="post" onSubmit={handleSubmit} className="flex items-end gap-2">
            <div className="flex-1">
              <Textarea
                // onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 resize-none"
                name="message"
                disabled={fetcher.state === "submitting"}
                maxLength={250}
              />
            </div>
            <Button
              type="submit"
              disabled={fetcher.state === "submitting"}
              size="sm"
              className="h-[44px]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </fetcher.Form>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Consider like you are discussing with the author of "{ loaderData.bookData?.title || "the book" }"</span>
          </div>
        </div>
      </div>
    </div>
  )
}

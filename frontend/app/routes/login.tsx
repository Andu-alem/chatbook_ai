import { Link, redirect, useFetcher, data } from "react-router"
import type { Route } from "./+types/login"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { BookOpen, Mail, Lock } from "lucide-react"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TalkBookAI - Login" },
    { name: "description", content: "Login to your TalkBookAI account to continue your reading journey and chat with your favourite books." },
  ]
}

export async function clientLoader() {
    const token = localStorage.getItem("access_token")

    // if user is already logged in and active redirect them
    if (token && token !== "") throw redirect("/books")
}

export async function clientAction({
    request
}: Route.ClientActionArgs) {
    const appURL = import.meta.env.VITE_BACKEND_URL
    const formData = await request.formData()
    const email = String(formData.get('email')).trim()
    const password = String(formData.get('password'))

    if (password && password.length < 8) {
        return data({
            errors: {
                password: "Password should be atleast 8 characters"
            }
        }, { status: 400 })
    }
    
    try {
        const response = await fetch(`${appURL}/auth/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })

        if (response.status !== 200) {
            if (response.status === 401) {
                return data({
                    errors: {
                        other: "Invalid credentials"
                    }
                }, { status: 500 })
            } else {
                return data({
                    errors: {
                        other: "Error has occured please try again"
                    }
                }, { status: 500 })
            }
        }

        const responseData = await response.json()
        sessionStorage.setItem("access_token", responseData.access_token)

        return redirect("/books")
    } catch {
        return data({
            errors: {
                other: "Error has occured check your internet connection"
            }
        }, { status: 500 })
    }
}

export default function Login() {
    const fetcher = useFetcher()
    const errors = fetcher.data?.errors
    
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-serif font-bold text-foreground">TalkBookAI</span>
                </div>

                <Card className="shadow-lg">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-serif">Welcome back</CardTitle>
                        <CardDescription>Sign in to your account to continue your reading journey</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="mb-2">
                            <p className="text-red-700 text-center">{ errors?.other }</p>
                        </div>
                        <fetcher.Form method="post" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="email" type="email" name="email" placeholder="Enter your email" className="pl-10" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="password" type="password" name="password" placeholder="Enter your password" className="pl-10" required />
                                </div>
                                <p className="text-red-700">{ errors?.password }</p>
                            </div>
                            <Button type="submit" className="w-full" disabled={fetcher.state !== "idle"}>
                                { fetcher.state === "submitting" ? "Signing In .... " : "Sign In" }
                            </Button>
                        </fetcher.Form>

                        <div className="text-center text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-primary hover:underline font-medium">
                                Sign up
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center">
                    <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    )
}

import { Link, redirect, useFetcher } from "react-router"
import type { Route } from "./+types/login"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { BookOpen, Mail, Lock } from "lucide-react"

export function clientLoader() {
    const token = localStorage.getItem("access_token")

    // if user is already logged in and active redirect them
    if (token && token !== "") throw redirect("/books")
}

export async function clientAction({
    request
}: Route.ClientActionArgs) {
    const formData = await request.formData()
    const email = formData.get('email')
    const password = formData.get('password')

    console.log("the inputs are", { email, password });
    const response = await fetch("https://chatbook-ai.onrender.com/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    console.log("the response status is", response.status);
    if (response.status !== 200) {
        if (response.status === 401) {
            console.log("invalid credentials");
            return { error: "Invalid credentials" };
        } else {
            console.log("login failed");
            return { error: "Login failed" };
        }
    }
    const data = await response.json();
    console.log("the response data is", data);
    localStorage.setItem("access_token", data.access_token)
    // check if it is stored correctly
    console.log("stored token is : ", localStorage.getItem("access_token"))
    throw redirect("/books")
}

export default function Login() {
    const fetcher = useFetcher()
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
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
                                    />
                                    <Label htmlFor="remember" className="text-sm text-muted-foreground">
                                        Remember me
                                    </Label>
                                </div>
                                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Button type="submit" className="w-full" disabled={fetcher.state === "submitting"}>
                                Sign In
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

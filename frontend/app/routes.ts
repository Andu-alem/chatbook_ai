import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/login", "routes/login.tsx"),
    route("/signup", "routes/signup.tsx"),
    route("/logout", "routes/logout.ts"),
    ...prefix("books", [
        index("routes/books/index.tsx"),
        route("/:book-id", "routes/books/detail.tsx"),
        layout("routes/books/book-chat-layout.tsx", [
            route("/:book-id/chat", "routes/books/book-chat.tsx")
        ])
    ]),
    // route("*", "routes/404.tsx"),
] satisfies RouteConfig;

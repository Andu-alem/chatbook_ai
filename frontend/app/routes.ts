import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/login", "routes/login.tsx"),
    route("/signup", "routes/signup.tsx"),
    ...prefix("dashboard", [
        index("routes/dashboard/index.tsx"),
    ]),
    // route("*", "routes/404.tsx"),
] satisfies RouteConfig;

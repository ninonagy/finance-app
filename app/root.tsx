import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import tailwindSyles from "./tailwind.css";
export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://unpkg.com/modern-css-reset@1.4.0/dist/reset.min.css",
  },
  { rel: "stylesheet", href: tailwindSyles },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Finance App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <script
          defer
          src="https://unpkg.com/alpinejs@3.10.3/dist/cdn.min.js"
        ></script>
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

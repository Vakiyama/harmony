// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import "./input.css";
import { createContext } from "solid-js";

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <div class="px-2">
            <a href="/" class="hover:text-blue-500">
              Index
            </a>
            <a href="/about" class="hover:text-blue-500">
              About
            </a>
            <a href="/socketExample" class="hover:text-blue-500">
              Socket Chat
            </a>
            <a href="/counter" class="hover:text-blue-500">
              Counter
            </a>
            <a href="/components" class="hover:text-blue-500">
              Components
            </a>
          </div>
          <Suspense>{props.children}</Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

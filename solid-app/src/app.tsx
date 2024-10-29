// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import "./input.css";
import NavBar from "~/components/shared/nav-bar";
import Layout from "./components/Layout";
import { MetaProvider } from "@solidjs/meta";

export default function App() {
  return (
    <Router
      root={(props) => (
        <div class="h-full border">
          <MetaProvider>
            <Layout>
              <Suspense>
                <div class="h-full">
                  {props.children}
                  <NavBar />
                </div>
              </Suspense>
            </Layout>
          </MetaProvider>
        </div>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

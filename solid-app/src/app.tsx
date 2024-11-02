// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import "./input.css";
import NavBar from "~/components/shared/nav-bar";
import Layout from "./components/Layout";
import { MetaProvider } from "@solidjs/meta";
import RootWrapper from "./components/shared/root-wrapper";

export default function App() {
  return (
    <Router
      root={(props) => (
        <RootWrapper>
          <MetaProvider>
            <Layout>
              <Suspense>
                {props.children}
                <NavBar />
              </Suspense>
            </Layout>
          </MetaProvider>
        </RootWrapper>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

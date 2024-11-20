// @refresh reload
import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, useContext } from "solid-js";
import "./app.css";
import "./input.css";
import Layout from "./components/Layout";
import { MetaProvider } from "@solidjs/meta";
import RootWrapper from "./components/shared/root-wrapper";
import { TeamProvider } from "./context/team-context";

export default function App() {
  return (
    <TeamProvider>
      <Router
        root={(props) => (
          <RootWrapper>
            <MetaProvider>
              <Suspense>
                <Layout>{props.children}</Layout>
              </Suspense>
            </MetaProvider>
          </RootWrapper>
        )}
      >
        <FileRoutes />
      </Router>
    </TeamProvider>
  );
}

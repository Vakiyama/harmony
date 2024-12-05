// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import "./input.css";
import Layout from "./components/Layout";
import { MetaProvider } from "@solidjs/meta";
import { TeamProvider } from "./context/team-context";
import SocketNotification from "./components/socketNotifications/socket-notification";

export default function App() {
  return (
    <TeamProvider>
      <Router
        root={(props) => (
          <MetaProvider>
            <Suspense>
              <Layout>
                {props.children}
                <SocketNotification />
              </Layout>
            </Suspense>
          </MetaProvider>
        )}
      >
        <FileRoutes />
      </Router>
    </TeamProvider>
  );
}

import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { fetchOnboardingComplete } from "./lib/supabase";
import Home from "./pages/Home";
import DemoPicker from "./pages/v2/DemoPicker";
import DispatchHome from "./pages/v2/DispatchHome";
import AtelierHome from "./pages/v2/AtelierHome";
import V3Picker from "./pages/v3/V3Picker";
import DispatchV2 from "./pages/v3/DispatchV2";
import AtelierV2 from "./pages/v3/AtelierV2";
import SequenceHome from "./pages/v3/SequenceHome";
import Signup from "./pages/app/Signup";
import Login from "./pages/app/Login";
import Dashboard from "./pages/app/Dashboard";
import Lesson from "./pages/app/Lesson";
import MasteryCheck from "./pages/app/MasteryCheck";
import Onboarding from "./pages/app/Onboarding";

// Blank paper screen shown while auth/onboarding state resolves — avoids a
// flash of redirect on protected routes.
const PAPER_BLANK = <div style={{ backgroundColor: "#F2EFE7", minHeight: "100vh" }} />;

// ─────────────────────────────────────────────────────────────────────────────
// Protected route — redirects to /login if not authenticated
// ─────────────────────────────────────────────────────────────────────────────

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading } = useAuth();

  if (loading) {
    // Blank paper screen while session is resolving — avoids flash of redirect
    return <div style={{ backgroundColor: "#F2EFE7", minHeight: "100vh" }} />;
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Onboarding gate — wraps the main app pages so a first-login user who hasn't
// finished the quiz is sent to /onboarding. Kept separate from ProtectedRoute so
// the auth check and the onboarding check stay independent (the /onboarding
// route is protected but intentionally NOT gated, to avoid a redirect loop).
// ─────────────────────────────────────────────────────────────────────────────

function OnboardingGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "complete" | "incomplete">("loading");

  useEffect(() => {
    let cancelled = false;
    fetchOnboardingComplete().then((done) => {
      if (!cancelled) setStatus(done ? "complete" : "incomplete");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") return PAPER_BLANK;
  if (status === "incomplete") return <Redirect to="/onboarding" />;
  return <>{children}</>;
}

const gated = (Component: React.ComponentType) =>
  function Gated() {
    return (
      <OnboardingGate>
        <Component />
      </OnboardingGate>
    );
  };

// ─────────────────────────────────────────────────────────────────────────────
// Router
// ─────────────────────────────────────────────────────────────────────────────

function Router() {
  return (
    <Switch>
      {/* Landing + design variants */}
      <Route path={"/"} component={SequenceHome} />
      <Route path={"/v1"} component={Home} />
      <Route path={"/v2"} component={DemoPicker} />
      <Route path={"/v2/dispatch"} component={DispatchHome} />
      <Route path={"/v2/atelier"} component={AtelierHome} />
      <Route path={"/v3"} component={V3Picker} />
      <Route path={"/v3/dispatch"} component={DispatchV2} />
      <Route path={"/v3/atelier"} component={AtelierV2} />
      <Route path={"/v3/sequence"} component={SequenceHome} />

      {/* Auth */}
      <Route path={"/signup"} component={Signup} />
      <Route path={"/login"} component={Login} />

      {/* Onboarding — protected but not gated (gating it would loop) */}
      <Route path={"/onboarding"}>
        {() => <ProtectedRoute component={Onboarding} />}
      </Route>

      {/* Protected app routes — gated behind onboarding completion */}
      <Route path={"/app"}>
        {() => <ProtectedRoute component={gated(Dashboard)} />}
      </Route>
      <Route path={"/lesson/:slug"}>
        {() => <ProtectedRoute component={gated(Lesson)} />}
      </Route>
      <Route path={"/check/:slug"}>
        {() => <ProtectedRoute component={gated(MasteryCheck)} />}
      </Route>

      {/* Fallbacks */}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

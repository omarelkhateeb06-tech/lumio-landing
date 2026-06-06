import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { fetchOnboardingComplete } from "./lib/supabase";
import SequenceHome from "./pages/v3/SequenceHome";
import Signup from "./pages/app/Signup";
import Login from "./pages/app/Login";
import Dashboard from "./pages/app/Dashboard";
import Lesson from "./pages/app/Lesson";
import Booster from "./pages/app/Booster";
import MasteryCheck from "./pages/app/MasteryCheck";
import Onboarding from "./pages/app/Onboarding";
import Profile from "./pages/app/Profile";
import CertOverview from "./pages/app/CertOverview";
import CertSubmit from "./pages/app/CertSubmit";
import Verify from "./pages/Verify";

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
    fetchOnboardingComplete()
      .then((done) => {
        if (!cancelled) setStatus(done ? "complete" : "incomplete");
      })
      // A rejected lookup must not strand the user on the blank paper screen
      // forever. Fail open to the onboarding flow rather than hanging (Executor M2).
      .catch(() => {
        if (!cancelled) setStatus("incomplete");
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
      {/* Landing */}
      <Route path={"/"} component={SequenceHome} />

      {/* Retired demo/design-variant routes — redirect to the live landing so
          no half-finished surface is reachable by a paying user. */}
      <Route path={"/v1"}>{() => <Redirect to="/" />}</Route>
      <Route path={"/v2"}>{() => <Redirect to="/" />}</Route>
      <Route path={"/v2/:rest*"}>{() => <Redirect to="/" />}</Route>
      <Route path={"/v3"}>{() => <Redirect to="/" />}</Route>
      <Route path={"/v3/:rest*"}>{() => <Redirect to="/" />}</Route>

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
      <Route path={"/app/profile"}>
        {() => <ProtectedRoute component={gated(Profile)} />}
      </Route>
      <Route path={"/lesson/:slug"}>
        {() => <ProtectedRoute component={gated(Lesson)} />}
      </Route>
      <Route path={"/app/booster/:slug"}>
        {() => <ProtectedRoute component={gated(Booster)} />}
      </Route>
      <Route path={"/check/:slug"}>
        {() => <ProtectedRoute component={gated(MasteryCheck)} />}
      </Route>
      <Route path={"/app/cert/:slug/submit"}>
        {() => <ProtectedRoute component={gated(CertSubmit)} />}
      </Route>
      <Route path={"/app/cert/:slug"}>
        {() => <ProtectedRoute component={gated(CertOverview)} />}
      </Route>

      {/* Public certificate verification — intentionally outside ProtectedRoute */}
      <Route path={"/verify/:token"} component={Verify} />
      {/* A bare /verify (hand-typed or a truncated share link) has no token and
          would otherwise hit the generic 404. Send it home instead (Executor H1). */}
      <Route path={"/verify"}>{() => <Redirect to="/" />}</Route>

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

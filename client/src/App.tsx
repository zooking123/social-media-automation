import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

import SidebarLayout from "@/components/layout/sidebar";
import Dashboard from "@/pages/dashboard";
import Videos from "@/pages/videos";
import Captions from "@/pages/captions";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import ScheduleCalendar from "@/pages/schedule-calendar";
import AICaptionsPage from "@/pages/ai-captions-page";
import LandingPage from "@/pages/landing-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/home" component={HomePage} />
      <ProtectedRoute path="/dashboard" component={() => (
        <SidebarLayout>
          <Dashboard />
        </SidebarLayout>
      )} />
      <ProtectedRoute path="/videos" component={() => (
        <SidebarLayout>
          <Videos />
        </SidebarLayout>
      )} />
      <ProtectedRoute path="/captions" component={() => (
        <SidebarLayout>
          <Captions />
        </SidebarLayout>
      )} />
      <ProtectedRoute path="/settings" component={() => (
        <SidebarLayout>
          <Settings />
        </SidebarLayout>
      )} />
      <ProtectedRoute path="/schedule" component={() => (
        <SidebarLayout>
          <ScheduleCalendar />
        </SidebarLayout>
      )} />
      <ProtectedRoute path="/ai-captions" component={() => (
        <SidebarLayout>
          <AICaptionsPage />
        </SidebarLayout>
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Implementations from "@/pages/Implementations";

/**
 * Client-side route table. Maps the registry routes (`/`, `/implementations`,
 * `/results`) to their pages and falls back to the not-found page.
 */
function Router() {
  return (
    <Switch>
      <Route path="/" component={Implementations} />
      <Route path="/implementations" component={Implementations} />
      <Route path="/results" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Application root. Provides the React Query client and tooltip context, mounts
 * the global toaster, and renders the router.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

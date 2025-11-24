import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/home";
import Quiz from "@/pages/quiz";
import Results from "@/pages/results";
import NotFound from "@/pages/not-found";
import TopicPage from "./pages/topic";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/results" component={Results} />

      <Route path="/csharp_basics" component={TopicPage} />
      <Route path="/csharp_classes" component={TopicPage} />
      <Route path="/control_flows_csharp" component={TopicPage} />
      <Route path="/csharp_aspdotnet_core" component={TopicPage} />
      <Route path="/csharp_entity_framework" component={TopicPage} />
      <Route path="/csharp_linq" component={TopicPage} />
      <Route path="/dotnet9_features" component={TopicPage} />
      <Route path="/csharp_aspdotnet_middleware" component={TopicPage} />
      <Route path="/csharp_core" component={TopicPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

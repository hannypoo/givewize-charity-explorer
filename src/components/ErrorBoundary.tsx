import { Component, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex min-h-screen items-center justify-center p-6"
          style={{
            background:
              "linear-gradient(180deg, hsl(220,50%,18%) 0%, hsl(220,55%,12%) 100%)",
          }}
        >
          <div className="glass-dark rounded-2xl p-8 md:p-12 text-center max-w-md w-full">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-8 w-8 text-orange-light" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-white/50 mb-8">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                className="gradient-orange text-accent-foreground font-semibold rounded-2xl"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Page
              </Button>
              <Button
                variant="outline"
                className="border-white/25 text-white hover:bg-white/15 rounded-2xl"
                asChild
              >
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

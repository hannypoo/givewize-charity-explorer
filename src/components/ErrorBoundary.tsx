import { Component, type ReactNode } from "react";
import { RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const errorMessages = [
  "Dagnabit, something gone done went wrong!",
  "Well, that wasn't supposed to happen...",
  "Oops! We tripped over our own shoelaces.",
  "Houston, we have a problem. A small one though!",
  "Our hamsters stopped running on their wheels.",
  "The internet gremlins struck again!",
  "Someone unplugged something important...",
  "We zigged when we should have zagged!",
];

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      message: errorMessages[Math.floor(Math.random() * errorMessages.length)],
    };
  }

  static getDerivedStateFromError(): Partial<State> {
    return {
      hasError: true,
      message: errorMessages[Math.floor(Math.random() * errorMessages.length)],
    };
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
            <span className="text-7xl block mb-6" role="img" aria-label="Error" style={{ transform: "rotate(180deg)", display: "inline-block" }}>
              😊
            </span>
            <h1 className="text-2xl font-bold text-white mb-3">
              {this.state.message}
            </h1>
            <p className="text-white/50 mb-8">
              Don't worry, it's not you. Give it another shot!
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
                Try Again
              </Button>
              <Button
                variant="outline"
                className="border-white/25 text-white hover:bg-white/15 rounded-2xl"
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.href = "/";
                }}
              >
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

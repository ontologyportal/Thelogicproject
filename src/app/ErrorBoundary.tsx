import { Component, type ReactNode } from "react";

/**
 * Catches render-time exceptions anywhere in the tree. Without this, an
 * uncaught error during render blanks the whole app to a white screen with
 * no way back short of the user guessing to hit reload.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("ErrorBoundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-[#0a0a14] text-[#e0e0e8] px-6">
          <div className="max-w-sm text-center">
            <p className="text-[15px] mb-2">Something went wrong.</p>
            <p className="text-[13px] text-[#a0a0b0] mb-5">
              Your progress in this tab may be lost, but nothing was submitted.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#e0e0e8] hover:bg-white rounded-md text-[13px] text-[#0a0a14]"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

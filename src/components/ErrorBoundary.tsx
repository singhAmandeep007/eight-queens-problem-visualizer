import React from "react";

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  /**
   * Optional fallback UI to render when an error is caught.
   * If omitted, a default message is shown.
   */
  fallback?: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Classic React Error Boundary.
 *
 * Catches rendering/lifecycle errors in descendants and renders a fallback UI.
 */
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(_error: unknown): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo): void {
    // Keep lightweight logging; hook this up to your monitoring service if needed.
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

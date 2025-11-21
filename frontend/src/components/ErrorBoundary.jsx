// src/components/ErrorBoundary.jsx

import React from 'react';
import AppLayout from './AppLayout';

/**
 * ErrorBoundary
 *
 * Top-level React error boundary for the Pixel Pets frontend.
 *
 * Responsibilities:
 * - Catches render/lifecycle errors in child components.
 * - Shows a friendly fallback UI with recovery actions.
 * - In dev mode, exposes error details to help with debugging.
 *
 * Notes:
 * - Does not log errors to an external service (kept simple for this project).
 * - Uses AppLayout so the error screen still feels like part of the app.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  /**
   * React lifecycle hook:
   * Called when a child throws; updates local state so we can render fallback UI.
   */
  static getDerivedStateFromError(error) {
    return { error };
  }

  /**
   * React lifecycle hook:
   * Receives both the error and component stack.
   * Currently we just “touch” these variables so ESLint stays happy without logging.
   */
  componentDidCatch(error, info) {
    // Intentionally no logging here (no external logging service wired up).
    void error;
    void info;
  }

  /**
   * Clear the captured error and re-render children.
   * (Useful if the error was transient or fixed by a reload.)
   */
  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;

    // Fallback UI if we have captured an error
    if (error) {
      const isDev = import.meta?.env?.DEV === true;

      return (
        <AppLayout headerProps={{ title: 'WHOOPS!' }}>
          <section className="panel panel--narrow panel--center">
            <header className="panel__header">
              <h1 className="panel__title">Something went wrong</h1>
            </header>

            <div className="panel__body u-stack-md" role="alert" aria-live="polite">
              <div className="u-center" aria-hidden="true" style={{ fontSize: 32, lineHeight: 1 }}>
                🐾
              </div>

              <p>Our pixels tripped over a wire. Try one of these:</p>

              <div className="u-actions-row">
                <button className="btn" type="button" onClick={this.handleReset}>
                  Try again
                </button>
                <button
                  className="btn btn--ghost"
                  type="button"
                  onClick={() => window.history.back()}
                >
                  ⤺ Go Back
                </button>
                <button
                  className="btn btn--secondary"
                  type="button"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </button>
              </div>

              {isDev && (
                <details className="u-stack-sm" style={{ textAlign: 'left' }}>
                  <summary>Details (dev only)</summary>
                  <pre
                    style={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      background: '#000',
                      padding: '8px',
                      border: '3px solid var(--border-color)',
                    }}
                  >
                    {String(error?.stack || error)}
                  </pre>
                </details>
              )}
            </div>
          </section>
        </AppLayout>
      );
    }

    // Happy path: just render children normally
    return this.props.children;
  }
}

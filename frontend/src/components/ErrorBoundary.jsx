import React from 'react';
import AppLayout from './AppLayout';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Keep ESLint happy without logging in prod
    void error;
    void info;
  }

  handleReset = () => {
    // Clear captured error and re-render children
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;

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
                <button className="btn" onClick={this.handleReset}>
                  Try again
                </button>
                <button className="btn btn--ghost" onClick={() => window.history.back()}>
                  ⤺ Go Back
                </button>
                <button className="btn btn--secondary" onClick={() => window.location.reload()}>
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

    return this.props.children;
  }
}

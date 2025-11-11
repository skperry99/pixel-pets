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
    // Mark as used to satisfy eslint/@typescript-eslint no-unused-vars
    void error;
    void info;
  }

  render() {
    if (this.state.error) {
      return (
        <AppLayout headerProps={{ title: 'WHOOPS!' }}>
          <section className="panel panel--narrow">
            <header className="panel__header">
              <h1 className="panel__title">Something went wrong</h1>
            </header>
            <div className="panel__body u-stack-md">
              <p>Our pixels tripped over a wire. Try going back and reloading.</p>
              <button className="btn" onClick={() => window.location.reload()}>
                Reload
              </button>
            </div>
          </section>
        </AppLayout>
      );
    }
    return this.props.children;
  }
}

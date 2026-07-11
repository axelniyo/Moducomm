import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[Module: ${this.props.moduleName || 'Unknown'}] Error logged:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 m-4 border-l-4 border-red-500 bg-red-50 rounded shadow-sm">
          <h2 className="text-xl font-bold text-red-700 mb-2">
            Module Error: {this.props.moduleName || 'Component'}
          </h2>
          <p className="text-red-600 mb-4">
            This feature encountered a problem and has been isolated to prevent a system crash.
          </p>
          <div className="bg-white p-3 rounded border border-red-200 font-mono text-xs text-red-500 overflow-auto">
            {this.state.error?.toString()}
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry Module
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
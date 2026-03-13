import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4">
          <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-2xl max-w-lg w-full text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Something went critically wrong.</h1>
            <p className="text-gray-300 mb-6 font-medium">We apologize for the inconvenience. Our developers have been notified.</p>
            
            <div className="bg-black/50 p-4 rounded text-left overflow-auto max-h-48 mb-6">
                <code className="text-sm text-red-400 font-mono">
                    {this.state.error && this.state.error.toString()}
                </code>
            </div>

            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition-colors"
            >
              Refresh Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;

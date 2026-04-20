import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center font-jakarta">
          <div className="bg-white p-12 rounded-[2rem] shadow-xl border border-gray-100 max-w-lg">
            <div className="bg-red-100 text-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                 <span className="text-4xl font-bold">!</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-500 mb-8">
              An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl transition-all"
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

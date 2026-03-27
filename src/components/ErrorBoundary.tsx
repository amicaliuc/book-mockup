import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex items-center justify-center h-full bg-neutral-50">
          <div className="font-mono text-xs p-6 max-w-sm text-center">
            <p className="font-bold text-neutral-800 mb-2">Scene error</p>
            <p className="text-neutral-400 mb-4">{this.state.error.message}</p>
            <button
              className="px-4 py-2 bg-black text-white rounded-full text-xs tracking-widest"
              onClick={() => this.setState({ error: null })}
            >
              RETRY
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

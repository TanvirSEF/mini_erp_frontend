import * as React from 'react'
import { Button } from '@/components/ui/button'

type Props = { children: React.ReactNode }
type State = { hasError: boolean }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (import.meta.env.DEV) console.error(error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="space-y-1">
            <h1 className="text-lg font-medium">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">
              An unexpected error occurred. Try reloading the page.
            </p>
          </div>
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </div>
      )
    }
    return this.props.children
  }
}

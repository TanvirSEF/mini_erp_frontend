import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="space-y-1">
        <h1 className="text-lg font-medium">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you are looking for does not exist.
        </p>
      </div>
      <Link
        to="/dashboard"
        className="text-sm font-medium text-primary hover:underline"
      >
        Back to dashboard
      </Link>
    </div>
  )
}

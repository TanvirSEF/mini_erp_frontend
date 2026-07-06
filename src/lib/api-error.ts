export class ApiError extends Error {
  status: number
  errorDetails?: unknown

  constructor(status: number, message: string, errorDetails?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errorDetails = errorDetails
  }
}

import { toast } from "sonner"

export function handleApiError(error: any) {
  const status = error.status || 500
  const message = error.message || "An unexpected error occurred"

  switch (status) {
    case 400:
      toast.error(`Bad Request: ${message}`)
      break
    case 401:
      toast.error("Authentication required. Please log in again.")
      // Redirect to login
      window.location.href = "/login"
      break
    case 403:
      toast.error("Access denied. You don't have permission to perform this action.")
      break
    case 404:
      toast.error("Resource not found. The requested item may have been deleted.")
      break
    case 429:
      toast.error("Too many requests. Please wait a moment and try again.")
      break
    case 500:
      toast.error("Server error. Please try again later.")
      break
    case 502:
      toast.error("Service temporarily unavailable. Please try again later.")
      break
    case 503:
      toast.error("Service maintenance in progress. Please try again later.")
      break
    default:
      toast.error(`Error: ${message}`)
  }

  console.error("API Error:", error)
}

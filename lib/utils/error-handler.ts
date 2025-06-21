import { toast } from 'sonner';

export function handleApiError(error: any) {
  const status = error.status || 500;
  const message =
    error.data?.message || error.message || 'An unexpected error occurred';

  switch (status) {
    case 400:
      toast.error(`Bad Request: ${message}`);
      break;
    case 401:
      toast.error('Authentication required. Please log in again.');
      // Redirect to login
      window.location.href = '/login';
      break;
    case 403:
      toast.error("Access denied. You don't have permission for this action.");
      break;
    case 404:
      toast.error('Resource not found.');
      break;
    case 429:
      toast.error('Too many requests. Please try again later.');
      break;
    case 500:
      toast.error('Server error. Please try again later.');
      break;
    default:
      toast.error(message);
  }

  console.error('API Error:', error);
}
export function handleValidationError(errors: Record<string, string[]>) {
  const messages = Object.values(errors).flat();
  if (messages.length > 0) {
    toast.error(`Validation error: ${messages.join(', ')}`);
  } else {
    toast.error('Validation error occurred');
  }
}

let errorNotificationHandler = null;

export const registerErrorNotifier = (handler) => {
  errorNotificationHandler = handler;
};

export const secureFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      let errorBody = null;

      try {
        errorBody = await response.clone().json();
        if (errorBody && errorBody.error) {
          errorMessage = typeof errorBody.error === 'string' ? errorBody.error : JSON.stringify(errorBody.error);
        } else if (errorBody && errorBody.message) {
          errorMessage = errorBody.message;
        }
      } catch {
        // Non-JSON response body
      }

      if (response.status === 401) {
        if (errorNotificationHandler) {
          errorNotificationHandler({
            type: 'warning',
            title: 'Session Expired',
            message: 'Your authenticated session has ended. Please log in again to continue.',
          });
        }
      } else if (response.status === 403) {
        if (errorNotificationHandler) {
          errorNotificationHandler({
            type: 'error',
            title: 'Access Denied',
            message: errorMessage || 'You do not have administrative permission for this action.',
          });
        }
      } else if (response.status === 429) {
        if (errorNotificationHandler) {
          errorNotificationHandler({
            type: 'warning',
            title: 'Rate Limit Reached',
            message: 'Too many requests dispatched in a short window. Please wait a moment before trying again.',
          });
        }
      } else if (response.status >= 500) {
        if (errorNotificationHandler) {
          errorNotificationHandler({
            type: 'error',
            title: 'Server Error',
            message: 'ThinkWires core services encountered an internal issue. Our engineering team has been notified.',
          });
        }
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.response = response;
      error.data = errorBody;
      throw error;
    }

    return response;
  } catch (err) {
    if (err.name === 'TypeError' && err.message?.includes('fetch')) {
      if (errorNotificationHandler) {
        errorNotificationHandler({
          type: 'error',
          title: 'Connection Offline',
          message: 'Unable to reach ThinkWires API server. Please check your network connection.',
        });
      }
    }
    throw err;
  }
};

export default secureFetch;

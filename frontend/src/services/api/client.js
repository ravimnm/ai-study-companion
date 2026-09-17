const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

function getErrorMessage(data, statusCode) {
  if (typeof data?.detail === "string") {
    return data.detail;
  }

  if (Array.isArray(data?.detail)) {
    return data.detail
      .map((item) => item?.msg || "Validation error")
      .join(", ");
  }

  if (typeof data?.message === "string") {
    return data.message;
  }

  if (statusCode === 413) return "The request or uploaded file is too large.";
  if (statusCode === 401) return "Authentication required. Please sign in again.";
  if (statusCode === 403) return "You are not authorized to perform this action.";
  if (statusCode === 404) return "The requested resource was not found.";
  if (statusCode === 400) return "The request was invalid.";
  if (statusCode >= 500) return "The server could not complete the request.";
  return "Something went wrong.";
}

async function request(path, options = {}) {
  const token = localStorage.getItem("study_token");

  const headers = {
    // ngrok's free tier returns an HTML interstitial for browser GETs
    // without this header, and that response carries no CORS headers.
    "ngrok-skip-browser-warning": "true",
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(getErrorMessage(data, response.status));
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data;
}

export const api = {
  get: (path) => request(path),

  post: (path, body) =>
    request(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: (path, body) =>
    request(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (path) =>
    request(path, {
      method: "DELETE",
    }),
};

export default api;

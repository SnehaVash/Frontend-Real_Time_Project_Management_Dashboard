const BASE_URL = "https://rtpm-dashboard.onrender.com";

function getToken() {
  return sessionStorage.getItem("token");
}

// Helper: safely join URL parts
function buildUrl(endpoint) {
  return `${BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
}

async function apiRequest(endpoint, method = "GET", body = null, timeout = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const options = {
      method,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json"
      }
    };

    const token = getToken();
    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(buildUrl(endpoint), options);

    clearTimeout(timer);

    // Handle empty responses (204 No Content)
    let data = null;
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      try {
        data = await res.json();
      } catch {
        data = null;
      }
    }

    // Auto logout on unauthorized
    if (res.status === 401) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("auth");
      sessionStorage.removeItem("user");
      window.location.href = "login.html";
      return;
    }

    if (!res.ok) {
      throw new Error(data?.message || `API request failed (${res.status})`);
    }

    return data;

  } catch (err) {
    console.error("API Error:", err.name === "AbortError" ? "Request timeout" : err.message);

    return {
      success: false,
      message: err.name === "AbortError" ? "Request timeout" : err.message
    };
  }
}

// Optional helpers (cleaner usage in frontend)
async function get(endpoint) {
  return apiRequest(endpoint, "GET");
}

async function post(endpoint, body) {
  return apiRequest(endpoint, "POST", body);
}

async function put(endpoint, body) {
  return apiRequest(endpoint, "PUT", body);
}

async function del(endpoint) {
  return apiRequest(endpoint, "DELETE");
}
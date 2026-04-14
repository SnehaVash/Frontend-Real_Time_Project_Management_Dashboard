const BASE_URL = "https://rtpm-dashboard.onrender.com";


function getToken() {
  return sessionStorage.getItem("token");
}


async function apiRequest(endpoint, method = "GET", body = null) {
  try {
    const options = {
      method,
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

    const res = await fetch(BASE_URL + endpoint, options);

    const data = await res.json();

    if (res.status === 401) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("auth");
      sessionStorage.removeItem("user");

      window.location.href = "login.html";
      return;
    }

  
    if (!res.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;

  } catch (err) {
    console.error("API Error:", err.message);
    return { success: false, message: err.message };
  }
}
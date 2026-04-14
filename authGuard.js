(function () {

  function getToken() {
    return sessionStorage.getItem("token");
  }

  function isAuthenticated() {
    const token = getToken();
    const auth = sessionStorage.getItem("auth");

    return token && auth === "true";
  }

  function logoutRedirect() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("auth");
    sessionStorage.removeItem("user");

    window.location.href = "login.html";
  }

  function guard() {
    if (!isAuthenticated()) {
      logoutRedirect();
    }
  }

  // Run immediately
  guard();

  // Optional safety: re-check on back/forward navigation
  window.addEventListener("pageshow", guard);

})();
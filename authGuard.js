
(function () {
  const token = sessionStorage.getItem("token");
  const auth = sessionStorage.getItem("auth");

  function isAuthenticated() {
    return token && auth === "true";
  }

  function redirectToLogin() {
    window.location.href = "login.html";
  }

  // run guard immediately
  if (!isAuthenticated()) {
    redirectToLogin();
  }
})();
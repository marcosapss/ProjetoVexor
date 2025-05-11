
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("loggedUser");

  if (user && user !== "admin") {
    window.location.href = "usuario.html";
  }
});

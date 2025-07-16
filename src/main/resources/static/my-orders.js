document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You are not logged in!");
    window.location.href = "login.html";
    return;
  }

  fetch("http://localhost:8080/api/orders", {
    headers: { "Authorization": "Bearer " + token }
  })
    .then(res => {
      if (res.status === 401 || res.status === 403) {
        throw new Error("Unauthorized");
      }
      return res.json();
    })
    .then(orders => {  })
    .catch(err => {
      if (err.message === "Unauthorized") {
        localStorage.clear();
        alert("Session expired. Please login again.");
        window.location.href = "login.html";
      }
    });
});

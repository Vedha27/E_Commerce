const form = document.getElementById("registerForm");
const messageDiv = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageDiv.textContent = "";

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  try {
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    });

    const result = await response.text();

    if (!response.ok) {
      messageDiv.textContent = result || "Registration failed!";
      messageDiv.style.color = "red";
    } else {
      messageDiv.textContent = "✅ " + result;
      messageDiv.style.color = "green";
      form.reset();

      // 👉 Redirect to login.html after 2 seconds
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    }
  } catch (err) {
    messageDiv.textContent = "Server error. Try again.";
    messageDiv.style.color = "red";
  }
});

const form = document.getElementById("loginForm");
 const errorDiv = document.getElementById("error");

 form.addEventListener("submit", async (e) => {
   e.preventDefault();
   errorDiv.textContent = "";

   const email = document.getElementById("email").value;
   const password = document.getElementById("password").value;

   try {
     const response = await fetch("http://localhost:8080/api/auth/login", {
       method: "POST",
       headers: {
         "Content-Type": "application/json"
       },
       body: JSON.stringify({ email, password })
     });

     const result = await response.json();

     if (!response.ok) {
       errorDiv.textContent = result.message || "Login failed!";
       return;
     }

     localStorage.setItem("token", result.token);
     localStorage.setItem("role", result.role);
     localStorage.setItem("email", result.email);

     if (result.role === "ADMIN") {
       window.location.href = "admin-products.html";
     } else {
       window.location.href = "customer-products.html";
     }

   } catch (err) {
     errorDiv.textContent = "Server error. Try again.";
   }
 });
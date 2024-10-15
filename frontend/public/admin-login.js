// frontend/public/admin-login.js

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store the JWT token in localStorage
      localStorage.setItem("token", data.token);
      alert("Login successful! Redirecting to the admin dashboard...");
      window.location.href = "/admin.html"; // Redirect to admin dashboard
    } else {
      alert("Login failed: " + data.message);
    }
  });

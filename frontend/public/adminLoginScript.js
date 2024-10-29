// frontend/public/adminLoginScript.js

document
  .getElementById("adminLoginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const payload = {
      email: username, // Assuming 'email' is the admin username
      password: password,
    };

    try {
      const response = await fetch("/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        // Store the JWT token in localStorage
        console.log("Token received: ", result.token); // Check if token is received
        localStorage.setItem("token", result.token);
        console.log("Token stored: ", localStorage.getItem("token")); // Check if token is stored

        alert("Login successful!");

        // Redirect to the admin dashboard
        window.location.href = "admin-dashboard.html";
      } else {
        alert("Invalid login credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred while logging in. Please try again.");
    }
  });

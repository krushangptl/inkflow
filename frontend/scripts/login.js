const BASVE_URL = "http://127.0.0.1:8000";

// Toggle Form Logic
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const toggleFormBtn = document.getElementById("toggleForm");
const formTitle = document.getElementById("formTitle");

toggleFormBtn.addEventListener("click", () => {
  if (loginForm.style.display === "none") {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    formTitle.textContent = "Login";
    toggleFormBtn.textContent = "Don't have an account? Register here";
  } else {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    formTitle.textContent = "Register";
    toggleFormBtn.textContent = "Already have an account? Login here";
  }
});

// 🔐 Register
document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    const response = await fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Registration successful ✅");
      window.location.href = "index.html"; // Redirect to homepage
    } else {
      alert(result.detail || "Registration failed");
    }
  });

// 🔐 Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const response = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (response.ok) {
    alert("Login successful 🎉");
    localStorage.setItem("user", JSON.stringify(result.user));
    window.location.href = "index.html"; // Redirect to homepage
  } else {
    alert(result.detail || "Login failed");
  }
});

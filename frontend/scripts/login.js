const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const toggleFormBtn = document.getElementById("toggleForm");
const formTitle = document.getElementById("formTitle");

// toggle functionality
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

// handle login
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;

  let response = await fetch("api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  let result = await response.json();
  alert(result.message);
});

// handle registration
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  let username = document.getElementById("registerUsername").value;
  let email = document.getElementById("registerEmail").value;
  let password = document.getElementById("registerPassword").value;

  let response = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  let result = await response.json();
  alert(result.message);
});

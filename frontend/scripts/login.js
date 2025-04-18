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

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginEmail.value;
  const password = loginPassword.value;

  const res = await fetch("http://localhost:8000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("user", JSON.stringify(data.user));
    alert("Login successful!");
    window.location.href = "/frontend/index.html";
  } else {
    alert(data.detail);
  }
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = registerUsername.value;
  const email = registerEmail.value;
  const password = registerPassword.value;

  const res = await fetch("http://localhost:8000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    alert("Registered! Please log in.");
    toggleFormBtn.click(); // switch to login form
  } else {
    alert(data.detail);
  }
});

// after successful login
localStorage.setItem("user", JSON.stringify(data.user));

const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
const navLinks = document.getElementById("navLinks");
const ctaWriter = document.getElementById("ctaWriter");

if (isLoggedIn) {
  navLinks.innerHTML = `
        <li class="nav-item"><a class="nav-link" href="/frontend/index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="/frontend/html/article.html">Articles</a></li>
        <li class="nav-item"><a class="nav-link" href="/frontend/html/contact.html">Contact</a></li>
        <li class="nav-item"><a class="nav-link" href="/frontend/html/editor.html">Editor</a></li>
        <li class="nav-item"><a class="nav-link" href="/frontend/html/account.html">Account</a></li>
        <li class="nav-item"><a class="nav-link" href="/frontend/html/profile.html">Profile</a></li>
      `;
  ctaWriter.style.display = "block";
} else {
  navLinks.innerHTML = `
        <li class="nav-item"><a class="nav-link" href="/frontend/index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="/frontend/html/article.html">Articles</a></li>
        <li class="nav-item"><a class="nav-link" href="/frontend/html/contact.html">Contact</a></li>
        <li class="nav-item"><a class="nav-link" href="/frontend/html/login.html">Login</a></li>
      `;
  ctaWriter.style.display = "none";
}

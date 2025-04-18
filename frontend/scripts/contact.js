const user = JSON.parse(localStorage.getItem("user"));
if (user) {
  // Show profile/account/editor links
  navLinks.innerHTML = `
        <li class="nav-item"><a class="nav-link" href="/frontend/index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="/frontend/html/article.html">Articles</a></li>
        <li class="nav-item"><a class="nav-link" href="/frontend/html/contact.html">Contact</a></li>
        <li class="nav-item"><a class="nav-link" href="/frontend/html/editor.html">Editor</a></li>
        <li class="nav-item"><a class="nav-link" href="/frontend/html/account.html">Account</a></li>
      `;
  ctaWriter.style.display = "block";
} else {
  // Show login link only
  navLinks.innerHTML = `
        <li class="nav-item"><a class="nav-link" href="/frontend/index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="/frontend/html/article.html">Articles</a></li>
        <li class="nav-item"><a class="nav-link" href="/frontend/html/contact.html">Contact</a></li>
        <li class="nav-item"><a class="nav-link" href="/frontend/html/login.html">Login</a></li>
      `;
  ctaWriter.style.display = "none";
}

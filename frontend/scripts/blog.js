// /frontend/scripts/blog.js
const blogContainer = document.getElementById("blogContent");
const params = new URLSearchParams(window.location.search);
const blogId = params.get("id");

// Simulate fetching data from a database (you can replace with fetch to your backend)
fetch("/frontend/data/blogs.json")
  .then((res) => res.json())
  .then((blogs) => {
    const blog = blogs.find((b) => b.id == blogId);
    if (!blog) {
      blogContainer.innerHTML = `<h3>Blog not found</h3>`;
      return;
    }

    blogContainer.innerHTML = `
      <div class="text-center mb-4">
        <img src="${blog.image}" alt="${blog.title}" class="img-fluid mb-4 rounded" style="max-height: 400px;">
        <h2>${blog.title}</h2>
        <p class="mt-3 text-muted">${blog.summary}</p>
      </div>
      <div>
        <p style="white-space: pre-line;">${blog.content}</p>
      </div>
    `;
  });

// Load nav links
const user = JSON.parse(localStorage.getItem("user"));
const navLinks = document.getElementById("navLinks");
if (user) {
  navLinks.innerHTML = `
    <li class="nav-item"><a class="nav-link" href="/frontend/index.html">Home</a></li>
    <li class="nav-item"><a class="nav-link" href="/frontend/html/article.html">Articles</a></li>
    <li class="nav-item"><a class="nav-link" href="/frontend/html/contact.html">Contact</a></li>
    <li class="nav-item"><a class="nav-link" href="/frontend/html/editor.html">Editor</a></li>
    <li class="nav-item"><a class="nav-link" href="/frontend/html/account.html">Account</a></li>
  `;
} else {
  navLinks.innerHTML = `
    <li class="nav-item"><a class="nav-link" href="/frontend/index.html">Home</a></li>
    <li class="nav-item"><a class="nav-link" href="/frontend/html/article.html">Articles</a></li>
    <li class="nav-item"><a class="nav-link" href="/frontend/html/contact.html">Contact</a></li>
    <li class="nav-item"><a class="nav-link" href="/frontend/html/login.html">Login</a></li>
  `;
}

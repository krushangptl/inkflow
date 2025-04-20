document.addEventListener("DOMContentLoaded", async () => {
  // Handle nav link rendering
  const user = JSON.parse(localStorage.getItem("user"));
  const navLinks = document.getElementById("navLinks");

  if (user) {
    navLinks.innerHTML = `
      <li class="nav-item"><a class="nav-link" href="/frontend/index.html">Home</a></li>
      <li class="nav-item"><a class="nav-link" href="/frontend/html/article.html">Articles</a></li>
      <li class="nav-item"><a class="nav-link" href="/frontend/html/editor.html">Editor</a></li>
      <li class="nav-item"><a class="nav-link" href="/frontend/html/account.html">Account</a></li>
    `;
  } else {
    navLinks.innerHTML = `
      <li class="nav-item"><a class="nav-link" href="/frontend/index.html">Home</a></li>
      <li class="nav-item"><a class="nav-link" href="/frontend/html/article.html">Articles</a></li>
      <li class="nav-item"><a class="nav-link" href="/frontend/html/login.html">Login</a></li>
    `;
  }

  // Load blog cards
  const container = document.getElementById("article-posts");
  if (!container) return;

  try {
    const res = await fetch("http://localhost:8000/blogs");
    const blogs = await res.json();

    blogs.forEach((blog) => {
      const card = `
        <div class="col-md-4 mb-4">
          <div class="card blog-card h-100">
            <div class="card-body">
              <h5 class="card-title">${blog.title}</h5>
              <p class="card-text">${blog.content.substring(0, 100)}...</p>
              <a href="/frontend/html/blog.html?id=${blog.id}" class="btn btn-read-more">Read More</a>
            </div>
          </div>
        </div>
      `;
      container.innerHTML += card;
    });
  } catch (err) {
    console.error("Error loading blogs:", err);
    container.innerHTML = `<p class="text-danger">Failed to load blog articles.</p>`;
  }
});

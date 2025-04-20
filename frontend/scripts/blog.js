// Insert the navigation bar depending on login status
const navLinks = document.getElementById("navLinks");
const user = JSON.parse(localStorage.getItem("user"));

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

// Fetch the blog content by ID from the URL
const params = new URLSearchParams(window.location.search);
const blogId = params.get("id");
const blogContent = document.getElementById("blogContent");

fetch(`http://localhost:8000/blogs/${blogId}`)
  .then((res) => res.json())
  .then((data) => {
    if (data) {
      // Removed the image part
      blogContent.innerHTML = `
                        <h2 class="text-center mb-4">${data.title}</h2>
                        <div>${data.content}</div>
                    `;
    } else {
      blogContent.innerHTML = "<p>Blog not found.</p>";
    }
  })
  .catch((err) => {
    console.error("Error loading blog:", err);
    blogContent.innerHTML = "<p>Blog not found or failed to load.</p>";
  });

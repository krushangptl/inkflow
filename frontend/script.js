const user = JSON.parse(localStorage.getItem("user"));
const navLinks = document.getElementById("navLinks");
const ctaWriter = document.querySelector(".cta-section");

if (user) {
  navLinks.innerHTML = `
    <li class="nav-item"><a class="nav-link" href="/frontend/index.html">Home</a></li>
    <li class="nav-item"><a class="nav-link" href="/frontend/html/article.html">Articles</a></li>
    <li class="nav-item"><a class="nav-link" href="/frontend/html/contact.html">Contact</a></li>
    <li class="nav-item"><a class="nav-link" href="/frontend/html/editor.html">Editor</a></li>
    <li class="nav-item"><a class="nav-link" href="/frontend/html/account.html">Account</a></li>
  `;
  if (ctaWriter) ctaWriter.style.display = "block";
} else {
  navLinks.innerHTML = `
    <li class="nav-item"><a class="nav-link" href="/frontend/index.html">Home</a></li>
    <li class="nav-item"><a class="nav-link" href="/frontend/html/article.html">Articles</a></li>
    <li class="nav-item"><a class="nav-link" href="/frontend/html/contact.html">Contact</a></li>
    <li class="nav-item"><a class="nav-link" href="/frontend/html/login.html">Login</a></li>
  `;
  if (ctaWriter) ctaWriter.style.display = "none";
}

document.addEventListener("DOMContentLoaded", async () => {
  const blogContainer = document.getElementById("blog-posts");
  if (!blogContainer) return;

  try {
    const res = await fetch("http://localhost:8000/blogs");
    const blogs = await res.json();

    blogs.forEach((blog) => {
      const blogCard = `
        <div class="col-md-4 mb-4">
          <div class="card blog-card">
            <div class="card-body">
              <h5 class="card-title">${blog.title}</h5>
              <p class="card-text">${blog.content.substring(0, 100)}...</p>
              <a href="/frontend/html/blog.html?id=${blog.id}" class="btn btn-primary">Read More</a>
            </div>
          </div>
        </div>
      `;
      blogContainer.innerHTML += blogCard;
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }
});

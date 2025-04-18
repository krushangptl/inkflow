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

// Fetch blogs and render them dynamically on index.html
fetch("http://localhost:8000/blogs/")
  .then((response) => response.json())
  .then((data) => {
    const blogContainer = document.querySelector("#blog-posts");
    data.forEach((blog) => {
      const blogCard = `
        <div class="col-md-4 mb-4">
          <div class="card blog-card">
            <img src="${blog.image}" class="card-img-top" alt="${blog.title}" />
            <div class="card-body">
              <h5 class="card-title">${blog.title}</h5>
              <p class="card-text">${blog.content.substring(0, 100)}...</p>
              <!-- Ensure the correct blog ID is used in the href -->
              <a href="/frontend/html/blog.html?id=${blog.id}" class="btn btn-primary">Read More</a>
            </div>
          </div>
        </div>
      `;
      blogContainer.innerHTML += blogCard;
    });
  })
  .catch((error) => {
    console.error("Error fetching blogs:", error);
  });

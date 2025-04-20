// Navigation bar logic
const user = JSON.parse(localStorage.getItem("user"));
const navLinks = document.getElementById("navLinks");
const ctaWriter = document.getElementById("ctaWriter");

if (user) {
  navLinks.innerHTML = `
        <li class="nav-item"><a class="nav-link" href="/frontend/index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="/frontend/html/article.html">Articles</a></li>
        <li class="nav-item"><a class="nav-link" href="/frontend/html/editor.html">Editor</a></li>
        <li class="nav-item"><a class="nav-link" href="/frontend/html/account.html">Account</a></li>
      `;
  if (ctaWriter) ctaWriter.style.display = "block";
} else {
  navLinks.innerHTML = `
        <li class="nav-item"><a class="nav-link" href="/frontend/index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="/frontend/html/article.html">Articles</a></li>
        <li class="nav-item"><a class="nav-link" href="/frontend/html/login.html">Login</a></li>
      `;
  if (ctaWriter) ctaWriter.style.display = "none";
}

// Initialize Quill
let quill = new Quill("#editor", {
  theme: "snow",
});

async function submitBlog() {
  const title = document.getElementById("blogTitle").value;
  const content = quill.root.innerHTML;

  if (!title || !content) {
    alert("Please fill in both title and content.");
    return;
  }

  const response = await fetch("http://localhost:8000/blogs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });

  const data = await response.json();
  if (response.ok) {
    alert("Blog posted!");
    window.location.href = "/frontend/html/article.html";
  } else {
    alert(data.detail || "Failed to post blog.");
  }
}

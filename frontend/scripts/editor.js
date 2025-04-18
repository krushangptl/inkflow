// Navigation bar logic
const user = JSON.parse(localStorage.getItem("user"));
const navLinks = document.getElementById("navLinks");
const ctaWriter = document.getElementById("ctaWriter");

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

// Initialize Quill
let quill = new Quill("#editor", { theme: "snow" });
const status = document.querySelector("#status");
const wordCount = document.querySelector("#wordCount");
const publishBtn = document.querySelector("#publishBtn");

// Load saved draft
const savedContent = localStorage.getItem("blogContent");
if (savedContent) {
  quill.root.innerHTML = savedContent;
  updateWordCount();
}

// Auto-save
function saveDraft() {
  localStorage.setItem("blogContent", quill.root.innerHTML);
  if (status) {
    status.innerText = "Draft saved!";
    setTimeout(() => (status.innerText = ""), 2000);
  }
}
setInterval(saveDraft, 5000);

// Word count
function updateWordCount() {
  const text = quill.getText().trim();
  const count = text.length > 0 ? text.split(/\s+/).length : 0;
  if (wordCount) wordCount.innerText = `Word Count: ${count}`;
}
quill.on("text-change", updateWordCount);

// Publish
function publishBlog() {
  if (!quill.getText().trim()) {
    alert("Blog content cannot be empty!");
    return;
  }
  console.log("Blog Published:", quill.root.innerHTML);
  alert("Blog Published Successfully!");
  localStorage.removeItem("blogContent");
}

if (publishBtn) {
  publishBtn.addEventListener("click", publishBlog);
}

// Dark mode
const darkToggle = document.querySelector("#darkModeToggle");
if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
}

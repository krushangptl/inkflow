// initialize quill editor
let quill = new Quill("#editor", { theme: "snow" });
const editor = document.querySelector("#editor .ql-editor");
const status = document.querySelector("#status");
const wordCount = document.querySelector("#wordCount");
const publishBtn = document.querySelector("#publishBtn");

// load saved content from LocalStorage
const savedContent = localStorage.getItem("blogContent");
if (savedContent) {
  quill.root.innerHTML = savedContent;
  updateWordCount();
}

// autosave feature
function saveDraft() {
  localStorage.setItem("blogContent", quill.root.innerHTML);
  status.innerText = "Draft saved!";
  setTimeout(() => (status.innerText = ""), 2000);
}
setInterval(saveDraft, 5000); // auto-save every 5 seconds

// word count feature
function updateWordCount() {
  const text = quill.getText().trim();
  wordCount.innerText = `Word Count: ${text.split(/\s+/).length - 1}`;
}
quill.on("text-change", updateWordCount);

// publish validation
function publishBlog() {
  if (!quill.getText().trim()) {
    alert("Blog content cannot be empty!");
    return;
  }
  console.log("Blog Published:", quill.root.innerHTML);
  alert("Blog Published Successfully!");
}
publishBtn.addEventListener("click", publishBlog);

// dark mode toggle
document.querySelector("#darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

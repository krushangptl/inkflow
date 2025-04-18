const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "/frontend/html/login.html";
}

const userId = user.id;
const apiBase = "http://localhost:8000"; // or your API host

// Load user data on page load
window.onload = async () => {
  try {
    const res = await fetch(`${apiBase}/user/${userId}`);
    const data = await res.json();

    document.getElementById("name").value = data.name || "";
    document.getElementById("username").value = data.username;
    document.getElementById("email").value = data.email;
    document.getElementById("bio").value = data.bio || "";
  } catch (err) {
    alert("Failed to load user data.");
  }
};

async function saveProfile() {
  const payload = {
    name: document.getElementById("name").value,
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    bio: document.getElementById("bio").value,
  };

  try {
    const res = await fetch(`${apiBase}/user/${userId}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    alert(data.message || "Profile updated");
  } catch {
    alert("Update failed.");
  }
}

async function updatePassword() {
  const current = document.getElementById("current-password").value;
  const newPass = document.getElementById("new-password").value;
  const confirm = document.getElementById("confirm-password").value;

  if (newPass !== confirm) {
    alert("Passwords do not match");
    return;
  }

  const payload = {
    current_password: current,
    new_password: newPass,
  };

  try {
    const res = await fetch(`${apiBase}/user/${userId}/password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
    } else {
      alert(data.detail || "Password change failed");
    }
  } catch {
    alert("Error changing password.");
  }
}

async function deleteAccount() {
  const confirmDelete = confirm(
    "Are you sure you want to delete your account? This cannot be undone!"
  );
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${apiBase}/user/${userId}/delete`, {
      method: "DELETE",
    });

    const data = await res.json();
    alert(data.message);
    localStorage.removeItem("user");
    window.location.href = "/frontend/html/login.html";
  } catch {
    alert("Failed to delete account.");
  }
}

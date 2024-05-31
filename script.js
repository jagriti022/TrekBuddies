//main script
let navbarDiv = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
    navbarDiv.classList.add("navbar-cng");
  } else {
    navbarDiv.classList.remove("navbar-cng");
  }
});
const navbarCollapseDiv = document.getElementById("navbar-collapse");
const navbarShowBtn = document.getElementById("navbar-show-btn");
const navbarCloseBtn = document.getElementById("navbar-close-btn");
// show navbar
navbarShowBtn.addEventListener("click", () => {
  navbarCollapseDiv.classList.add("navbar-collapse-rmw");
});

// hide side bar
navbarCloseBtn.addEventListener("click", () => {
  navbarCollapseDiv.classList.remove("navbar-collapse-rmw");
});

document.addEventListener("click", (e) => {
  if (
    e.target.id != "navbar-collapse" &&
    e.target.id != "navbar-show-btn" &&
    e.target.parentElement.id != "navbar-show-btn"
  ) {
    navbarCollapseDiv.classList.remove("navbar-collapse-rmw");
  }
});

// stop transition and animatino during window resizing
let resizeTimer;
window.addEventListener("resize", () => {
  document.body.classList.add("resize-animation-stopper");
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove("resize-animation-stopper");
  }, 400);
});

async function createGroup() {
  const groupName = document.getElementById("group-name").value;
  const monument = document.getElementById("monument").value;

  const response = await fetch("http://localhost:3000/api/groups/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: groupName, monument }),
  });

  const result = await response.json();
  if (response.ok) {
    alert("Group created successfully!");
  } else {
    alert("Error: " + result.message);
  }
}

async function joinGroup() {
  const groupname = document.getElementById("name").value;
  const groupId = document.getElementById("group-id").value;
  const userId = document.getElementById("user-id").value;

  const response = await fetch("http://localhost:3000/api/groups/join", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ groupname, groupId, userId }),
  });

  const result = await response.json();
  if (response.ok) {
    alert("Successfully joined the group!");
  } else {
    alert("Error: " + result.error);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();

  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      logoutUser();
    });
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      await loginUser(event);
    });
  }
});
async function checkLoginStatus() {
  const token = localStorage.getItem("token");
  if (token) {
    document.getElementById("login-link").style.display = "none";
    document.getElementById("register-link").style.display = "none";
    document.getElementById("profile-link").style.display = "block";
    document.getElementById("logout-btn").style.display = "block";
    document.getElementById("group-link").style.display = "block";
    await loadProfile();
  } else {
    document.getElementById("login-link").style.display = "block";
    document.getElementById("register-link").style.display = "block";
    document.getElementById("profile-link").style.display = "none";
    document.getElementById("logout-btn").style.display = "none";
    document.getElementById("group-link").style.display = "none";
  }
}

async function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = document.getElementById("error-message");
      if (errorMessage) {
        errorMessage.innerText = errorData.message;
      }
      return;
    }

    const data = await response.json();
    alert("Login successful!");
    console.log("Token:", data.token);

    // Save user data to local storage
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("token", data.token);

    // Update navbar
    showLoggedInNav();

    // Redirect to profile page or another page if needed
    window.location.href = "profile.html";
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = document.getElementById("error-message");
    if (errorMessage) {
      errorMessage.innerText = "An error occurred. Please try again.";
    }
  }
}

function showLoggedInNav() {
  const loginLink = document.getElementById("login-link");
  const registerLink = document.getElementById("register-link");
  const profileLink = document.getElementById("profile-link");
  const logoutBtn = document.getElementById("logout-btn");

  if (loginLink) loginLink.style.display = "none";
  if (registerLink) registerLink.style.display = "none";
  if (profileLink) profileLink.style.display = "block";
  if (logoutBtn) logoutBtn.style.display = "block";
}
async function loadProfile() {
  try {
    const userId = localStorage.getItem("userId");

    if (userId != null) {
      const response = await fetch(
        `http://localhost:3000/api/users/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        document.getElementById("profilePicture").src =
          data.profilePicture ||
          "data:image/png;base64,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";
        document.getElementById("name").textContent = data.name;
        document.getElementById("email").textContent = data.email;
        document.getElementById("phone").textContent = data.phone;
        document.getElementById("city").textContent = data.city;
        document.getElementById("gender").textContent = data.gender;
        document.getElementById("age").textContent = data.age;
        document.getElementById("dob").value = data.dob
          ? new Date(data.dob).toISOString().split("T")[0]
          : "";
      } else {
        const error = await response.json();
        alert("Error loading profile: " + error.message);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function showLoggedOutNav() {
  const loginLink = document.getElementById("login-link");
  const registerLink = document.getElementById("register-link");
  const profileLink = document.getElementById("profile-link");
  const logoutBtn = document.getElementById("logout-btn");

  if (loginLink) loginLink.style.display = "block";
  if (registerLink) registerLink.style.display = "block";
  if (profileLink) profileLink.style.display = "none";
  if (logoutBtn) logoutBtn.style.display = "none";
}

function logoutUser() {
  localStorage.removeItem("userId");
  localStorage.removeItem("token");

  showLoggedOutNav();
  window.location.href = "index.html";
}
document.addEventListener("DOMContentLoaded", async () => {
  await loadProfile();
});

function populateProfile(userData) {
  document.getElementById("profile-pic-img").src =
    userData.profilePicUrl || "default-profile-pic.jpg";
  document.getElementById("name").value = userData.name;
  document.getElementById("email").value = userData.email;
  document.getElementById("phone").value = userData.phone;
  document.getElementById("city").value = userData.city;
  document.getElementById("gender").value = userData.gender;
  document.getElementById("age").value = userData.age;
}

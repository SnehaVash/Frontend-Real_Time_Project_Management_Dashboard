const BASE_URL = "http://localhost:5000/api";

function getToken() {
  return sessionStorage.getItem("token");
}

function renderActivityFeed(activities = []) {
  const feed = document.getElementById("activityFeed");
  if (!feed) return;

  feed.innerHTML = "";

  activities.forEach((a, i) => {
    const div = document.createElement("div");
    div.className = "activity-item";
    div.style.animationDelay = (i * 0.05) + "s";

    div.innerHTML = `
      <div class="act-avatar" style="background:${a.color || "#7c5cfc"}">
        ${a.user || "U"}
      </div>
      <div class="act-content">
        <div class="act-text">
          <strong>${a.name}</strong> ${a.action}
          <span class="act-item">${a.item}</span>
        </div>
        <div class="act-time">${a.time}</div>
      </div>
    `;

    feed.appendChild(div);
  });
}

function renderSprintChart(sprints = []) {
  const chart = document.getElementById("barChart");
  const labels = document.getElementById("chartLabels");

  if (!chart || !labels) return;

  chart.innerHTML = "";
  labels.innerHTML = "";

  const max = 100;

  sprints.forEach(s => {
    const group = document.createElement("div");
    group.className = "bar-group";

    group.innerHTML = `
      <div class="bar b-done" style="height:${(s.done / max) * 100}px"></div>
      <div class="bar b-added" style="height:${(s.added / max) * 100}px"></div>
    `;

    chart.appendChild(group);

    const label = document.createElement("div");
    label.className = "chart-label";
    label.textContent = s.label;

    labels.appendChild(label);
  });
}

function updateCircle(percent = 0) {
  const circle = document.querySelector(".circle");
  const workedEl = document.getElementById("hoursWorked");
  const percentEl = document.getElementById("percent");

  if (!circle || !workedEl || !percentEl) return;

  workedEl.innerText = Math.round(percent / 12);
  percentEl.innerText = Math.round(percent) + "%";

  circle.style.background =
    `conic-gradient(#7c5cfc 0% ${percent}%, rgba(255,255,255,0.08) ${percent}%)`;
}

function initDarkMode() {
  const toggle = document.getElementById("darkToggle");
  if (!toggle) return;

  const saved = localStorage.getItem("darkMode");

  if (saved === "true") {
    document.body.classList.add("dark");
    toggle.checked = true;
  }

  toggle.addEventListener("change", () => {
    const value = toggle.checked;

    document.body.classList.toggle("dark", value);
    localStorage.setItem("darkMode", value);
  });
}

function initProfileModal() {
  const editBtn = document.getElementById("editProfileBtn");
  const modal = document.getElementById("profileModal");
  const closeBtn = document.getElementById("closeProfile");
  const saveBtn = document.getElementById("saveProfile");

  if (!editBtn || !modal) return;

  editBtn.onclick = () => modal.style.display = "flex";
  closeBtn && (closeBtn.onclick = () => modal.style.display = "none");

  if (saveBtn) {
    saveBtn.onclick = () => {
      const name = document.getElementById("profileName")?.value;
      const role = document.getElementById("profileRole")?.value;

      const nameEl = document.querySelector(".profile-name");
      const roleEl = document.querySelector(".profile-role");

      if (nameEl) nameEl.textContent = name;
      if (roleEl) roleEl.textContent = role;

      modal.style.display = "none";
    };
  }
}

async function loadDashboardData() {
  try {
    const token = getToken();
    if (!token) return;

    const res = await fetch(`${BASE_URL}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) return;

    const data = await res.json();
    console.log("Dashboard data:", data);

    // ✅ NOW CONNECT BACKEND DATA TO UI

    if (data.activities) {
      renderActivityFeed(data.activities);
    }

    if (data.sprints) {
      renderSprintChart(data.sprints);
    }

    if (data.progress !== undefined) {
      updateCircle(data.progress);
    }

  } catch (err) {
    console.log("Dashboard error:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  initProfileModal();

  // fallback UI only if backend fails
  renderActivityFeed([]);
  renderSprintChart([]);
  updateCircle(0);

  loadDashboardData();
});
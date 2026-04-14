
  // Activity feed data
  const activities = [
    { user: 'PR', color: 'linear-gradient(135deg,#5cf0c8,#7c5cfc)', name: 'Priya', action: 'merged', item: 'PR #284 Auth refactor', time: 'Just now' },
    { user: 'RH', color: 'linear-gradient(135deg,#fc5c7d,#fcb95c)', name: 'Rohan', action: 'moved', item: 'API Gateway → Review', time: '2 min ago' },
    { user: 'ZR', color: 'linear-gradient(135deg,#fcb95c,#fc5c7d)', name: 'Zara', action: 'completed', item: 'Dark mode UI pass', time: '8 min ago' },
    { user: 'MV', color: 'linear-gradient(135deg,#5cf0c8,#fcb95c)', name: 'Meera', action: 'opened bug', item: '#119 Redis timeout', time: '15 min ago' },
    { user: 'AK', color: 'linear-gradient(135deg,#7c5cfc,#fc5c7d)', name: 'Aryan', action: 'commented on', item: 'Sprint 14 Goals', time: '22 min ago' },
    { user: 'PR', color: 'linear-gradient(135deg,#5cf0c8,#7c5cfc)', name: 'Priya', action: 'deployed', item: 'staging build #88', time: '31 min ago' },
    { user: 'RH', color: 'linear-gradient(135deg,#fc5c7d,#fcb95c)', name: 'Rohan', action: 'created', item: 'Onboarding redesign', time: '45 min ago' },
  ];

  const feed = document.getElementById('activityFeed');
  activities.forEach((a, i) => {
    const div = document.createElement('div');
    div.className = 'activity-item';
    div.style.animationDelay = (0.3 + i * 0.06) + 's';
    div.innerHTML = `
      <div class="act-avatar" style="background:${a.color}">${a.user}</div>
      <div class="act-content">
        <div class="act-text"><strong>${a.name}</strong> ${a.action} <span class="act-item">${a.item}</span></div>
        <div class="act-time">${a.time}</div>
      </div>`;
    feed.appendChild(div);
  });

  // Bar chart
  const sprints = [
    { label: 'S8', done: 62, added: 15 },
    { label: 'S9', done: 75, added: 20 },
    { label: 'S10', done: 58, added: 10 },
    { label: 'S11', done: 80, added: 25 },
    { label: 'S12', done: 70, added: 18 },
    { label: 'S13', done: 88, added: 22 },
    { label: 'S14', done: 94, added: 12 },
  ];

  const chart = document.getElementById('barChart');
  const labels = document.getElementById('chartLabels');
  const maxVal = 120;

  sprints.forEach(s => {
    const grp = document.createElement('div');
    grp.className = 'bar-group';
    grp.innerHTML = `
      <div class="bar b-done" style="height:${(s.done/maxVal)*100}px" title="${s.done} pts completed"></div>
      <div class="bar b-added" style="height:${(s.added/maxVal)*100}px" title="${s.added} pts added"></div>`;
    chart.appendChild(grp);

    const lbl = document.createElement('div');
    lbl.className = 'chart-label';
    lbl.textContent = s.label;
    labels.appendChild(lbl);
  });

  // Simulate live activity: new item every 8 seconds
  const liveEvents = [
    { user: 'RH', color: 'linear-gradient(135deg,#fc5c7d,#fcb95c)', name: 'Rohan', action: 'pushed 3 commits to', item: 'feat/oauth-flow' },
    { user: 'ZR', color: 'linear-gradient(135deg,#fcb95c,#5cf0c8)', name: 'Zara', action: 'updated design for', item: 'Settings Page v2' },
    { user: 'PR', color: 'linear-gradient(135deg,#7c5cfc,#5cf0c8)', name: 'Priya', action: 'resolved', item: 'Bug #117 session drop' },
    { user: 'MV', color: 'linear-gradient(135deg,#5cf0c8,#7c5cfc)', name: 'Meera', action: 'scaled up', item: 'prod-api to 4 replicas' },
  ];
  let liveIdx = 0;

  setInterval(() => {
    const e = liveEvents[liveIdx % liveEvents.length];
    liveIdx++;

    const div = document.createElement('div');
    div.className = 'activity-item';
    div.style.background = 'rgba(124,92,252,0.06)';
    div.innerHTML = `
      <div class="act-avatar" style="background:${e.color}">${e.user}</div>
      <div class="act-content">
        <div class="act-text"><strong>${e.name}</strong> ${e.action} <span class="act-item">${e.item}</span></div>
        <div class="act-time">Just now</div>
      </div>`;

    feed.insertBefore(div, feed.firstChild);
    // Update older items' times
    const items = feed.querySelectorAll('.act-time');
    items.forEach((t, i) => {
      if (i === 0) t.textContent = 'Just now';
    });

    // Keep max 8 items
    while (feed.children.length > 8) feed.removeChild(feed.lastChild);

    // Animate new item
    div.style.opacity = '0';
    div.style.transform = 'translateY(-8px)';
    requestAnimationFrame(() => {
      div.style.transition = 'opacity 0.4s, transform 0.4s';
      div.style.opacity = '1';
      div.style.transform = 'translateY(0)';
    });

    // Also bump stat s1 occasionally
    if (Math.random() > 0.6) {
      const el = document.getElementById('s1');
      el.textContent = parseInt(el.textContent) + 1;
    }
  }, 8000);

  const max = 8;
const worked = 7;

const percent = (worked/max)*100;

document.getElementById("hoursWorked").innerText = worked;
document.getElementById("percent").innerText = Math.round(percent)+"%";

document.querySelector(".circle").style.background =
`conic-gradient(#7c5cfc 0% ${percent}%, rgba(255,255,255,0.08) ${percent}%)`;

if(worked>max){
document.getElementById("workAlert").style.display="block";
}
const toggle = document.getElementById("darkToggle");

if(toggle){

const saved = localStorage.getItem("darkMode");

if(saved === "true"){
document.body.classList.add("dark");
toggle.checked = true;
}

toggle.addEventListener("change", ()=>{

if(toggle.checked){
document.body.classList.add("dark");
localStorage.setItem("darkMode","true");
}else{
document.body.classList.remove("dark");
localStorage.setItem("darkMode","false");
}

});

}
const editBtn = document.getElementById("editProfileBtn");
const modal = document.getElementById("profileModal");
const closeBtn = document.getElementById("closeProfile");
const saveBtn = document.getElementById("saveProfile");

editBtn.onclick = () => {
modal.style.display = "flex";
}

closeBtn.onclick = () => {
modal.style.display = "none";
}

saveBtn.onclick = () => {

const name = document.getElementById("profileName").value;
const role = document.getElementById("profileRole").value;

document.querySelector(".profile-name").textContent = name;
document.querySelector(".profile-role").textContent = role;

modal.style.display = "none";
}
document.addEventListener("DOMContentLoaded", function(){

const editBtn = document.getElementById("editProfileBtn");
const modal = document.getElementById("profileModal");
const closeBtn = document.getElementById("closeProfile");
const saveBtn = document.getElementById("saveProfile");

editBtn.addEventListener("click", () => {
modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
modal.style.display = "none";
});

saveBtn.addEventListener("click", () => {

const name = document.getElementById("profileName").value;
const role = document.getElementById("profileRole").value;

document.querySelector(".profile-name").textContent = name;
document.querySelector(".profile-role").textContent = role;

modal.style.display = "none";
});

});
function openProjectModal(){
document.getElementById("projectModal").style.display="flex";
}

function closeProjectModal(){
document.getElementById("projectModal").style.display="none";
}

function createProject(){
const name=document.getElementById("projectName").value;
const desc=document.getElementById("projectDesc").value;

if(name===""){
alert("Enter project name");
return;
}

const project={
name:name,
desc:desc,
date:new Date().toLocaleDateString()
};

let projects = JSON.parse(localStorage.getItem("projects")) || [];
projects.push(project);
localStorage.setItem("projects", JSON.stringify(projects));

closeProjectModal();

window.location.href="projects.html";
}
function updateProjectStats(){

const projects = document.querySelectorAll(".project-card");

document.getElementById("activeCount").innerText = projects.length;

}
const projectsList = document.getElementById("projectsList");

function loadProjects(){

const projects = JSON.parse(localStorage.getItem("projects")) || [];

projectsList.innerHTML = "";

projects.forEach(p => {

const card = `
<div class="project-card">
<h3>${p.name}</h3>
<p>${p.desc}</p>
<span>${p.date}</span>
</div>
`;

projectsList.innerHTML += card;

});

updateProjectStats();

}

function updateProjectStats(){

const total = document.querySelectorAll(".project-card").length;

document.getElementById("activeCount").innerText = total;

}

loadProjects();
function updateProjectStats(){

const total = document.querySelectorAll(".project-card").length;

document.getElementById("activeCount").innerText = total;

}

// page load pe run karo
document.addEventListener("DOMContentLoaded", updateProjectStats);
function updateProjectStats(){

const total = document.querySelectorAll("#projectsList > div").length;

document.getElementById("activeCount").innerText = total;

}

document.addEventListener("DOMContentLoaded", updateProjectStats);
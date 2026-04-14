// app.js - Main Dashboard Logic

document.addEventListener("DOMContentLoaded", () => {
    // Topbar Greeting Date
    const dateEl = document.querySelector('.greeting .subtitle');
    if (dateEl) {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        dateEl.innerText = new Date().toLocaleDateString('en-US', options);
    }
    
    // Counter Animation
    const counters = document.querySelectorAll('.count-up');
    counters.forEach(counter => {
        let target = +counter.getAttribute('data-target');
        
        // Dynamically compute targets based on State if applicable
        if (counter.closest('.metric-card')) {
            const label = counter.closest('.metric-card').querySelector('h3').innerText;
            if (label === 'Active Tasks') {
                target = S.data.projects.length * 12; // pseudo calc based on projects
            } else if (label === 'Health Index') {
                target = 96; // static conceptual
            } else if (label === 'Team Velocity') {
                target = 124; // static conceptual
            }
        }
        
        const duration = 2000; 
        const increment = target / (duration / 16); 
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target;
            }
        };

        setTimeout(updateCounter, 500);
    });

    renderProjectsTimeline();
    renderActivityFeed();
    updateNotificationBadge();
});

// Render Projects
function renderProjectsTimeline() {
    const list = document.getElementById('timeline-list');
    if (!list) return;
    list.innerHTML = '';
    
    if (S.data.projects.length === 0) {
        list.innerHTML = '<p style="color: var(--text-secondary); font-size: 14px;">No active projects.</p>';
        return;
    }
    
    // Sort by progress descending
    const sorted = [...S.data.projects].sort((a,b) => b.progress - a.progress);
    
    sorted.forEach(p => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-info">
                <span>${p.name}</span>
                <span>${p.progress}%</span>
            </div>
            <div class="progress-bar-wrap">
                <div class="progress-bar ${p.colorClass}" style="width: ${p.progress}%"></div>
            </div>
        `;
        list.appendChild(item);
    });
}

// Render Activity
function renderActivityFeed() {
    const feed = document.getElementById('activity-feed');
    if (!feed) return;
    feed.innerHTML = '';
    
    S.data.activities.forEach((act, idx) => {
        const item = document.createElement('div');
        item.className = 'feed-item';
        item.style.animationDelay = `${idx * 0.1}s`;
        item.innerHTML = `
            <div class="feed-icon ${act.type}">
                <i class="ph ${act.icon}"></i>
            </div>
            <div class="feed-content">
                <p>${act.html}</p>
                <div class="feed-time">${S.timeAgo(act.time)}</div>
            </div>
        `;
        feed.appendChild(item);
    });
}

// Notifications Logic
function updateNotificationBadge() {
    const badge = document.getElementById('notif-badge');
    if (!badge) return;
    const count = S.getUnreadNotifs();
    if (count > 0) {
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
}

function toggleNotifications() {
    const dropdown = document.getElementById('notif-dropdown');
    if (!dropdown) return;
    
    if (!dropdown.classList.contains('active')) {
        dropdown.classList.add('active');
        renderNotifications();
    } else {
        dropdown.classList.remove('active');
    }
}

function renderNotifications() {
    const list = document.getElementById('notif-list');
    list.innerHTML = '';
    
    if (S.data.notifications.length === 0) {
        list.innerHTML = '<div style="padding:16px; color:var(--text-secondary); text-align:center; font-size:13px;">No notifications.</div>';
        return;
    }
    
    S.data.notifications.forEach(n => {
        const item = document.createElement('div');
        item.className = `notif-item ${n.read ? '' : 'unread'}`;
        item.innerHTML = `
            <h4>${n.title}</h4>
            <p>${n.message}</p>
            <div class="notif-time">${S.timeAgo(n.time)}</div>
        `;
        list.appendChild(item);
    });
}

function markRead() {
    S.markAllRead();
    updateNotificationBadge();
    renderNotifications();
}

// Close dropdown if clicked outside
document.addEventListener('click', (e) => {
    const wrapper = document.querySelector('.notification-wrapper');
    const dropdown = document.getElementById('notif-dropdown');
    if (wrapper && dropdown && dropdown.classList.contains('active')) {
        if (!wrapper.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    }
});

// Search Logic
function openSearch() {
    const overlay = document.getElementById('search-overlay');
    if(overlay) {
        overlay.classList.add('active');
        document.getElementById('search-input').focus();
    }
}

function closeSearch() {
    const overlay = document.getElementById('search-overlay');
    if(overlay) overlay.classList.remove('active');
}

document.getElementById('search-input')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';
    
    if (!term) return;
    
    // Search Teams
    S.data.teams.filter(t => t.name.toLowerCase().includes(term)).forEach(t => {
        resultsContainer.innerHTML += `
            <a href="teams.html" class="search-result-item">
                <div class="icon" style="color:var(--${t.colorClass})"><i class="ph ${t.icon}"></i></div>
                <div>
                    <div>${t.name}</div>
                    <div style="font-size:12px; color:var(--text-secondary)">Team</div>
                </div>
            </a>
        `;
    });
    
    // Search Projects
    S.data.projects.filter(p => p.name.toLowerCase().includes(term)).forEach(p => {
        resultsContainer.innerHTML += `
            <a href="index.html" class="search-result-item">
                <div class="icon" style="color:var(--accent-blue)"><i class="ph ph-kanban"></i></div>
                <div>
                    <div>${p.name}</div>
                    <div style="font-size:12px; color:var(--text-secondary)">Project - ${p.progress}%</div>
                </div>
            </a>
        `;
    });
    
    // Search Members
    S.data.members.filter(m => (m.firstName + ' ' + m.lastName).toLowerCase().includes(term)).forEach(m => {
        resultsContainer.innerHTML += `
            <a href="teams.html" class="search-result-item">
                <img src="${m.img}" alt="${m.firstName}" style="width:32px; height:32px; border-radius:50%">
                <div>
                    <div>${m.firstName} ${m.lastName}</div>
                    <div style="font-size:12px; color:var(--text-secondary)">Member</div>
                </div>
            </a>
        `;
    });
});

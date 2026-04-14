// teams.js

// Initial State Mock
let appState = {
    teams: [
        { 
            id: 'eng', 
            name: 'Engineering', 
            icon: 'ph-code', 
            colorClass: 'accent-blue', 
            bg: 'rgba(41, 151, 255, 0.1)', 
            desc: 'Core architecture, web, and mobile app development.' 
        },
        { 
            id: 'design', 
            name: 'Product Design', 
            icon: 'ph-bezier-curve', 
            colorClass: 'accent-purple',
            bg: 'rgba(191, 90, 242, 0.1)', 
            desc: 'UI/UX, user research, and branding operations.' 
        },
        { 
            id: 'marketing', 
            name: 'Marketing', 
            icon: 'ph-megaphone', 
            colorClass: 'accent-orange',
            bg: 'rgba(255, 159, 10, 0.1)', 
            desc: 'Growth, campaigns, and content strategy.' 
        }
    ],
    members: [
        { id: 'm1', firstName: 'Jane', lastName: 'Doe', email: 'jane@prospace.com', teamId: 'eng', role: 'admin', img: 'https://i.pravatar.cc/150?img=11' },
        { id: 'm2', firstName: 'John', lastName: 'Smith', email: 'john@prospace.com', teamId: 'eng', role: 'member', img: 'https://i.pravatar.cc/150?img=33' },
        { id: 'm3', firstName: 'Sarah', lastName: 'Chen', email: 'sarah@prospace.com', teamId: 'eng', role: 'member', img: 'https://i.pravatar.cc/150?img=47' },
        { id: 'm4', firstName: 'Alex', lastName: 'Rivera', email: 'alex@prospace.com', teamId: 'eng', role: 'member', img: 'https://i.pravatar.cc/150?img=12' },
        { id: 'm5', firstName: 'Jordan', lastName: 'Lee', email: 'jordan@prospace.com', teamId: 'eng', role: 'viewer', img: 'https://i.pravatar.cc/150?img=5' },
        
        { id: 'm6', firstName: 'Taylor', lastName: 'Kim', email: 'taylor@prospace.com', teamId: 'design', role: 'admin', img: 'https://i.pravatar.cc/150?img=44' },
        { id: 'm7', firstName: 'Morgan', lastName: 'Woods', email: 'morgan@prospace.com', teamId: 'design', role: 'member', img: 'https://i.pravatar.cc/150?img=20' },
        
        { id: 'm8', firstName: 'Sam', lastName: 'Brooks', email: 'sam@prospace.com', teamId: 'marketing', role: 'admin', img: 'https://i.pravatar.cc/150?img=22' },
        { id: 'm9', firstName: 'Casey', lastName: 'Smith', email: 'casey@prospace.com', teamId: 'marketing', role: 'member', img: 'https://i.pravatar.cc/150?img=9' },
        { id: 'm10', firstName: 'Riley', lastName: 'Jones', email: 'riley@prospace.com', teamId: 'marketing', role: 'member', img: 'https://i.pravatar.cc/150?img=31' }
    ]
};

// Utilities
const colors = [
    { class: 'accent-blue', bg: 'rgba(41, 151, 255, 0.1)' },
    { class: 'accent-purple', bg: 'rgba(191, 90, 242, 0.1)' },
    { class: 'accent-orange', bg: 'rgba(255, 159, 10, 0.1)' },
    { class: 'accent-green', bg: 'rgba(48, 209, 88, 0.1)' }
];

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Render Logic
function renderTeams() {
    const grid = document.getElementById('teams-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    appState.teams.forEach(team => {
        const teamMembers = appState.members.filter(m => m.teamId === team.id);
        
        const card = document.createElement('div');
        card.className = 'card team-card glow-effect animate-fade-in-up';
        card.style.cursor = 'pointer';
        card.onclick = () => openTeamPanel(team.id);
        
        let avatarsHTML = '';
        const limit = 3;
        for(let i = 0; i < Math.min(teamMembers.length, limit); i++) {
            avatarsHTML += `<img src="${teamMembers[i].img}" alt="${teamMembers[i].firstName}">`;
        }
        if(teamMembers.length > limit) {
            avatarsHTML += `<div class="avatar-more">+${teamMembers.length - limit}</div>`;
        }
        
        card.innerHTML = `
            <div class="team-card-header">
                <div class="team-icon" style="background: ${team.bg}; color: var(--${team.colorClass});">
                    <i class="ph ${team.icon}"></i>
                </div>
                <h3>${team.name}</h3>
            </div>
            <p class="team-desc">${team.desc}</p>
            <div class="team-footer">
                <div class="avatar-group">
                    ${avatarsHTML}
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    // Update team options in select
    updateTeamSelects();
}

function updateTeamSelects() {
    const selects = document.querySelectorAll('.team-select-dropdown');
    selects.forEach(select => {
        // Keep first option
        const firstOption = select.options[0];
        select.innerHTML = '';
        select.appendChild(firstOption);
        
        appState.teams.forEach(team => {
            const opt = document.createElement('option');
            opt.value = team.id;
            opt.innerText = team.name;
            select.appendChild(opt);
        });
    });
}

// Side Panel Logic
function openTeamPanel(teamId) {
    const team = appState.teams.find(t => t.id === teamId);
    const members = appState.members.filter(m => m.teamId === teamId);
    
    document.getElementById('panel-team-name').innerText = team.name;
    document.getElementById('panel-team-icon').className = `ph ${team.icon}`;
    
    const iconContainer = document.getElementById('panel-icon-container');
    iconContainer.style.background = team.bg;
    iconContainer.style.color = `var(--${team.colorClass})`;
    
    renderPanelMembers(teamId);
    
    const panel = document.getElementById('team-side-panel');
    panel.classList.add('active');
}

function closeTeamPanel() {
    document.getElementById('team-side-panel').classList.remove('active');
}

function renderPanelMembers(teamId) {
    const membersList = document.getElementById('panel-members-list');
    membersList.innerHTML = '';
    
    const members = appState.members.filter(m => m.teamId === teamId);
    
    if(members.length === 0) {
        membersList.innerHTML = '<p style="color: var(--text-secondary); font-size: 14px; text-align: center; margin-top: 24px;">No members yet.</p>';
        return;
    }
    
    members.forEach(member => {
        const row = document.createElement('div');
        row.className = 'member-list-item';
        row.innerHTML = `
            <img src="${member.img}" alt="${member.firstName}">
            <div class="member-info">
                <h4>${member.firstName} ${member.lastName}</h4>
                <span>${member.email}</span>
            </div>
            <div class="member-role">${member.role}</div>
            <button class="member-delete-btn" onclick="deleteMember('${member.id}', '${teamId}')" data-tooltip="Remove">
                <i class="ph ph-trash"></i>
            </button>
        `;
        membersList.appendChild(row);
    });
}

function deleteMember(memberId, teamId) {
    appState.members = appState.members.filter(m => m.id !== memberId);
    renderPanelMembers(teamId); // Update panel
    renderTeams(); // Update main grid count
}

// Form Handlers
function handleCreateTeam(e) {
    e.preventDefault();
    const name = document.getElementById('ct-name').value;
    const icon = document.getElementById('ct-icon').value;
    const desc = document.getElementById('ct-desc').value;
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newTeam = {
        id: generateId(),
        name,
        icon: icon || 'ph-users',
        desc,
        colorClass: randomColor.class,
        bg: randomColor.bg
    };
    
    appState.teams.push(newTeam);
    finishFormProcess(e, 'create-team-modal', 'Team Created', () => {
        renderTeams();
    });
}

function handleAddMember(e) {
    e.preventDefault();
    const firstName = document.getElementById('am-first').value;
    const lastName = document.getElementById('am-last').value;
    const email = document.getElementById('am-email').value;
    const teamId = document.getElementById('am-team').value;
    const role = document.getElementById('am-role').value;
    
    // Pick random avatar for mock
    const randomAvatarId = Math.floor(Math.random() * 70);
    
    const newMember = {
        id: generateId(),
        firstName,
        lastName,
        email,
        teamId,
        role,
        img: `https://i.pravatar.cc/150?img=${randomAvatarId}`
    };
    
    appState.members.push(newMember);
    finishFormProcess(e, 'add-member-modal', 'Invited', () => {
        renderTeams();
        // If panel is open for this team, update it
        const panel = document.getElementById('team-side-panel');
        if(panel.classList.contains('active')) {
            // Find which team is open (could check icon/title, but let's just re-render current)
            renderPanelMembers(teamId); 
        }
    });
}

function finishFormProcess(e, modalId, successText, callback) {
    const form = e.target;
    const btn = form.querySelector('.btn-primary');
    const originalContent = btn.innerHTML;
    
    btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Processing...';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
        btn.innerHTML = `<i class="ph ph-check"></i> ${successText}`;
        btn.style.background = 'var(--accent-green)';
        btn.style.color = '#fff';
        
        setTimeout(() => {
            closeModal(modalId);
            callback();
            setTimeout(() => {
                form.reset();
                btn.innerHTML = originalContent;
                btn.style.background = '';
                btn.style.color = '';
                btn.style.pointerEvents = 'auto';
            }, 300);
        }, 1000);
    }, 800);
}

// Initial render
document.addEventListener("DOMContentLoaded", () => {
    if(document.getElementById('teams-grid')) {
        renderTeams();
        
        // Add form listeners
        document.getElementById('form-create-team').addEventListener('submit', handleCreateTeam);
        document.getElementById('form-add-member').addEventListener('submit', handleAddMember);
    }
});

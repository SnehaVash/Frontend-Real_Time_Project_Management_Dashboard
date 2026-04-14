// projects.js - Projects Management Hub

document.addEventListener("DOMContentLoaded", () => {
    renderProjects();
});

function renderProjects() {
    const grid = document.getElementById('active-projects-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    if (S.data.projects.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-secondary); font-size: 14px;">No active projects. Launch one!</p>';
        return;
    }
    
    S.data.projects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card team-card'; 
        card.style.cursor = 'pointer';
        card.onclick = () => openProjectPanel(p.id);
        
        let assignedTeam = S.data.teams.find(t => t.id === p.teamId);
        let teamBadge = assignedTeam ? `<div class="member-role" style="background:var(--${assignedTeam.colorClass}); color:#fff; display:inline-block; margin-bottom:16px;">${assignedTeam.name} Team</div>` : '';

        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div class="team-icon">
                    <i class="ph ph-kanban text-accent"></i>
                </div>
            </div>
            <h3 style="margin-top: 16px; font-size: 18px; font-weight: 600;">${p.name}</h3>
            ${teamBadge}
            <div class="progress-bar-wrap" style="margin-top: 16px;">
                <div class="progress-bar ${p.colorClass}" style="width: ${p.progress}%"></div>
            </div>
            <p style="font-size: 12px; color: var(--text-secondary); margin-top: 8px;">${p.progress}% Completed</p>
        `;
        grid.appendChild(card);
    });
}

window.openProjectPanel = function(id) {
    const proj = S.data.projects.find(p => p.id === id);
    if(!proj) return;
    
    // Bind Details
    document.getElementById('pp-name').innerText = proj.name;
    
    let assignedTeam = S.data.teams.find(t => t.id === proj.teamId);
    document.getElementById('pp-team').innerText = assignedTeam ? assignedTeam.name + ' Team' : 'Unassigned';
    
    document.getElementById('pp-progress-text').innerText = proj.progress + '%';
    const pbar = document.getElementById('pp-progress-bar');
    pbar.style.width = proj.progress + '%';
    pbar.className = 'progress-bar ' + proj.colorClass;
    
    document.getElementById('pp-start').innerText = proj.startDate || 'TBD';
    document.getElementById('pp-end').innerText = proj.endDate || 'TBD';
    
    document.getElementById('pp-delete-btn').onclick = () => {
        if (confirm("Are you sure you want to permanently delete this project?")) {
            S.addActivity('commit', 'ph-trash', `Project <strong>${proj.name}</strong> was deleted.`);
            S.data.projects = S.data.projects.filter(p => p.id !== proj.id);
            S.save();
            closeProjectPanel();
            renderProjects();
        }
    };
    
    // Add ClickUp Board Hook
    let boardBtn = document.getElementById('pp-board-btn');
    if (!boardBtn) {
        boardBtn = document.createElement('a');
        boardBtn.id = 'pp-board-btn';
        boardBtn.className = 'btn-primary';
        boardBtn.style.cssText = 'width: 100%; justify-content: center; margin-bottom: 16px; text-decoration: none;';
        boardBtn.innerHTML = '<i class="ph ph-kanban"></i> Open Task Board';
        document.getElementById('pp-delete-btn').parentNode.insertBefore(boardBtn, document.getElementById('pp-delete-btn'));
    }
    boardBtn.href = 'project-board.html?id=' + proj.id;

    document.getElementById('project-side-panel').classList.add('active');
}

window.closeProjectPanel = function() {
    const panel = document.getElementById('project-side-panel');
    if(panel) panel.classList.remove('active');
}

// board.js - ClickUp Style Kanban Logic

let currentProjectId = null;

document.addEventListener("DOMContentLoaded", () => {
    // Get Project ID from URL ?id=p1
    const params = new URLSearchParams(window.location.search);
    currentProjectId = params.get('id');
    
    if(!currentProjectId) {
        document.getElementById('board-title').innerText = "All Tasks";
    } else {
        const proj = S.data.projects.find(p => p.id === currentProjectId);
        if(proj) document.getElementById('board-title').innerText = proj.name + " Tasks";
    }
    
    renderBoard();
});

function renderBoard() {
    const cols = {
        'todo': document.getElementById('col-todo'),
        'in-progress': document.getElementById('col-in-progress'),
        'review': document.getElementById('col-review'),
        'done': document.getElementById('col-done')
    };
    
    // Clear all
    Object.values(cols).forEach(col => col.innerHTML = '');
    
    let tasksToRender = S.data.tasks;
    if (currentProjectId) {
        tasksToRender = tasksToRender.filter(t => t.projectId === currentProjectId);
    }
    
    // Update Counts
    let counts = { 'todo': 0, 'in-progress': 0, 'review': 0, 'done': 0 };
    
    tasksToRender.forEach(task => {
        counts[task.status]++;
        
        let assigneeObj = S.data.members.find(m => m.id === task.assignee);
        let avatarStr = assigneeObj ? `<img src="${assigneeObj.img}" title="${assigneeObj.firstName}">` : `<div style="width:24px; height:24px; border-radius:50%; border:1px dashed #666;"></div>`;
        
        const card = document.createElement('div');
        card.className = 'task-card';
        card.innerHTML = `
            <h4>${task.title}</h4>
            <div class="task-footer">
                <div class="task-assignee">
                    ${avatarStr}
                </div>
                <div class="move-actions">
                    ${task.status !== 'todo' ? `<button class="move-btn" onclick="moveTask('${task.id}', getPrevStatus('${task.status}'))"><i class="ph ph-caret-left"></i></button>` : ''}
                    ${task.status !== 'done' ? `<button class="move-btn" onclick="moveTask('${task.id}', getNextStatus('${task.status}'))"><i class="ph ph-caret-right"></i></button>` : ''}
                </div>
            </div>
        `;
        
        if(cols[task.status]) {
            cols[task.status].appendChild(card);
        }
    });
    
    document.getElementById('count-todo').innerText = counts['todo'];
    document.getElementById('count-in-progress').innerText = counts['in-progress'];
    document.getElementById('count-review').innerText = counts['review'];
    document.getElementById('count-done').innerText = counts['done'];
}

function getNextStatus(s) {
    if(s === 'todo') return 'in-progress';
    if(s === 'in-progress') return 'review';
    if(s === 'review') return 'done';
    return s;
}

function getPrevStatus(s) {
    if(s === 'done') return 'review';
    if(s === 'review') return 'in-progress';
    if(s === 'in-progress') return 'todo';
    return s;
}

window.moveTask = function(taskId, newStatus) {
    const task = S.data.tasks.find(t => t.id === taskId);
    if(task) {
        task.status = newStatus;
        S.save();
        renderBoard();
        S.addActivity('status', 'ph-arrows-left-right', `Task moved to <strong>${newStatus}</strong>`);
    }
}

window.promptNewTask = function(status) {
    document.getElementById('new-task-status').value = status;
    document.getElementById('new-task-title').value = '';
    
    const m = document.getElementById('task-modal');
    m.classList.add('active');
    setTimeout(() => {
        m.querySelector('.side-panel-content').style.transform = 'translate(-50%, 0) scale(1)';
        m.querySelector('.side-panel-content').style.opacity = '1';
    }, 10);
}

window.closeTaskModal = function() {
    const m = document.getElementById('task-modal');
    m.querySelector('.side-panel-content').style.transform = 'translate(-50%, translateY(20px)) scale(0.95)';
    setTimeout(() => m.classList.remove('active'), 300);
}

window.saveTask = function() {
    const title = document.getElementById('new-task-title').value;
    const status = document.getElementById('new-task-status').value;
    if(!title) return;
    
    S.data.tasks.push({
        id: S.generateId(),
        projectId: currentProjectId || 'p1',
        title: title,
        status: status,
        assignee: null
    });
    
    S.save();
    closeTaskModal();
    renderBoard();
    S.addActivity('commit', 'ph-plus', `Task <strong>${title}</strong> created.`);
}

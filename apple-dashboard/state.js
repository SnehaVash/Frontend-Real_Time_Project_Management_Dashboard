// state.js
// Universal State Management for ProSpace Dashboard

const DB_KEY = 'rtpm_db_v2';

const defaultState = {
    teams: [
        { id: 'eng', name: 'Engineering', icon: 'ph-code', colorClass: 'accent-blue', bg: 'rgba(41, 151, 255, 0.1)', desc: 'Core architecture, web, and mobile app development.' },
        { id: 'design', name: 'Product Design', icon: 'ph-bezier-curve', colorClass: 'accent-purple', bg: 'rgba(191, 90, 242, 0.1)', desc: 'UI/UX, user research, and branding operations.' },
        { id: 'marketing', name: 'Marketing', icon: 'ph-megaphone', colorClass: 'accent-orange', bg: 'rgba(255, 159, 10, 0.1)', desc: 'Growth, campaigns, and content strategy.' }
    ],
    members: [
        { id: 'm1', firstName: 'Jane', lastName: 'Doe', email: 'jane@prospace.com', teamId: 'eng', role: 'admin', img: 'https://i.pravatar.cc/150?img=11' },
        { id: 'm2', firstName: 'John', lastName: 'Smith', email: 'john@prospace.com', teamId: 'eng', role: 'member', img: 'https://i.pravatar.cc/150?img=33' },
        { id: 'm3', firstName: 'Sarah', lastName: 'Chen', email: 'sarah@prospace.com', teamId: 'eng', role: 'member', img: 'https://i.pravatar.cc/150?img=47' },
        { id: 'm6', firstName: 'Taylor', lastName: 'Kim', email: 'taylor@prospace.com', teamId: 'design', role: 'admin', img: 'https://i.pravatar.cc/150?img=44' },
        { id: 'm8', firstName: 'Sam', lastName: 'Brooks', email: 'sam@prospace.com', teamId: 'marketing', role: 'admin', img: 'https://i.pravatar.cc/150?img=22' }
    ],
    projects: [
        { id: 'p1', name: 'Vision Pro Integration', progress: 85, colorClass: 'gradient-blue', startDate: '2024-10-01', endDate: '2024-12-01', teamId: 'eng' },
        { id: 'p2', name: 'Core Architecture Refactor', progress: 45, colorClass: 'gradient-purple', startDate: '2024-09-15', endDate: '2025-01-15', teamId: 'eng' },
        { id: 'p3', name: 'AI Agent Dashboard', progress: 20, colorClass: 'gradient-orange', startDate: '2024-10-20', endDate: '2024-11-30', teamId: 'design' },
        { id: 'p4', name: 'Marketing Site Refresh', progress: 95, colorClass: 'gradient-green', startDate: '2024-08-01', endDate: '2024-10-25', teamId: 'marketing' }
    ],
    activities: [
        { id: 'a1', type: 'commit', icon: 'ph-git-commit', html: '<strong>Sarah Chen</strong> pushed to main <strong>Authentication Flow</strong>', time: Date.now() - 120000 },
        { id: 'a2', type: 'comment', icon: 'ph-chat-circle-text', html: '<strong>Jordan Lee</strong> commented on <strong>Design System Review</strong>', time: Date.now() - 600000 },
        { id: 'a3', type: 'status', icon: 'ph-check-circle', html: '<strong>Alex Rivera</strong> completed task <strong>API Limiting</strong>', time: Date.now() - 3600000 }
    ],
    tasks: [
        { id: 't1', projectId: 'p1', title: 'Design Database Schema', status: 'done', assignee: 'm1' },
        { id: 't2', projectId: 'p1', title: 'Implement Auth Flow', status: 'in-progress', assignee: 'm2' },
        { id: 't3', projectId: 'p1', title: 'Write API Documentation', status: 'review', assignee: 'm3' },
        { id: 't4', projectId: 'p1', title: 'Setup CI/CD Pipeline', status: 'todo', assignee: 'm4' },
        { id: 't5', projectId: 'p1', title: 'Containerize Application', status: 'todo', assignee: null },
        { id: 't6', projectId: 'p2', title: 'Refactor State Management', status: 'in-progress', assignee: 'm5' },
        { id: 't7', projectId: 'p3', title: 'Create Wireframes', status: 'review', assignee: 'm6' },
        { id: 't8', projectId: 'p4', title: 'Draft Marketing Copy', status: 'done', assignee: 'm7' }
    ],
    notifications: [
        { id: 'n1', title: 'System Update', message: 'Main database optimization complete.', read: false, time: Date.now() - 50000 },
        { id: 'n2', title: 'New Comment', message: 'Jane replied to your thread in Core Architecture.', read: false, time: Date.now() - 100000 }
    ],
    settings: {
        pushNotifications: true,
        darkMode: true,
        meshGradient: true
    }
};

window.S = {
    data: {},
    init: function() {
        const stored = localStorage.getItem(DB_KEY);
        if (stored) {
            this.data = JSON.parse(stored);
            if(!this.data.settings) this.data.settings = { pushNotifications: true, darkMode: true, meshGradient: true };
        } else {
            this.data = JSON.parse(JSON.stringify(defaultState));
            this.save();
        }
        this.enforceSettings();
    },
    enforceSettings: function() {
        // Enforce mesh gradient
        if (this.data.settings.meshGradient) {
            document.body.style.animation = 'gradientFlow 20s ease infinite';
        } else {
            document.body.style.animation = 'none';
        }
        
        // Enforce dark mode
        if (!this.data.settings.darkMode) {
            // Primitive light mode swap logic wrapper
            document.documentElement.style.setProperty('--bg-dark', '#f5f5f7');
            document.documentElement.style.setProperty('--gray-900', '#ffffff');
            document.documentElement.style.setProperty('--text-primary', '#111');
            document.documentElement.style.setProperty('--text-secondary', '#666');
            document.body.style.background = '#f5f5f7'; // disable gradient for light mode
        }
        
        // Enforce notifications UI
        setTimeout(() => {
            const notifWrapper = document.querySelector('.notification-wrapper');
            if (notifWrapper) {
                notifWrapper.style.display = this.data.settings.pushNotifications ? 'inline-block' : 'none';
            }
        }, 100);
    },
    save: function() {
        localStorage.setItem(DB_KEY, JSON.stringify(this.data));
    },
    
    // API
    addActivity: function(type, icon, html) {
        this.data.activities.unshift({
            id: 'a_' + Date.now(),
            type, icon, html,
            time: Date.now()
        });
        // keep only latest 20
        if(this.data.activities.length > 20) this.data.activities.pop();
        this.save();
    },
    addNotification: function(title, message) {
        this.data.notifications.unshift({
            id: 'n_' + Date.now(),
            title, message,
            read: false,
            time: Date.now()
        });
        this.save();
    },
    getUnreadNotifs: function() {
        return this.data.notifications.filter(n => !n.read).length;
    },
    markAllRead: function() {
        this.data.notifications.forEach(n => n.read = true);
        this.save();
    },
    generateId: function() {
        return Math.random().toString(36).substr(2, 9);
    },
    timeAgo: function(ms) {
        const diff = Math.floor((Date.now() - ms) / 1000);
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
        return `${Math.floor(diff/86400)}d ago`;
    }
};

// Initialize on load
S.init();

// Global Profile Modal Injection
window.openProfileModal = function() {
    let modal = document.getElementById('global-profile-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'global-profile-modal';
        modal.className = 'profile-modal';
        modal.innerHTML = `
            <div class="profile-modal-header">
                <img src="https://i.pravatar.cc/150?img=11" alt="Session User">
                <div>
                    <h3>Administrator</h3>
                    <p>admin@rtpm.com</p>
                </div>
            </div>
            <div class="profile-stats">
                <div class="profile-stat-box">
                    <div class="count">${S.data.projects.length}</div>
                    <div class="label">Projects</div>
                </div>
                <div class="profile-stat-box">
                    <div class="count">${S.data.teams.length}</div>
                    <div class="label">Teams</div>
                </div>
                <div class="profile-stat-box">
                    <div class="count">${S.data.members.length}</div>
                    <div class="label">Members</div>
                </div>
            </div>
            <button class="btn-secondary" style="width: 100%; justify-content: center;" onclick="document.getElementById('global-profile-modal').classList.remove('active')">Close</button>
        `;
        document.body.appendChild(modal);
    }
    
    // Toggle
    if (modal.classList.contains('active')) {
        modal.classList.remove('active');
    } else {
        modal.classList.add('active');
    }
}


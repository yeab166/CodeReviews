// ==========================================
// REGISTRATION REPORT PAGE SCRIPT
// ==========================================

// Get current student from session
let currentStudent = JSON.parse(sessionStorage.getItem('currentStudent'));

// Redirect if not logged in
if (!currentStudent) {
    alert('Please login first!');
    window.location.href = 'index.html';
}

// Get courses from data.js
const courses = getAllCourses();

// ==========================================
// INITIALIZATION
// ==========================================

function initializeReport() {
    console.log('📄 Generating report for:', currentStudent.name);
    
    // Display student information
    document.getElementById('studentName').textContent = currentStudent.name;
    document.getElementById('studentId').textContent = currentStudent.id;
    
    // Display registered courses
    displayRegisteredCourses();
    
    // Display prerequisites
    displayPrerequisites();
    
    // Display summary
    displaySummary();
    
    // Display registration date
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById('registrationDate').textContent = dateString;
}

// ==========================================
// DISPLAY FUNCTIONS
// ==========================================

function displayRegisteredCourses() {
    const container = document.getElementById('coursesTableContainer');
    const registeredCourses = courses.filter(c => 
        currentStudent.registeredCourses.includes(c.id)
    );
    
    if (registeredCourses.length === 0) {
        container.innerHTML = '<div class="no-courses">No courses registered yet</div>';
        return;
    }
    
    const totalCredits = registeredCourses.reduce((sum, course) => sum + course.credits, 0);
    const statusClass = totalCredits <= 19 ? 'status-ok' : 'status-exceeded';
    const statusText = totalCredits <= 19 ? '✓ Within Limit' : '⚠ Exceeds Limit';
    
    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Credits</th>
                    <th>Year</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${registeredCourses.map((course, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${course.code}</td>
                        <td>${course.name}</td>
                        <td>${course.credits}</td>
                        <td>${course.year}</td>
                        <td>
                            <div class="status-cell">
                                <span>✅</span>
                                <span>Registered</span>
                            </div>
                        </td>
                    </tr>
                `).join('')}
                <tr class="total-row">
                    <td colspan="3" style="text-align: right;"><strong>Total Credit Hours:</strong></td>
                    <td><strong>${totalCredits}</strong></td>
                    <td colspan="2" class="${statusClass}"><strong>${statusText}</strong></td>
                </tr>
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

function displayPrerequisites() {
    const container = document.getElementById('prerequisitesContainer');
    
    const badgesHTML = currentStudent.completedCourses.map(course => `
        <span class="prerequisite-badge">
            <span>✅</span>
            <span>${course}</span>
        </span>
    `).join('');
    
    container.innerHTML = `
        <div class="prerequisites-list">
            ${badgesHTML}
        </div>
    `;
}

function displaySummary() {
    const registeredCourses = courses.filter(c => 
        currentStudent.registeredCourses.includes(c.id)
    );
    const totalCredits = registeredCourses.reduce((sum, course) => sum + course.credits, 0);
    
    document.getElementById('totalCourses').textContent = registeredCourses.length;
    document.getElementById('totalCredits').textContent = `${totalCredits}`;
    
    // Display credit status
    const creditStatusElement = document.getElementById('creditStatus');
    if (totalCredits >= 15 && totalCredits <= 19) {
        creditStatusElement.innerHTML = '• Credit Status: <strong class="status-confirmed">✓ Meets Requirements</strong>';
    } else if (totalCredits < 15) {
        creditStatusElement.innerHTML = '• Credit Status: <strong style="color: #dc2626;">⚠ Below Minimum (Need ' + (15 - totalCredits) + ' more credits)</strong>';
    } else {
        creditStatusElement.innerHTML = '• Credit Status: <strong style="color: #dc2626;">⚠ Exceeds Maximum</strong>';
    }
}

// ==========================================
// EVENT LISTENERS
// ==========================================

document.getElementById('backBtn').addEventListener('click', function() {
    window.location.href = 'registration.html';
});

document.getElementById('printBtn').addEventListener('click', function() {
    window.print();
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('currentStudent');
        console.log('👋 Logged out');
        window.location.href = 'index.html';
    }
});

// ==========================================
// INITIALIZE REPORT
// ==========================================

initializeReport();
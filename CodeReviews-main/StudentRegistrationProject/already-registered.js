// ==========================================
// ALREADY REGISTERED PAGE SCRIPT
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

function initializePage() {
    console.log('✅ Student has already registered:', currentStudent.name);
    
    // Display student information
    document.getElementById('studentName').textContent = currentStudent.name;
    document.getElementById('studentId').textContent = currentStudent.id;
    
    // Display registered courses
    displayRegisteredCourses();
    
    // Display completed prerequisites
    displayCompletedCourses();
    
    // Display summary
    displaySummary();
}

// ==========================================
// DISPLAY FUNCTIONS
// ==========================================

function displayRegisteredCourses() {
    const container = document.getElementById('registeredCoursesList');
    const registeredCourses = courses.filter(c => 
        currentStudent.registeredCourses.includes(c.id)
    );
    
    if (registeredCourses.length === 0) {
        container.innerHTML = '<p style="color: #9ca3af; text-align: center; padding: 20px;">No courses registered.</p>';
        return;
    }
    
    container.innerHTML = registeredCourses.map(course => {
        return `
            <div class="registered-course">
                <div class="registered-course-info">
                    <span class="check-icon">✅</span>
                    <div class="registered-course-details">
                        <h3>${course.code} - ${course.name}</h3>
                        <p>Year ${course.year} | Semester ${course.semester}</p>
                    </div>
                </div>
                <span class="credit-badge">${course.credits} Credits</span>
            </div>
        `;
    }).join('');
}

function displayCompletedCourses() {
    const container = document.getElementById('completedCourses');
    
    if (currentStudent.completedCourses.length === 0) {
        container.innerHTML = '<p style="color: #9ca3af; font-size: 14px;">No prerequisites completed.</p>';
        return;
    }
    
    container.innerHTML = currentStudent.completedCourses.map(course => {
        return `
            <span class="prerequisite-badge">
                <span>✅</span>
                <span>${course}</span>
            </span>
        `;
    }).join('');
}

function displaySummary() {
    const registeredCourses = courses.filter(c => 
        currentStudent.registeredCourses.includes(c.id)
    );
    const totalCredits = registeredCourses.reduce((sum, course) => sum + course.credits, 0);
    
    document.getElementById('totalCourses').textContent = registeredCourses.length;
    document.getElementById('totalCredits').textContent = totalCredits;
}

// ==========================================
// EVENT LISTENERS
// ==========================================

document.getElementById('viewReportBtn').addEventListener('click', function() {
    window.location.href = 'report.html';
});

document.getElementById('printReportBtn').addEventListener('click', function() {
    window.location.href = 'report.html';
    setTimeout(() => {
        window.print();
    }, 500);
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('currentStudent');
        console.log('👋 Logged out');
        window.location.href = 'index.html';
    }
});

// ==========================================
// INITIALIZE PAGE
// ==========================================

initializePage();

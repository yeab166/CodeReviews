// ==========================================
// COURSE REGISTRATION PAGE SCRIPT
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

// Minimum credit hours required
const MINIMUM_CREDITS = 15;
const MAXIMUM_CREDITS = 19;

// Total number of prerequisite courses
const TOTAL_PREREQUISITES = 4;

// ==========================================
// INITIALIZATION
// ==========================================

function initializePage() {
    console.log('📋 Loading registration page for:', currentStudent.name);
    console.log('📝 Completed Courses:', currentStudent.completedCourses.length, '/', TOTAL_PREREQUISITES);
    
    // Display student name
    document.getElementById('studentName').textContent = `Welcome, ${currentStudent.name} (${currentStudent.id})`;
    
    // Display completed courses
    displayCompletedCourses();
    
    // Check if student passed all prerequisites or failed at least one
    const passedAllPrerequisites = currentStudent.completedCourses.length === TOTAL_PREREQUISITES;
    
    if (passedAllPrerequisites) {
        // Student passed all 4 prerequisites - Show ONLY Year 3 courses
        console.log('✅ Student passed all prerequisites - Showing Year 3 courses only');
        displayCoursesByYear(3, 'year3Courses');
        document.getElementById('year4Section').style.display = 'none';
        document.getElementById('year5Section').style.display = 'none';
    } else {
        // Student failed at least one prerequisite - Show Year 3, 4, and 5 courses
        console.log('⚠️ Student failed at least one prerequisite - Showing all year courses');
        displayCoursesByYear(3, 'year3Courses');
        displayCoursesByYear(4, 'year4Courses');
        displayCoursesByYear(5, 'year5Courses');
        document.getElementById('year4Section').style.display = 'block';
        document.getElementById('year5Section').style.display = 'block';
    }
    
    // Update credit display
    updateCreditDisplay();
    
    // Display registered courses
    displayRegisteredCourses();
    
    // Check minimum credit requirement
    checkMinimumCreditRequirement();
}

// ==========================================
// CREDIT CALCULATION
// ==========================================

function getTotalCredits() {
    return currentStudent.registeredCourses.reduce((total, courseId) => {
        const course = getCourseById(courseId);
        return total + (course ? course.credits : 0);
    }, 0);
}

function updateCreditDisplay() {
    const totalCredits = getTotalCredits();
    const creditDisplay = document.getElementById('creditDisplay');
    const creditCounter = document.getElementById('creditCounter');
    
    creditDisplay.textContent = `${totalCredits} / ${MAXIMUM_CREDITS} (Min: ${MINIMUM_CREDITS})`;
    
    if (totalCredits > MAXIMUM_CREDITS) {
        creditCounter.classList.add('exceeded');
    } else {
        creditCounter.classList.remove('exceeded');
    }
}

function checkMinimumCreditRequirement() {
    const totalCredits = getTotalCredits();
    const warningCard = document.getElementById('minimumCreditWarning');
    const currentCreditsWarning = document.getElementById('currentCreditsWarning');
    
    if (totalCredits < MINIMUM_CREDITS) {
        warningCard.style.display = 'block';
        currentCreditsWarning.textContent = totalCredits;
    } else {
        warningCard.style.display = 'none';
    }
}

// ==========================================
// COURSE REGISTRATION VALIDATION
// ==========================================

function canRegisterCourse(course) {
    // Check if already registered
    if (currentStudent.registeredCourses.includes(course.id)) {
        return { canRegister: false, reason: 'Already registered' };
    }
    
    // Check prerequisite
    if (course.prerequisite && !currentStudent.completedCourses.includes(course.prerequisite)) {
        return { canRegister: false, reason: `Prerequisite not met: ${course.prerequisite}` };
    }
    
    // Check credit limit
    const newTotal = getTotalCredits() + course.credits;
    if (newTotal > MAXIMUM_CREDITS) {
        return { canRegister: false, reason: `Would exceed ${MAXIMUM_CREDITS} credit limit (would be ${newTotal})` };
    }
    
    return { canRegister: true };
}

// ==========================================
// ADD/DROP COURSE FUNCTIONS
// ==========================================

function addCourse(courseId) {
    const course = getCourseById(courseId);
    if (!course) {
        console.error('❌ Course not found:', courseId);
        return;
    }
    
    const { canRegister, reason } = canRegisterCourse(course);
    
    if (canRegister) {
        currentStudent.registeredCourses.push(courseId);
        updateStudentData();
        showNotification(`✅ Successfully added ${course.name}`, 'success');
        console.log('✅ Course added:', course.name);
        refreshPage();
    } else {
        showNotification(`❌ ${reason}`, 'error');
        console.log('❌ Cannot add course:', reason);
    }
}

function dropCourse(courseId) {
    const course = getCourseById(courseId);
    const totalCredits = getTotalCredits();
    const courseCredits = course.credits;
    const newTotal = totalCredits - courseCredits;
    
    // Warn if dropping would go below minimum
    if (currentStudent.registeredCourses.length > 1 && newTotal < MINIMUM_CREDITS) {
        if (!confirm(`Warning: Dropping this course will bring your total to ${newTotal} credits, which is below the minimum of ${MINIMUM_CREDITS} credits. Are you sure?`)) {
            return;
        }
    }
    
    currentStudent.registeredCourses = currentStudent.registeredCourses.filter(id => id !== courseId);
    updateStudentData();
    showNotification(`✅ Successfully dropped ${course.name}`, 'success');
    console.log('✅ Course dropped:', course.name);
    refreshPage();
}

// ==========================================
// DATA PERSISTENCE
// ==========================================

function updateStudentData() {
    // Update session storage
    sessionStorage.setItem('currentStudent', JSON.stringify(currentStudent));
    
    // Update localStorage using data.js function
    updateStudent(currentStudent.id, currentStudent);
    
    console.log('💾 Student data saved');
}

// ==========================================
// UI FUNCTIONS
// ==========================================

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    const icon = type === 'success' ? '✅' : '❌';
    
    notification.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    notification.className = `notification ${type}`;
    notification.style.display = 'flex';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function displayCoursesByYear(year, containerId) {
    const container = document.getElementById(containerId);
    const yearCourses = getCoursesByYear(year);
    
    if (yearCourses.length === 0) {
        container.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 20px;">No courses available for this year.</p>';
        return;
    }
    
    container.innerHTML = yearCourses.map(course => {
        const { canRegister, reason } = canRegisterCourse(course);
        const isRegistered = currentStudent.registeredCourses.includes(course.id);
        const prerequisiteMet = !course.prerequisite || currentStudent.completedCourses.includes(course.prerequisite);
        
        let cardClass = 'course-card';
        if (isRegistered) cardClass += ' registered';
        else if (!canRegister) cardClass += ' unavailable';
        
        return `
            <div class="${cardClass}">
                <div class="course-header">
                    <div class="course-info">
                        <h3>${course.code}</h3>
                        <p>${course.name}</p>
                    </div>
                    <span class="credit-badge">${course.credits} Credits</span>
                </div>
                
                ${course.prerequisite ? `
                    <div class="prerequisite ${prerequisiteMet ? 'met' : 'not-met'}">
                        <span>${prerequisiteMet ? '✅' : '⚠️'}</span>
                        <span>Prerequisite: ${course.prerequisite}</span>
                    </div>
                ` : '<div style="height: 35px;"></div>'}
                
                ${isRegistered ? `
                    <button class="btn-danger" onclick="dropCourse('${course.id}')">
                        Drop Course
                    </button>
                ` : `
                    <button 
                        class="${canRegister ? 'btn-primary' : ''}" 
                        onclick="addCourse('${course.id}')"
                        ${!canRegister ? 'disabled' : ''}
                    >
                        ${canRegister ? 'Add Course' : reason}
                    </button>
                `}
            </div>
        `;
    }).join('');
}

function displayRegisteredCourses() {
    const section = document.getElementById('registeredCoursesSection');
    const container = document.getElementById('registeredCoursesList');
    const count = document.getElementById('registeredCount');
    
    if (currentStudent.registeredCourses.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    count.textContent = currentStudent.registeredCourses.length;
    
    container.innerHTML = currentStudent.registeredCourses.map(courseId => {
        const course = getCourseById(courseId);
        if (!course) return '';
        
        return `
            <div class="registered-course">
                <div class="registered-course-info">
                    <span class="check-icon">✅</span>
                    <div class="registered-course-details">
                        <h3>${course.code} - ${course.name}</h3>
                        <p>${course.credits} Credits | Year ${course.year}</p>
                    </div>
                </div>
                <button class="btn btn-danger" onclick="dropCourse('${course.id}')">
                    Drop
                </button>
            </div>
        `;
    }).join('');
}

function displayCompletedCourses() {
    const container = document.getElementById('completedCourses');
    
    if (currentStudent.completedCourses.length === 0) {
        container.innerHTML = '<p style="color: #9ca3af; font-size: 14px;">No prerequisites completed yet.</p>';
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

function refreshPage() {
    const passedAllPrerequisites = currentStudent.completedCourses.length === TOTAL_PREREQUISITES;
    
    displayCoursesByYear(3, 'year3Courses');
    
    if (!passedAllPrerequisites) {
        displayCoursesByYear(4, 'year4Courses');
        displayCoursesByYear(5, 'year5Courses');
    }
    
    updateCreditDisplay();
    displayRegisteredCourses();
    checkMinimumCreditRequirement();
}

// ==========================================
// EVENT LISTENERS
// ==========================================

document.getElementById('viewReportBtn').addEventListener('click', function() {
    const totalCredits = getTotalCredits();
    
    if (totalCredits < MINIMUM_CREDITS) {
        alert(`You must register for at least ${MINIMUM_CREDITS} credit hours before viewing your report.\nCurrent credits: ${totalCredits}`);
        return;
    }
    
    window.location.href = 'report.html';
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    const totalCredits = getTotalCredits();
    
    let message = 'Are you sure you want to logout?';
    if (totalCredits > 0 && totalCredits < MINIMUM_CREDITS) {
        message = `Warning: You have only registered for ${totalCredits} credits (minimum is ${MINIMUM_CREDITS}). Your registration is incomplete.\n\nAre you sure you want to logout?`;
    }
    
    if (confirm(message)) {
        sessionStorage.removeItem('currentStudent');
        console.log('👋 Logged out');
        window.location.href = 'index.html';
    }
});

// ==========================================
// INITIALIZE PAGE
// ==========================================

initializePage();

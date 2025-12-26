// ==========================================
// LOGIN PAGE SCRIPT
// ==========================================

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const studentId = document.getElementById('studentId').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');
    
    // Authenticate student using data.js function
    const student = authenticateStudent(studentId, password);
    
    if (student) {
        // Store current student in session
        sessionStorage.setItem('currentStudent', JSON.stringify(student));
        
        // Show success message
        console.log('✅ Login successful:', student.name);
        
        // Check if student has already registered
        if (student.registeredCourses && student.registeredCourses.length > 0) {
            // Student already registered - redirect to already registered page
            console.log('⚠️ Student has already registered');
            window.location.href = 'already-registered.html';
        } else {
            // New registration - redirect to registration page
            window.location.href = 'registration.html';
        }
    } else {
        // Show error message
        errorMessage.textContent = 'Invalid student ID or password';
        errorMessage.style.display = 'block';
        console.log('❌ Login failed');
    }
});

// Clear error message when user starts typing
document.getElementById('studentId').addEventListener('input', function() {
    document.getElementById('errorMessage').style.display = 'none';
});

document.getElementById('password').addEventListener('input', function() {
    document.getElementById('errorMessage').style.display = 'none';
});

// Log available accounts on page load
console.log('='.repeat(50));
console.log('📚 STUDENT REGISTRATION SYSTEM');
console.log('='.repeat(50));
console.log('Available demo accounts:');
const students = getAllStudents();
students.forEach(student => {
    console.log(`ID: ${student.id} | Password: ${student.password} | Name: ${student.name}`);
});
console.log('='.repeat(50));
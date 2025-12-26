// ==========================================
// STUDENT DATABASE
// ==========================================
// This acts as our backend database stored locally

const STUDENTS_DATABASE = [
    {
        id: 'SE2001',
        password: 'pass123',
        name: 'John Doe',
        completedCourses: ['C++', 'Database', 'Digital Logic Design'],
        registeredCourses: []
    },
    {
        id: 'SE2002',
        password: 'pass456',
        name: 'Jane Smith',
        completedCourses: ['C++', 'Data Communication and Networks'],
        registeredCourses: []
    },
    {
        id: 'SE2003',
        password: 'pass789',
        name: 'Mike Johnson',
        completedCourses: ['Database', 'Digital Logic Design', 'Data Communication and Networks'],
        registeredCourses: []
    },
    {
        id: 'SE2004',
        password: 'pass098',
        name: 'Yitbarek Yonas',
        completedCourses: ['Database', 'Digital Logic Design', 'Data Communication and Networks', 'C++'],
        registeredCourses: []
    },{
        id: 'SE2005',
        password: 'pass000',
        name: 'Yisak Asrat',
        completedCourses: ['Database', 'Digital Logic Design', 'Data Communication and Networks', 'C++'],
        registeredCourses: []
    }
];

// ==========================================
// COURSES DATABASE
// ==========================================

const COURSES_DATABASE = [
    // ========== 3rd Year Courses ==========
    {
        id: '1',
        code: 'CSE301',
        name: 'Object Oriented Programming',
        credits: 3,
        prerequisite: 'C++',
        year: 3,
        semester: 1
    },
    {
        id: '2',
        code: 'CSE302',
        name: 'Data Structure and Algorithms',
        credits: 4,
        prerequisite: 'C++',
        year: 3,
        semester: 1
    },
    {
        id: '3',
        code: 'CSE303',
        name: 'System Analysis and Modeling',
        credits: 3,
        prerequisite: 'Database',
        year: 3,
        semester: 1
    },
    {
        id: '4',
        code: 'CSE304',
        name: 'Computer Architecture and Organization',
        credits: 3,
        prerequisite: 'Digital Logic Design',
        year: 3,
        semester: 1
    },
    {
        id: '5',
        code: 'CSE305',
        name: 'Internet Programming I',
        credits: 3,
        prerequisite: 'Data Communication and Networks',
        year: 3,
        semester: 1
    },
    
    // ========== 4th Year Courses (Hidden from students) ==========
    {
        id: '6',
        code: 'CSE401',
        name: 'Software Engineering',
        credits: 3,
        prerequisite: null,
        year: 4,
        semester: 1
    },
    {
        id: '7',
        code: 'CSE402',
        name: 'Artificial Intelligence',
        credits: 4,
        prerequisite: null,
        year: 4,
        semester: 1
    },
    {
        id: '8',
        code: 'CSE403',
        name: 'Machine Learning Fundamentals',
        credits: 3,
        prerequisite: null,
        year: 4,
        semester: 1
    },
    
    // ========== 5th Year Courses (Hidden from students) ==========
    {
        id: '9',
        code: 'CSE501',
        name: 'Distributed Systems',
        credits: 3,
        prerequisite: null,
        year: 5,
        semester: 1
    },
    {
        id: '10',
        code: 'CSE502',
        name: 'Cyber Security',
        credits: 3,
        prerequisite: null,
        year: 5,
        semester: 1
    }
];

// ==========================================
// DATABASE VERSION CONTROL
// ==========================================
// This system automatically detects changes to STUDENTS_DATABASE
// No need to manually increment version - just add students and refresh!

const DATABASE_VERSION = 2; // For reference only

// ==========================================
// DATABASE INITIALIZATION
// ==========================================
// Initialize localStorage with data when the page loads

function initializeDatabase() {
    const storedData = localStorage.getItem('studentsData');
    
    // Check if localStorage has data
    if (!storedData) {
        // No data in localStorage - first time load
        console.log('🔄 First time initialization - Loading data from source...');
        localStorage.setItem('studentsData', JSON.stringify(STUDENTS_DATABASE));
        console.log('✅ Database initialized with ' + STUDENTS_DATABASE.length + ' students');
        logAllStudents();
        return;
    }
    
    // Parse stored data
    const storedStudents = JSON.parse(storedData);
    
    // Compare stored data with source data
    const sourceCount = STUDENTS_DATABASE.length;
    const storedCount = storedStudents.length;
    
    // Check if student count changed
    if (sourceCount !== storedCount) {
        console.log('🔄 Student count changed (' + storedCount + ' → ' + sourceCount + ') - Reloading...');
        localStorage.setItem('studentsData', JSON.stringify(STUDENTS_DATABASE));
        console.log('✅ Database reloaded with ' + STUDENTS_DATABASE.length + ' students');
        logAllStudents();
        return;
    }
    
    // Check if any student IDs changed
    const sourceIds = STUDENTS_DATABASE.map(s => s.id).sort().join(',');
    const storedIds = storedStudents.map(s => s.id).sort().join(',');
    
    if (sourceIds !== storedIds) {
        console.log('🔄 Student IDs changed - Reloading from source...');
        localStorage.setItem('studentsData', JSON.stringify(STUDENTS_DATABASE));
        console.log('✅ Database reloaded with ' + STUDENTS_DATABASE.length + ' students');
        logAllStudents();
        return;
    }
    
    // Check if any student data changed (name, password, completedCourses)
    // We need to check if source data has changes to base student info
    for (let i = 0; i < STUDENTS_DATABASE.length; i++) {
        const sourceStudent = STUDENTS_DATABASE[i];
        const storedStudent = storedStudents.find(s => s.id === sourceStudent.id);
        
        if (!storedStudent) {
            console.log('🔄 New student detected - Reloading...');
            localStorage.setItem('studentsData', JSON.stringify(STUDENTS_DATABASE));
            console.log('✅ Database reloaded with ' + STUDENTS_DATABASE.length + ' students');
            logAllStudents();
            return;
        }
        
        // Check if base data changed (not registeredCourses, as that's user-generated)
        if (sourceStudent.name !== storedStudent.name || 
            sourceStudent.password !== storedStudent.password ||
            JSON.stringify(sourceStudent.completedCourses) !== JSON.stringify(storedStudent.completedCourses)) {
            console.log('🔄 Student data changed for ' + sourceStudent.id + ' - Reloading...');
            localStorage.setItem('studentsData', JSON.stringify(STUDENTS_DATABASE));
            console.log('✅ Database reloaded with ' + STUDENTS_DATABASE.length + ' students');
            logAllStudents();
            return;
        }
    }
    
    // No changes detected - keep existing data (preserves registeredCourses)
    console.log('✅ Database is up to date (' + storedCount + ' students)');
}

// Helper function to log all students
function logAllStudents() {
    console.log('📚 Available students:');
    STUDENTS_DATABASE.forEach(student => {
        console.log(`   - ${student.id}: ${student.name} (${student.password})`);
    });
}

// ==========================================
// DATABASE FUNCTIONS
// ==========================================

// Get all students
function getAllStudents() {
    const data = localStorage.getItem('studentsData');
    return data ? JSON.parse(data) : [];
}

// Get student by ID
function getStudentById(studentId) {
    const students = getAllStudents();
    return students.find(s => s.id === studentId);
}

// Update student data
function updateStudent(studentId, updatedData) {
    const students = getAllStudents();
    const index = students.findIndex(s => s.id === studentId);
    
    if (index !== -1) {
        students[index] = { ...students[index], ...updatedData };
        localStorage.setItem('studentsData', JSON.stringify(students));
        return true;
    }
    return false;
}

// Authenticate student
function authenticateStudent(studentId, password) {
    const students = getAllStudents();
    return students.find(s => s.id === studentId && s.password === password);
}

// Get all courses
function getAllCourses() {
    return COURSES_DATABASE;
}

// Get course by ID
function getCourseById(courseId) {
    return COURSES_DATABASE.find(c => c.id === courseId);
}

// Get courses by year
function getCoursesByYear(year) {
    return COURSES_DATABASE.filter(c => c.year === year);
}

// Reset database to default values (force reload from source)
function resetDatabase() {
    localStorage.setItem('studentsData', JSON.stringify(STUDENTS_DATABASE));
    localStorage.setItem('databaseVersion', DATABASE_VERSION.toString());
    console.log('🔄 Database reset to default values');
    console.log('✅ Loaded ' + STUDENTS_DATABASE.length + ' students');
    console.log('📚 Students in database:');
    STUDENTS_DATABASE.forEach(student => {
        console.log(`   - ${student.id}: ${student.name}`);
    });
}

// Force reload database from source (use this after adding new students)
function reloadDatabaseFromSource() {
    const currentVersion = parseInt(localStorage.getItem('databaseVersion') || '0');
    const newVersion = currentVersion + 1;
    localStorage.setItem('databaseVersion', newVersion.toString());
    initializeDatabase();
    console.log('✅ Database force reloaded!');
}

// Auto-initialize database when script loads
initializeDatabase();

// ==========================================
// HELPFUL CONSOLE COMMANDS
// ==========================================
// You can use these commands in the browser console (F12):
//
// resetDatabase()           - Reset to defaults
// reloadDatabaseFromSource() - Force reload after adding students
// getAllStudents()          - View all students
// getStudentById('SE2001')  - View specific student
// ==========================================
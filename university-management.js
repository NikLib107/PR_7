"use strict";
// Enums
var StudentStatus;
(function (StudentStatus) {
    StudentStatus["Active"] = "Active";
    StudentStatus["Academic_Leave"] = "Academic Leave";
    StudentStatus["Graduated"] = "Graduated";
    StudentStatus["Expelled"] = "Expelled";
})(StudentStatus || (StudentStatus = {}));
var CourseType;
(function (CourseType) {
    CourseType["Mandatory"] = "Mandatory";
    CourseType["Optional"] = "Optional";
    CourseType["Special"] = "Special";
})(CourseType || (CourseType = {}));
var Semester;
(function (Semester) {
    Semester["First"] = "First";
    Semester["Second"] = "Second";
})(Semester || (Semester = {}));
var Grade;
(function (Grade) {
    Grade[Grade["Excellent"] = 5] = "Excellent";
    Grade[Grade["Good"] = 4] = "Good";
    Grade[Grade["Satisfactory"] = 3] = "Satisfactory";
    Grade[Grade["Unsatisfactory"] = 2] = "Unsatisfactory";
})(Grade || (Grade = {}));
var Faculty;
(function (Faculty) {
    Faculty["Computer_Science"] = "Computer Science";
    Faculty["Economics"] = "Economics";
    Faculty["Law"] = "Law";
    Faculty["Engineering"] = "Engineering";
})(Faculty || (Faculty = {}));
// Class
class UniversityManagementSystem {
    constructor() {
        this.students = [];
        this.courses = [];
        this.grades = [];
        this.studentIdCounter = 1;
    }
    // Enroll student
    enrollStudent(student) {
        const newStudent = Object.assign({ id: this.studentIdCounter++ }, student);
        this.students.push(newStudent);
        console.log(`Student enrolled: ${newStudent.fullName}`);
        return newStudent;
    }
    // Register for course
    registerForCourse(studentId, courseId) {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);
        if (!student || !course) {
            console.error("Student or course not found.");
            return;
        }
        if (student.faculty !== course.faculty) {
            console.error("Student and course faculties do not match.");
            return;
        }
        const registeredStudents = this.grades.filter(g => g.courseId === courseId).length;
        if (registeredStudents >= course.maxStudents) {
            console.error("Course is full.");
            return;
        }
        this.grades.push({ studentId, courseId, grade: Grade.Satisfactory, date: new Date(), semester: course.semester });
        console.log(`Student ${student.fullName} registered for course ${course.name}`);
    }
    // Set grade
    setGrade(studentId, courseId, grade) {
        const isRegistered = this.grades.some(g => g.studentId === studentId && g.courseId === courseId);
        if (!isRegistered) {
            console.error("Student is not registered for this course.");
            return;
        }
        this.grades.push({ studentId, courseId, grade, date: new Date(), semester: Semester.First });
        console.log(`Grade ${grade} set for student ${studentId} in course ${courseId}`);
    }
    // Update student status
    updateStudentStatus(studentId, newStatus) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) {
            console.error("Student not found.");
            return;
        }
        if (newStatus === StudentStatus.Graduated && student.status !== StudentStatus.Active) {
            console.error("Only active students can graduate.");
            return;
        }
        student.status = newStatus;
        console.log(`Student ${student.fullName} status updated to ${newStatus}`);
    }
    // Get students by faculty
    getStudentsByFaculty(faculty) {
        return this.students.filter(student => student.faculty === faculty);
    }
    // Get student grades
    getStudentGrades(studentId) {
        return this.grades.filter(grade => grade.studentId === studentId);
    }
    // Get available courses
    getAvailableCourses(faculty, semester) {
        return this.courses.filter(course => course.faculty === faculty && course.semester === semester);
    }
    // Calculate average grade
    calculateAverageGrade(studentId) {
        const grades = this.grades.filter(g => g.studentId === studentId).map(g => g.grade);
        return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
    }
}
// Example usage
const ums = new UniversityManagementSystem();
// Enroll student
const student1 = ums.enrollStudent({
    fullName: "John Doe",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date(),
    groupNumber: "CS101"
});
// Register course example
const course = {
    id: 1,
    name: "Programming 101",
    type: CourseType.Mandatory,
    credits: 3,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 30
};
ums.registerForCourse(student1.id, course.id);
ums.setGrade(student1.id, course.id, Grade.Excellent);
ums.updateStudentStatus(student1.id, StudentStatus.Graduated);
const topStudents = ums.getStudentsByFaculty(Faculty.Computer_Science);
console.log("Top students:", topStudents);

// Enums
enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic Leave",
    Graduated = "Graduated",
    Expelled = "Expelled"
}

enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special"
}

enum Semester {
    First = "First",
    Second = "Second"
}

enum Grade {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2
}

enum Faculty {
    Computer_Science = "Computer Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering"
}

// Interfaces
interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
}

interface GradeRecord {
    studentId: number;
    courseId: number;
    grade: Grade;
    date: Date;
    semester: Semester;
}

// Class
class UniversityManagementSystem {
    private students: Student[] = [];
    private courses: Course[] = [];
    private grades: GradeRecord[] = [];
    private studentIdCounter = 1;

    // Enroll student
    enrollStudent(student: Omit<Student, "id">): Student {
        const newStudent: Student = { id: this.studentIdCounter++, ...student };
        this.students.push(newStudent);
        console.log(`Student enrolled: ${newStudent.fullName}`);
        return newStudent;
    }

    // Register for course
    registerForCourse(studentId: number, courseId: number): void {
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
    setGrade(studentId: number, courseId: number, grade: Grade): void {
        const isRegistered = this.grades.some(g => g.studentId === studentId && g.courseId === courseId);
        if (!isRegistered) {
            console.error("Student is not registered for this course.");
            return;
        }

        this.grades.push({ studentId, courseId, grade, date: new Date(), semester: Semester.First });
        console.log(`Grade ${grade} set for student ${studentId} in course ${courseId}`);
    }

    // Update student status
    updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
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
    getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter(student => student.faculty === faculty);
    }

    // Get student grades
    getStudentGrades(studentId: number): GradeRecord[] {
        return this.grades.filter(grade => grade.studentId === studentId);
    }

    // Get available courses
    getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
        return this.courses.filter(course => course.faculty === faculty && course.semester === semester);
    }

    // Calculate average grade
    calculateAverageGrade(studentId: number): number {
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
const course: Course = {
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

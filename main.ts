#!/usr/bin/env node

import inquirer from 'inquirer';

class Student {
    name: string;
    studentId: string;
    coursesEnrolled: string[];
    balance: number;

    constructor(name: string, initialBalance: number) {
        this.name = name;
        this.studentId = this.generateStudentId();
        this.coursesEnrolled = [];
        this.balance = initialBalance;
    }

    generateStudentId(): string {
        
        return Math.random().toString(36).substring(2, 5).toUpperCase(); 
    }

    enroll(course: Course): void {
        if (this.balance >= course.tuitionFees) {
            this.coursesEnrolled.push(course.name);
            this.balance -= course.tuitionFees;
            console.log(`${this.name} enrolled in ${course.name} and paid $${course.tuitionFees}. Remaining balance: $${this.balance}`);
        } else {
            console.log(`${this.name} does not have enough balance to enroll in ${course.name}.`);
        }
    }
    
    viewBalance(): void {
        console.log(`${this.name}'s balance is $${this.balance}`);
    }

    showStatus(): void {
        console.log(`Name: ${this.name}`);
        console.log(`Student ID: ${this.studentId}`);
        console.log(`Courses Enrolled: ${this.coursesEnrolled.join(', ')}`);
        console.log(`Balance: $${this.balance}`);
    }
}

class Course {
    static coursesList: Course[] = [
        new Course("Math", "MATH101", 500),
        new Course("Science", "SCI101", 600),
        new Course("History", "HIST101", 400),
        new Course("English", "ENG101", 450)
    ];

    name: string;
    code: string;
    tuitionFees: number;

    constructor(name: string, code: string, tuitionFees: number) {
        this.name = name;
        this.code = code;
        this.tuitionFees = tuitionFees;
    }
}

class StudentManagementSystem {
    students: Student[];
    courses: Course[];

    constructor() {
        this.students = [];
        this.courses = Course.coursesList;
    }

    async addStudent(): Promise<void> {
        const { name, initialBalance } = await inquirer.prompt([
            { type: 'input', name: 'name', message: 'Enter student name:' },
            { type: 'number', name: 'initialBalance', message: 'Enter initial balance:' }
        ]);
        const student = new Student(name, initialBalance);
        this.students.push(student);
        console.log(`Student ${student.name} added with ID ${student.studentId}`);
    }

    async enrollStudent(): Promise<void> {
        const { studentIndex, courseIndex } = await inquirer.prompt([
            { type: 'list', name: 'studentIndex', message: 'Select student:', choices: this.students.map((student, index) => ({ name: student.name, value: index })) },
            { type: 'list', name: 'courseIndex', message: 'Select course:', choices: this.courses.map((course, index) => ({ name: `${course.name} - $${course.tuitionFees}`, value: index })) },
        ]);
        const student = this.students[studentIndex];
        const selectedCourse = this.courses[courseIndex];
        student.enroll(selectedCourse);
    }

    async showStudentStatus(): Promise<void> {
        const { studentIndex } = await inquirer.prompt([{ type: 'list', name: 'studentIndex', message: 'Select student:', choices: this.students.map((student, index) => ({ name: student.name, value: index })) }]);
        const student = this.students[studentIndex];
        student.showStatus();
    }

    async showStudentBalance(): Promise<void> {
        const { studentIndex } = await inquirer.prompt([{ type: 'list', name: 'studentIndex', message: 'Select student:', choices: this.students.map((student, index) => ({ name: student.name, value: index })) }]);
        const student = this.students[studentIndex];
        student.viewBalance();
    }
}

async function main(): Promise<void> {
    const system = new StudentManagementSystem();

    while (true) {
        const { choice } = await inquirer.prompt([
            { type: 'list', name: 'choice', message: 'Choose an option:', choices: ['Add Student', 'Enroll Student', 'View Student Status', 'View Student Balance', 'Exit'] },
        ]);

        switch (choice) {
            case 'Add Student':
                await system.addStudent();
                break;
            case 'Enroll Student':
                await system.enrollStudent();
                break;
            case 'View Student Status':
                await system.showStudentStatus();
                break;
            case 'View Student Balance':
                await system.showStudentBalance();
                break;
            case 'Exit':
                console.log('Exiting...');
                return;
        }
    }
}

main();

import { database } from './db';

export const seedDatabase = () => {
  try {
    // Seed Students
const students = [
      { name: 'Kasun Perera', rollNumber: '101', class: 'CS-A' },
      { name: 'Tharushi Silva', rollNumber: '102', class: 'CS-A' },
      { name: 'Nuwan Bandara', rollNumber: '103', class: 'CS-A' },
      { name: 'Sanduni Fernando', rollNumber: '104', class: 'CS-A' },
      { name: 'Lahiru Gamage', rollNumber: '105', class: 'CS-A' },
      { name: 'Chamari Jayasinghe', rollNumber: '106', class: 'CS-B' },
      { name: 'Ruwan Karunaratne', rollNumber: '107', class: 'CS-B' },
      { name: 'Nethmi Rajapaksa', rollNumber: '108', class: 'CS-B' },
      { name: 'Dinesh Weerasinghe', rollNumber: '109', class: 'CS-B' },
      { name: 'Hasini Ekanayake', rollNumber: '110', class: 'CS-B' },
    ];
    const existingStudents = database.getAllStudents();
    
    if (existingStudents.length === 0) {
      students.forEach(student => {
        try {
          database.addStudent(student.name, student.rollNumber, student.class);
        } catch (error) {
          console.log('Student already exists:', student.rollNumber);
        }
      });
      console.log('Students seeded successfully');
    }

    // Seed Subjects
    const subjects = [
      { name: 'Mathematics', code: 'MATH101' },
      { name: 'Computer Science', code: 'CS101' },
      { name: 'Physics', code: 'PHY101' },
      { name: 'Chemistry', code: 'CHEM101' },
      { name: 'English', code: 'ENG101' },
    ];

    const existingSubjects = database.getAllSubjects();
    
    if (existingSubjects.length === 0) {
      subjects.forEach(subject => {
        try {
          database.addSubject(subject.name, subject.code);
        } catch (error) {
          console.log('Subject already exists:', subject.code);
        }
      });
      console.log('Subjects seeded successfully');
    }

  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
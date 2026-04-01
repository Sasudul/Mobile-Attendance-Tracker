import { database } from './db';

export const seedDatabase = () => {
  try {
    // Seed subjects first
    const subjects = [
      { name: 'Data Structures', code: 'CS201' },
      { name: 'Algorithms', code: 'CS301' },
      { name: 'Database Systems', code: 'CS202' },
      { name: 'Operating Systems', code: 'CS303' },
      { name: 'Computer Networks', code: 'CS304' },
      { name: 'Mathematics III', code: 'MATH301' },
      { name: 'Digital Electronics', code: 'EC201' },
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

    // Seed students
    const students = [
      // CS-A students
      { name: 'Kasun Perera', rollNumber: 'CSA-001', class: 'CS-A' },
      { name: 'Tharushi Silva', rollNumber: 'CSA-002', class: 'CS-A' },
      { name: 'Nuwan Bandara', rollNumber: 'CSA-003', class: 'CS-A' },
      { name: 'Sanduni Fernando', rollNumber: 'CSA-004', class: 'CS-A' },
      { name: 'Lahiru Gamage', rollNumber: 'CSA-005', class: 'CS-A' },
      { name: 'Hiruni Wijesinghe', rollNumber: 'CSA-006', class: 'CS-A' },
      { name: 'Sahan Ratnayake', rollNumber: 'CSA-007', class: 'CS-A' },
      { name: 'Dilini Jayawardena', rollNumber: 'CSA-008', class: 'CS-A' },
      { name: 'Amaya Dissanayake', rollNumber: 'CSA-009', class: 'CS-A' },
      { name: 'Kavinda Senanayake', rollNumber: 'CSA-010', class: 'CS-A' },
      // CS-B students
      { name: 'Chamari Jayasinghe', rollNumber: 'CSB-001', class: 'CS-B' },
      { name: 'Ruwan Karunaratne', rollNumber: 'CSB-002', class: 'CS-B' },
      { name: 'Nethmi Rajapaksa', rollNumber: 'CSB-003', class: 'CS-B' },
      { name: 'Dinesh Weerasinghe', rollNumber: 'CSB-004', class: 'CS-B' },
      { name: 'Hasini Ekanayake', rollNumber: 'CSB-005', class: 'CS-B' },
      { name: 'Malith Gunathilaka', rollNumber: 'CSB-006', class: 'CS-B' },
      { name: 'Ishara Madushani', rollNumber: 'CSB-007', class: 'CS-B' },
      { name: 'Ravindu Herath', rollNumber: 'CSB-008', class: 'CS-B' },
      { name: 'Thilini Ranasinghe', rollNumber: 'CSB-009', class: 'CS-B' },
      { name: 'Pasindu De Silva', rollNumber: 'CSB-010', class: 'CS-B' },
      // CS-C students
      { name: 'Sachini Wickramasinghe', rollNumber: 'CSC-001', class: 'CS-C' },
      { name: 'Udara Jayalath', rollNumber: 'CSC-002', class: 'CS-C' },
      { name: 'Methmi Kulathunga', rollNumber: 'CSC-003', class: 'CS-C' },
      { name: 'Ashan Gunawardena', rollNumber: 'CSC-004', class: 'CS-C' },
      { name: 'Rashmika Peris', rollNumber: 'CSC-005', class: 'CS-C' },
      { name: 'Tharindu Lakmal', rollNumber: 'CSC-006', class: 'CS-C' },
      { name: 'Nimasha Samaraweera', rollNumber: 'CSC-007', class: 'CS-C' },
      { name: 'Buddhika Amarasinghe', rollNumber: 'CSC-008', class: 'CS-C' },
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

      // Seed some attendance history
      seedAttendanceHistory();
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

const seedAttendanceHistory = () => {
  try {
    const today = new Date();
    const subjects = ['Data Structures', 'Algorithms', 'Database Systems'];
    const classes = ['CS-A', 'CS-B'];

    // Generate attendance for last 3 days
    for (let dayOffset = 1; dayOffset <= 3; dayOffset++) {
      const date = new Date(today);
      date.setDate(date.getDate() - dayOffset);
      const dateStr = date.toISOString().split('T')[0];

      for (const cls of classes) {
        const students = database.getStudentsByClass(cls);
        const subject = subjects[dayOffset % subjects.length];

        const records = students.map(student => ({
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber,
          status: Math.random() > 0.15 ? 'present' as const : 'absent' as const,
          date: dateStr,
          subject: subject,
          class: cls,
        }));

        database.saveAttendance(records);
      }
    }
    console.log('Attendance history seeded successfully');
  } catch (error) {
    console.error('Error seeding attendance history:', error);
  }
};

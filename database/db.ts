import { AttendanceRecord, Student, Subject } from '@/types';
import * as SQLite from 'expo-sqlite';

class Database {
  private db: SQLite.SQLiteDatabase;

  constructor() {
    this.db = SQLite.openDatabaseSync('attendance.db');
    this.initDatabase();
  }

  private initDatabase() {
    this.db.execSync(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        rollNumber TEXT UNIQUE NOT NULL,
        class TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId INTEGER NOT NULL,
        studentName TEXT NOT NULL,
        rollNumber TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('present', 'absent')),
        date TEXT NOT NULL,
        subject TEXT NOT NULL,
        class TEXT NOT NULL,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students(id)
      );

      CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
      CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(studentId);
    `);
  }

  // Students
  getAllStudents(): Student[] {
    return this.db.getAllSync<Student>('SELECT * FROM students ORDER BY rollNumber');
  }

  getStudentsByClass(className: string): Student[] {
    return this.db.getAllSync<Student>(
      'SELECT * FROM students WHERE class = ? ORDER BY rollNumber',
      [className]
    );
  }

  addStudent(name: string, rollNumber: string, className: string): void {
    this.db.runSync(
      'INSERT INTO students (name, rollNumber, class) VALUES (?, ?, ?)',
      [name, rollNumber, className]
    );
  }

  deleteStudent(id: number): void {
    this.db.runSync('DELETE FROM students WHERE id = ?', [id]);
  }

  // Subjects
  getAllSubjects(): Subject[] {
    return this.db.getAllSync<Subject>('SELECT * FROM subjects ORDER BY name');
  }

  addSubject(name: string, code: string): void {
    this.db.runSync(
      'INSERT INTO subjects (name, code) VALUES (?, ?)',
      [name, code]
    );
  }

  // Attendance
  saveAttendance(records: Omit<AttendanceRecord, 'id' | 'timestamp'>[]): void {
    const statement = this.db.prepareSync(
      'INSERT INTO attendance (studentId, studentName, rollNumber, status, date, subject, class) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );

    try {
      for (const record of records) {
        statement.executeSync([
          record.studentId,
          record.studentName,
          record.rollNumber,
          record.status,
          record.date,
          record.subject,
          record.class
        ]);
      }
    } finally {
      statement.finalizeSync();
    }
  }

  getAttendanceByDate(date: string): AttendanceRecord[] {
    return this.db.getAllSync<AttendanceRecord>(
      'SELECT * FROM attendance WHERE date = ? ORDER BY rollNumber',
      [date]
    );
  }

  getAttendanceByDateAndSubject(date: string, subject: string): AttendanceRecord[] {
    return this.db.getAllSync<AttendanceRecord>(
      'SELECT * FROM attendance WHERE date = ? AND subject = ? ORDER BY rollNumber',
      [date, subject]
    );
  }

  getAllAttendance(): AttendanceRecord[] {
    return this.db.getAllSync<AttendanceRecord>(
      'SELECT * FROM attendance ORDER BY date DESC, timestamp DESC'
    );
  }

  getAttendanceStats(startDate: string, endDate: string) {
    return this.db.getFirstSync<{ totalPresent: number; totalAbsent: number }>(
      `SELECT 
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as totalPresent,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as totalAbsent
      FROM attendance 
      WHERE date BETWEEN ? AND ?`,
      [startDate, endDate]
    );
  }

  exportAttendanceToCSV(date: string, subject: string): string {
    const records = this.getAttendanceByDateAndSubject(date, subject);
    
    let csv = 'Roll Number,Student Name,Status,Date,Time,Subject\n';
    records.forEach(record => {
      const time = new Date(record.timestamp).toLocaleTimeString();
      csv += `${record.rollNumber},${record.studentName},${record.status},${record.date},${time},${record.subject}\n`;
    });
    
    return csv;
  }
}

export const database = new Database();
export interface Student {
  id: number;
  name: string;
  rollNumber: string;
  class: string;
  createdAt: string;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
}

export interface AttendanceRecord {
  id?: number;
  studentId: number;
  studentName: string;
  rollNumber: string;
  status: 'present' | 'absent';
  date: string;
  subject: string;
  class: string;
  timestamp: string;
}

export interface AttendanceSession {
  subject: Subject;
  date: string;
  class: string;
  records: Omit<AttendanceRecord, 'id' | 'timestamp'>[];
}
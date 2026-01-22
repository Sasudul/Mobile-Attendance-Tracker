import { AttendanceCard } from '@/components/AttendanceCard';
import { Header } from '@/components/Header';
import { StatCard } from '@/components/StatCard';
import { database } from '@/database/db';
import { AttendanceRecord } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MarkAttendanceScreen() {
  const params = useLocalSearchParams();
  const { subjectName, className, date } = params;

  const [attendanceRecords, setAttendanceRecords] = useState<
    Omit<AttendanceRecord, 'id' | 'timestamp'>[]
  >([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    const students = database.getStudentsByClass(className as string);
    const records = students.map((student) => ({
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      status: 'present' as const,
      date: date as string,
      subject: subjectName as string,
      class: className as string,
    }));
    setAttendanceRecords(records);
  };

  const updateAttendanceStatus = (
    index: number,
    status: 'present' | 'absent'
  ) => {
    const updated = [...attendanceRecords];
    updated[index].status = status;
    setAttendanceRecords(updated);
  };

  const handleSave = () => {
    try {
      database.saveAttendance(attendanceRecords);
      Alert.alert('Success', 'Attendance saved successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save attendance');
    }
  };

  const presentCount = attendanceRecords.filter(
    (r) => r.status === 'present'
  ).length;
  const absentCount = attendanceRecords.filter(
    (r) => r.status === 'absent'
  ).length;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header
        title="Mark Attendance"
        subtitle={`${subjectName} • ${className} • ${date}`}
        onBack={() => router.back()}
        rightButton={{
          icon: 'save',
          onPress: handleSave,
        }}
      />

      <ScrollView className="flex-1 px-4 pt-4">
        {attendanceRecords.map((record, index) => (
          <AttendanceCard
            key={index}
            studentName={record.studentName}
            rollNumber={record.rollNumber}
            status={record.status}
            onStatusChange={(status) => updateAttendanceStatus(index, status)}
          />
        ))}
      </ScrollView>

      {/* Stats Footer */}
      <View className="bg-white border-t border-gray-200 p-4">
        <View className="flex-row justify-around">
          <StatCard label="Present" value={presentCount} color="green" />
          <StatCard label="Absent" value={absentCount} color="red" />
          <StatCard label="Total" value={attendanceRecords.length} color="blue" />
        </View>
      </View>
    </SafeAreaView>
  );
}
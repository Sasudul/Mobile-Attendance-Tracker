import { database } from '@/database/db';
import { Subject } from '@/types';
import { getCurrentDate } from '@/utils/helper';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedClass, setSelectedClass] = useState('CS-A');
  const [attendanceDate, setAttendanceDate] = useState(getCurrentDate());

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = () => {
    const allSubjects = database.getAllSubjects();
    setSubjects(allSubjects);
    if (allSubjects.length > 0 && !selectedSubject) {
      setSelectedSubject(allSubjects[0]);
    }
  };

  const handleMarkAttendance = () => {
    if (!selectedSubject) {
      Alert.alert('Error', 'Please select a subject');
      return;
    }

    router.push({
      pathname: '/mark-attendance',
      params: {
        subjectId: selectedSubject.id,
        subjectName: selectedSubject.name,
        className: selectedClass,
        date: attendanceDate,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Attendance System</Text>
          <Text style={styles.headerSubtitle}>Manage student attendance efficiently</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity style={styles.actionCard} onPress={handleMarkAttendance}>
            <View style={styles.actionRow}>
              <View style={[styles.iconBg, { backgroundColor: '#dbeafe' }]}>
                <Ionicons name="checkmark-circle" size={28} color="#2563eb" />
              </View>
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Mark Attendance</Text>
                <Text style={styles.actionSubtitle}>Take attendance for today's class</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/history')}>
            <View style={styles.actionRow}>
              <View style={[styles.iconBg, { backgroundColor: '#f3e8ff' }]}>
                <Ionicons name="bar-chart" size={28} color="#9333ea" />
              </View>
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>View Reports</Text>
                <Text style={styles.actionSubtitle}>Check attendance records</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Settings</Text>

          <View style={styles.settingsCard}>
            <Text style={styles.fieldLabel}>Class</Text>
            <View style={styles.chipRow}>
              {['CS-A', 'CS-B'].map((cls) => (
                <TouchableOpacity
                  key={cls}
                  style={[styles.chip, selectedClass === cls ? styles.chipActive : styles.chipInactive]}
                  onPress={() => setSelectedClass(cls)}
                >
                  <Text style={[styles.chipText, selectedClass === cls ? styles.chipTextActive : styles.chipTextInactive]}>
                    {cls}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Subject</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              {subjects.map((subject) => (
                <TouchableOpacity
                  key={subject.id}
                  style={[styles.chip, selectedSubject?.id === subject.id ? styles.chipActive : styles.chipInactive]}
                  onPress={() => setSelectedSubject(subject)}
                >
                  <Text style={[styles.chipText, selectedSubject?.id === subject.id ? styles.chipTextActive : styles.chipTextInactive]}>
                    {subject.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.fieldLabel}>Date</Text>
            <View style={styles.dateBox}>
              <Text style={styles.dateText}>
                {new Date(attendanceDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  scrollView: { flex: 1 },
  header: { backgroundColor: '#2563eb', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, padding: 24, marginBottom: 24 },
  headerTitle: { color: 'white', fontSize: 30, fontWeight: 'bold', marginBottom: 8 },
  headerSubtitle: { color: '#bfdbfe', fontSize: 16 },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 16 },
  actionCard: { backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: '#f3f4f6', elevation: 1 },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  iconBg: { padding: 12, borderRadius: 8, marginRight: 16 },
  actionInfo: { flex: 1 },
  actionTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  actionSubtitle: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  settingsCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#f3f4f6', elevation: 1 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  chipRow: { flexDirection: 'row', marginBottom: 16 },
  chipScroll: { marginBottom: 16 },
  chip: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginRight: 8 },
  chipActive: { backgroundColor: '#2563eb' },
  chipInactive: { backgroundColor: '#f3f4f6' },
  chipText: { fontWeight: '600' },
  chipTextActive: { color: 'white' },
  chipTextInactive: { color: '#374151' },
  dateBox: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 16 },
  dateText: { color: '#1f2937', fontWeight: '500' },
});

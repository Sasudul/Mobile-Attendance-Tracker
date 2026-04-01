import { database } from '@/database/db';
import { Subject } from '@/types';
import { getCurrentDate } from '@/utils/helper';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CLASSES = ['CS-A', 'CS-B', 'CS-C'];

export default function HomeScreen() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedClass, setSelectedClass] = useState('CS-A');
  const [attendanceDate] = useState(getCurrentDate());
  const [todayStats, setTodayStats] = useState({ present: 0, absent: 0, total: 0 });

  useFocusEffect(
    useCallback(() => {
      loadSubjects();
      loadTodayStats();
    }, [])
  );

  const loadSubjects = () => {
    const allSubjects = database.getAllSubjects();
    setSubjects(allSubjects);
    if (allSubjects.length > 0 && !selectedSubject) {
      setSelectedSubject(allSubjects[0]);
    }
  };

  const loadTodayStats = () => {
    const today = getCurrentDate();
    const stats = database.getAttendanceStats(today, today);
    setTodayStats({
      present: stats?.totalPresent || 0,
      absent: stats?.totalAbsent || 0,
      total: (stats?.totalPresent || 0) + (stats?.totalAbsent || 0),
    });
  };

  const handleMarkAttendance = () => {
    if (!selectedSubject) {
      Alert.alert('Select Subject', 'Please choose a subject before marking attendance.');
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Welcome back 👋</Text>
              <Text style={styles.headerTitle}>Attendance System</Text>
            </View>
            <View style={styles.headerBadge}>
              <Ionicons name="school" size={24} color="#2563eb" />
            </View>
          </View>
          {/* Today's Stats Mini Bar */}
          {todayStats.total > 0 && (
            <View style={styles.miniStatsBar}>
              <View style={styles.miniStat}>
                <View style={[styles.miniDot, { backgroundColor: '#34d399' }]} />
                <Text style={styles.miniStatText}>{todayStats.present} Present</Text>
              </View>
              <View style={styles.miniStat}>
                <View style={[styles.miniDot, { backgroundColor: '#f87171' }]} />
                <Text style={styles.miniStatText}>{todayStats.absent} Absent</Text>
              </View>
              <View style={styles.miniStat}>
                <View style={[styles.miniDot, { backgroundColor: '#93c5fd' }]} />
                <Text style={styles.miniStatText}>{todayStats.total} Total</Text>
              </View>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity style={styles.actionCard} onPress={handleMarkAttendance} activeOpacity={0.7}>
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

          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/history')} activeOpacity={0.7}>
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

        {/* Session Settings */}
        <View style={[styles.section, { marginBottom: 32 }]}>
          <Text style={styles.sectionTitle}>Session Settings</Text>

          <View style={styles.settingsCard}>
            {/* Class Selector */}
            <Text style={styles.fieldLabel}>Class</Text>
            <View style={styles.chipRow}>
              {CLASSES.map((cls) => (
                <TouchableOpacity
                  key={cls}
                  style={[styles.chip, selectedClass === cls ? styles.chipActive : styles.chipInactive]}
                  onPress={() => setSelectedClass(cls)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, selectedClass === cls ? styles.chipTextActive : styles.chipTextInactive]}>
                    {cls}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Subject Selector */}
            <Text style={styles.fieldLabel}>Subject</Text>
            {subjects.length === 0 ? (
              <View style={styles.emptySubjects}>
                <Ionicons name="book-outline" size={20} color="#9ca3af" />
                <Text style={styles.emptySubjectsText}>No subjects added yet. Go to Settings to add subjects.</Text>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subjectChipRow}>
                {subjects.map((subject) => {
                  const isSelected = selectedSubject?.id === subject.id;
                  return (
                    <TouchableOpacity
                      key={subject.id}
                      style={[styles.subjectChip, isSelected ? styles.subjectChipActive : styles.subjectChipInactive]}
                      onPress={() => setSelectedSubject(subject)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="book"
                        size={16}
                        color={isSelected ? 'white' : '#6b7280'}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={[styles.subjectChipText, isSelected ? styles.subjectChipTextActive : styles.subjectChipTextInactive]}>
                        {subject.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            {/* Date Display */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Date</Text>
            <View style={styles.dateBox}>
              <Ionicons name="calendar" size={20} color="#6b7280" style={{ marginRight: 10 }} />
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
  safeArea: { flex: 1, backgroundColor: '#f0f4ff' },
  scrollView: { flex: 1 },
  header: {
    backgroundColor: '#2563eb',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    padding: 24,
    paddingTop: 16,
    marginBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { color: '#bfdbfe', fontSize: 16, marginBottom: 4 },
  headerTitle: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  headerBadge: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
  },
  miniStatsBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    justifyContent: 'space-around',
  },
  miniStat: { flexDirection: 'row', alignItems: 'center' },
  miniDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  miniStatText: { color: 'white', fontSize: 13, fontWeight: '500' },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937', marginBottom: 14 },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  iconBg: { padding: 12, borderRadius: 12, marginRight: 14 },
  actionInfo: { flex: 1 },
  actionTitle: { fontSize: 17, fontWeight: '600', color: '#1f2937' },
  actionSubtitle: { fontSize: 13, color: '#6b7280', marginTop: 3 },
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  chipRow: { flexDirection: 'row', marginBottom: 18, flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  chipActive: { backgroundColor: '#2563eb' },
  chipInactive: { backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb' },
  chipText: { fontWeight: '600', fontSize: 14 },
  chipTextActive: { color: 'white' },
  chipTextInactive: { color: '#374151' },
  subjectChipRow: { paddingBottom: 4 },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 8,
  },
  subjectChipActive: { backgroundColor: '#2563eb' },
  subjectChipInactive: { backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb' },
  subjectChipText: { fontWeight: '600', fontSize: 14 },
  subjectChipTextActive: { color: 'white' },
  subjectChipTextInactive: { color: '#374151' },
  emptySubjects: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef9c3',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  emptySubjectsText: { color: '#92400e', fontSize: 13, marginLeft: 10, flex: 1 },
  dateBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: { color: '#1f2937', fontWeight: '500', fontSize: 14 },
});

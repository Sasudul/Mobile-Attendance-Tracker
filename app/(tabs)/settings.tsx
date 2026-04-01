import { Header } from '@/components/Header';
import { database } from '@/database/db';
import { Subject } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', code: '' });
  const [stats, setStats] = useState({ totalStudents: 0, totalSubjects: 0, totalRecords: 0 });

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = () => {
    const allSubjects = database.getAllSubjects();
    const allStudents = database.getAllStudents();
    const allAttendance = database.getAllAttendance();
    setSubjects(allSubjects);
    setStats({
      totalStudents: allStudents.length,
      totalSubjects: allSubjects.length,
      totalRecords: allAttendance.length,
    });
  };

  const handleAddSubject = () => {
    if (!newSubject.name || !newSubject.code) { Alert.alert('Error', 'Please fill all fields'); return; }
    try {
      database.addSubject(newSubject.name, newSubject.code);
      loadData();
      setShowAddSubject(false);
      setNewSubject({ name: '', code: '' });
      Alert.alert('Success', 'Subject added successfully!');
    } catch (error) { Alert.alert('Error', 'Failed to add subject. Code might already exist.'); }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Settings" subtitle="Manage app configuration" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: '#eff6ff' }]}>
              <View style={[styles.statIconBg, { backgroundColor: '#dbeafe' }]}>
                <Ionicons name="people" size={24} color="#2563eb" />
              </View>
              <Text style={[styles.statValue, { color: '#2563eb' }]}>{stats.totalStudents}</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#faf5ff' }]}>
              <View style={[styles.statIconBg, { backgroundColor: '#f3e8ff' }]}>
                <Ionicons name="book" size={24} color="#9333ea" />
              </View>
              <Text style={[styles.statValue, { color: '#9333ea' }]}>{stats.totalSubjects}</Text>
              <Text style={styles.statLabel}>Subjects</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#f0fdf4' }]}>
              <View style={[styles.statIconBg, { backgroundColor: '#dcfce7' }]}>
                <Ionicons name="checkmark-done" size={24} color="#16a34a" />
              </View>
              <Text style={[styles.statValue, { color: '#16a34a' }]}>{stats.totalRecords}</Text>
              <Text style={styles.statLabel}>Records</Text>
            </View>
          </View>
        </View>

        {/* Manage Subjects */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Manage Subjects</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddSubject(true)} activeOpacity={0.7}>
              <Ionicons name="add" size={18} color="white" />
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
          {subjects.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="book-outline" size={40} color="#d1d5db" />
              <Text style={styles.emptyText}>No subjects added yet</Text>
            </View>
          ) : (
            subjects.map((subject) => (
              <View key={subject.id} style={styles.subjectCard}>
                <View style={styles.subjectIcon}>
                  <Ionicons name="book" size={20} color="#2563eb" />
                </View>
                <View style={styles.subjectInfo}>
                  <Text style={styles.subjectName}>{subject.name}</Text>
                  <Text style={styles.subjectCode}>{subject.code}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* About */}
        <View style={[styles.section, { paddingBottom: 40 }]}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutCard}>
            <View style={styles.aboutHeader}>
              <View style={styles.aboutIconBg}>
                <Ionicons name="school" size={28} color="#2563eb" />
              </View>
              <View>
                <Text style={styles.aboutTitle}>Mobile Attendance System</Text>
                <Text style={styles.aboutVersion}>Version 1.0.0</Text>
              </View>
            </View>
            <Text style={styles.aboutText}>
              A modern attendance management system designed for schools and colleges. Eliminates paperwork and streamlines the attendance tracking process.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Add Subject Modal */}
      <Modal visible={showAddSubject} animationType="slide" transparent onRequestClose={() => setShowAddSubject(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Subject</Text>
              <TouchableOpacity onPress={() => setShowAddSubject(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Subject Name</Text>
            <TextInput
              style={styles.input}
              value={newSubject.name}
              onChangeText={(text) => setNewSubject({ ...newSubject, name: text })}
              placeholder="e.g., Data Structures"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.inputLabel}>Subject Code</Text>
            <TextInput
              style={[styles.input, { marginBottom: 24 }]}
              value={newSubject.code}
              onChangeText={(text) => setNewSubject({ ...newSubject, code: text })}
              placeholder="e.g., CS201"
              placeholderTextColor="#9ca3af"
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleAddSubject} activeOpacity={0.8}>
              <Ionicons name="add-circle" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.submitBtnText}>Add Subject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f4ff' },
  scrollView: { flex: 1 },
  section: { paddingHorizontal: 16, paddingTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937', marginBottom: 14 },
  statsGrid: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statIconBg: { borderRadius: 10, padding: 8, marginBottom: 10 },
  statValue: { fontSize: 26, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#6b7280', marginTop: 4, fontWeight: '500' },
  addBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addBtnText: { color: 'white', fontWeight: '600', marginLeft: 4, fontSize: 14 },
  subjectCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectIcon: {
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    padding: 10,
    marginRight: 14,
  },
  subjectInfo: { flex: 1 },
  subjectName: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  subjectCode: { fontSize: 13, color: '#6b7280', marginTop: 3 },
  emptyCard: { backgroundColor: 'white', borderRadius: 14, padding: 40, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  emptyText: { color: '#9ca3af', fontSize: 16, marginTop: 12 },
  aboutCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 1,
  },
  aboutHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  aboutIconBg: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 10, marginRight: 14 },
  aboutTitle: { fontSize: 17, fontWeight: '700', color: '#1f2937' },
  aboutVersion: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  aboutText: { fontSize: 14, color: '#4b5563', lineHeight: 22 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#1f2937' },
  closeBtn: {
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    padding: 6,
  },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#4b5563', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    color: '#1f2937',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  submitBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: { color: 'white', fontWeight: '700', fontSize: 17 },
});

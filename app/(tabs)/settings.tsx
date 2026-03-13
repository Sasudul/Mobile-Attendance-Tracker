import { Header } from '@/components/Header';
import { database } from '@/database/db';
import { Subject } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', code: '' });
  const [stats, setStats] = useState({ totalStudents: 0, totalSubjects: 0 });

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    const allSubjects = database.getAllSubjects();
    const allStudents = database.getAllStudents();
    setSubjects(allSubjects);
    setStats({ totalStudents: allStudents.length, totalSubjects: allSubjects.length });
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

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.card}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="people" size={32} color="#2563eb" />
                <Text style={styles.statValue}>{stats.totalStudents}</Text>
                <Text style={styles.statLabel}>Students</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="book" size={32} color="#9333ea" />
                <Text style={styles.statValue}>{stats.totalSubjects}</Text>
                <Text style={styles.statLabel}>Subjects</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Manage Subjects</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddSubject(true)}>
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
          {subjects.map((subject) => (
            <View key={subject.id} style={styles.card}>
              <Text style={styles.subjectName}>{subject.name}</Text>
              <Text style={styles.subjectCode}>Code: {subject.code}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.section, { paddingBottom: 32 }]}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <Text style={styles.aboutTitle}>Mobile Attendance System</Text>
            <Text style={styles.aboutText}>
              Version 1.0.0{'\n\n'}
              A modern attendance management system designed for schools and colleges. Eliminates paperwork and streamlines the attendance tracking process.
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={showAddSubject} animationType="slide" transparent onRequestClose={() => setShowAddSubject(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Subject</Text>
              <TouchableOpacity onPress={() => setShowAddSubject(false)}><Ionicons name="close" size={28} color="#6b7280" /></TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Subject Name</Text>
            <TextInput style={styles.input} value={newSubject.name} onChangeText={(text) => setNewSubject({ ...newSubject, name: text })} placeholder="e.g., Mathematics" placeholderTextColor="#9ca3af" />

            <Text style={styles.inputLabel}>Subject Code</Text>
            <TextInput style={[styles.input, { marginBottom: 24 }]} value={newSubject.code} onChangeText={(text) => setNewSubject({ ...newSubject, code: text })} placeholder="e.g., MATH101" placeholderTextColor="#9ca3af" />

            <TouchableOpacity style={styles.submitBtn} onPress={handleAddSubject}>
              <Text style={styles.submitBtnText}>Add Subject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  scrollView: { flex: 1 },
  section: { paddingHorizontal: 16, paddingTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 16 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f3f4f6', elevation: 1 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginTop: 8 },
  statLabel: { fontSize: 14, color: '#4b5563', marginTop: 4 },
  addBtn: { backgroundColor: '#2563eb', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
  addBtnText: { color: 'white', fontWeight: '600', marginLeft: 4 },
  subjectName: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  subjectCode: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  aboutTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 8 },
  aboutText: { fontSize: 14, color: '#4b5563', lineHeight: 24 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
  inputLabel: { fontSize: 14, color: '#4b5563', marginBottom: 8 },
  input: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 16, marginBottom: 16, color: '#1f2937' },
  submitBtn: { backgroundColor: '#2563eb', borderRadius: 8, padding: 16 },
  submitBtnText: { textAlign: 'center', color: 'white', fontWeight: '600', fontSize: 18 },
});

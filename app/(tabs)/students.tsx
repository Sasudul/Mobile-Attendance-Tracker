import { Header } from '@/components/Header';
import { StudentCard } from '@/components/StudentCard';
import { database } from '@/database/db';
import { Student } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StudentsScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterClass, setFilterClass] = useState<string | null>(null);
  const [newStudent, setNewStudent] = useState({ name: '', rollNumber: '', class: 'CS-A' });

  useEffect(() => { loadStudents(); }, []);

  useEffect(() => {
    if (filterClass) {
      setFilteredStudents(students.filter((s) => s.class === filterClass));
    } else {
      setFilteredStudents(students);
    }
  }, [students, filterClass]);

  const loadStudents = () => { setStudents(database.getAllStudents()); };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.rollNumber) { Alert.alert('Error', 'Please fill all fields'); return; }
    try {
      database.addStudent(newStudent.name, newStudent.rollNumber, newStudent.class);
      loadStudents();
      setShowAddModal(false);
      setNewStudent({ name: '', rollNumber: '', class: 'CS-A' });
      Alert.alert('Success', 'Student added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add student. Roll number might already exist.');
    }
  };

  const handleDeleteStudent = (id: number) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this student?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { database.deleteStudent(id); loadStudents(); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Students" subtitle={`${filteredStudents.length} students`} rightButton={{ icon: 'add-circle', onPress: () => setShowAddModal(true) }} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterBarContent}>
        <TouchableOpacity style={[styles.chip, !filterClass ? styles.chipActive : styles.chipInactive]} onPress={() => setFilterClass(null)}>
          <Text style={[styles.chipText, !filterClass ? styles.chipTextActive : styles.chipTextInactive]}>All</Text>
        </TouchableOpacity>
        {['CS-A', 'CS-B'].map((cls) => (
          <TouchableOpacity key={cls} style={[styles.chip, filterClass === cls ? styles.chipActive : styles.chipInactive]} onPress={() => setFilterClass(cls)}>
            <Text style={[styles.chipText, filterClass === cls ? styles.chipTextActive : styles.chipTextInactive]}>{cls}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.list}>
        {filteredStudents.map((student) => (<StudentCard key={student.id} student={student} onDelete={handleDeleteStudent} />))}
        {filteredStudents.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>No students found</Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={showAddModal} animationType="slide" transparent onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Student</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}><Ionicons name="close" size={28} color="#6b7280" /></TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Student Name</Text>
            <TextInput style={styles.input} value={newStudent.name} onChangeText={(text) => setNewStudent({ ...newStudent, name: text })} placeholder="Enter student name" placeholderTextColor="#9ca3af" />

            <Text style={styles.inputLabel}>Roll Number</Text>
            <TextInput style={styles.input} value={newStudent.rollNumber} onChangeText={(text) => setNewStudent({ ...newStudent, rollNumber: text })} placeholder="Enter roll number" placeholderTextColor="#9ca3af" keyboardType="numeric" />

            <Text style={styles.inputLabel}>Class</Text>
            <View style={styles.classRow}>
              {['CS-A', 'CS-B'].map((cls) => (
                <TouchableOpacity key={cls} style={[styles.chip, newStudent.class === cls ? styles.chipActive : styles.chipInactive]} onPress={() => setNewStudent({ ...newStudent, class: cls })}>
                  <Text style={[styles.chipText, newStudent.class === cls ? styles.chipTextActive : styles.chipTextInactive]}>{cls}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleAddStudent}>
              <Text style={styles.submitBtnText}>Add Student</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  filterBar: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  filterBarContent: { paddingHorizontal: 16, paddingVertical: 12 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, marginRight: 8 },
  chipActive: { backgroundColor: '#2563eb' },
  chipInactive: { backgroundColor: '#f3f4f6' },
  chipText: { fontWeight: '600' },
  chipTextActive: { color: 'white' },
  chipTextInactive: { color: '#374151' },
  list: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyText: { color: '#9ca3af', fontSize: 18, marginTop: 16 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
  inputLabel: { fontSize: 14, color: '#4b5563', marginBottom: 8 },
  input: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 16, marginBottom: 16, color: '#1f2937' },
  classRow: { flexDirection: 'row', marginBottom: 24 },
  submitBtn: { backgroundColor: '#2563eb', borderRadius: 8, padding: 16 },
  submitBtnText: { textAlign: 'center', color: 'white', fontWeight: '600', fontSize: 18 },
});

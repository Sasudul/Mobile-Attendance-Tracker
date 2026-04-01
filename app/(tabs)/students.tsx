import { Header } from '@/components/Header';
import { StudentCard } from '@/components/StudentCard';
import { database } from '@/database/db';
import { Student } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CLASSES = ['CS-A', 'CS-B', 'CS-C'];

export default function StudentsScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterClass, setFilterClass] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newStudent, setNewStudent] = useState({ name: '', rollNumber: '', class: 'CS-A' });

  useFocusEffect(
    useCallback(() => {
      loadStudents();
    }, [])
  );

  useEffect(() => {
    let result = students;
    if (filterClass) {
      result = result.filter((s) => s.class === filterClass);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q)
      );
    }
    setFilteredStudents(result);
  }, [students, filterClass, searchQuery]);

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

  const getClassCount = (cls: string | null) => {
    if (!cls) return students.length;
    return students.filter(s => s.class === cls).length;
  };

  const renderStudent = ({ item }: { item: Student }) => (
    <StudentCard student={item} onDelete={handleDeleteStudent} />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Students"
        subtitle={`${filteredStudents.length} students`}
        rightButton={{ icon: 'add-circle', onPress: () => setShowAddModal(true) }}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or roll number..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Class Filter Tabs */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[styles.filterTab, !filterClass && styles.filterTabActive]}
          onPress={() => setFilterClass(null)}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterTabText, !filterClass && styles.filterTabTextActive]}>All</Text>
          <View style={[styles.countBadge, !filterClass && styles.countBadgeActive]}>
            <Text style={[styles.countBadgeText, !filterClass && styles.countBadgeTextActive]}>
              {getClassCount(null)}
            </Text>
          </View>
        </TouchableOpacity>
        {CLASSES.map((cls) => (
          <TouchableOpacity
            key={cls}
            style={[styles.filterTab, filterClass === cls && styles.filterTabActive]}
            onPress={() => setFilterClass(cls)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterTabText, filterClass === cls && styles.filterTabTextActive]}>{cls}</Text>
            <View style={[styles.countBadge, filterClass === cls && styles.countBadgeActive]}>
              <Text style={[styles.countBadgeText, filterClass === cls && styles.countBadgeTextActive]}>
                {getClassCount(cls)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Student List */}
      <FlatList
        data={filteredStudents}
        renderItem={renderStudent}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>No students found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try a different search term' : 'Tap + to add students'}
            </Text>
          </View>
        }
      />

      {/* Add Student Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Student</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Student Name</Text>
            <TextInput
              style={styles.input}
              value={newStudent.name}
              onChangeText={(text) => setNewStudent({ ...newStudent, name: text })}
              placeholder="Enter student name"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.inputLabel}>Roll Number</Text>
            <TextInput
              style={styles.input}
              value={newStudent.rollNumber}
              onChangeText={(text) => setNewStudent({ ...newStudent, rollNumber: text })}
              placeholder="e.g., CSA-011"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.inputLabel}>Class</Text>
            <View style={styles.classRow}>
              {CLASSES.map((cls) => (
                <TouchableOpacity
                  key={cls}
                  style={[styles.classChip, newStudent.class === cls ? styles.classChipActive : styles.classChipInactive]}
                  onPress={() => setNewStudent({ ...newStudent, class: cls })}
                >
                  <Text style={[styles.classChipText, newStudent.class === cls ? styles.classChipTextActive : styles.classChipTextInactive]}>
                    {cls}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleAddStudent} activeOpacity={0.8}>
              <Ionicons name="person-add" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.submitBtnText}>Add Student</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f4ff' },
  searchContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#1f2937',
    paddingVertical: 2,
  },
  filterBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
    backgroundColor: '#f3f4f6',
  },
  filterTabActive: {
    backgroundColor: '#2563eb',
  },
  filterTabText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#374151',
  },
  filterTabTextActive: {
    color: 'white',
  },
  countBadge: {
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginLeft: 6,
    minWidth: 24,
    alignItems: 'center',
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4b5563',
  },
  countBadgeTextActive: {
    color: 'white',
  },
  list: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 20 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyText: { color: '#6b7280', fontSize: 18, fontWeight: '600', marginTop: 16 },
  emptySubtext: { color: '#9ca3af', fontSize: 14, marginTop: 4 },
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
  classRow: { flexDirection: 'row', marginBottom: 24, gap: 8 },
  classChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  classChipActive: { backgroundColor: '#2563eb' },
  classChipInactive: { backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb' },
  classChipText: { fontWeight: '600', fontSize: 14 },
  classChipTextActive: { color: 'white' },
  classChipTextInactive: { color: '#374151' },
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

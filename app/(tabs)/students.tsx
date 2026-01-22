import { Header } from '@/components/Header';
import { StudentCard } from '@/components/StudentCard';
import { database } from '@/database/db';
import { Student } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StudentsScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterClass, setFilterClass] = useState<string | null>(null);
  const [newStudent, setNewStudent] = useState({
    name: '',
    rollNumber: '',
    class: 'CS-A',
  });

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (filterClass) {
      setFilteredStudents(students.filter((s) => s.class === filterClass));
    } else {
      setFilteredStudents(students);
    }
  }, [students, filterClass]);

  const loadStudents = () => {
    const allStudents = database.getAllStudents();
    setStudents(allStudents);
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.rollNumber) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      database.addStudent(
        newStudent.name,
        newStudent.rollNumber,
        newStudent.class
      );
      loadStudents();
      setShowAddModal(false);
      setNewStudent({ name: '', rollNumber: '', class: 'CS-A' });
      Alert.alert('Success', 'Student added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add student. Roll number might already exist.');
    }
  };

  const handleDeleteStudent = (id: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this student?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            database.deleteStudent(id);
            loadStudents();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header
        title="Students"
        subtitle={`${filteredStudents.length} students`}
        rightButton={{
          icon: 'add-circle',
          onPress: () => setShowAddModal(true),
        }}
      />

      {/* Filter Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 py-3 bg-white border-b border-gray-100"
      >
        <TouchableOpacity
          className={`px-4 py-2 rounded-lg mr-2 ${
            !filterClass ? 'bg-blue-600' : 'bg-gray-100'
          }`}
          onPress={() => setFilterClass(null)}
        >
          <Text
            className={`font-semibold ${
              !filterClass ? 'text-white' : 'text-gray-700'
            }`}
          >
            All
          </Text>
        </TouchableOpacity>
        {['CS-A', 'CS-B'].map((cls) => (
          <TouchableOpacity
            key={cls}
            className={`px-4 py-2 rounded-lg mr-2 ${
              filterClass === cls ? 'bg-blue-600' : 'bg-gray-100'
            }`}
            onPress={() => setFilterClass(cls)}
          >
            <Text
              className={`font-semibold ${
                filterClass === cls ? 'text-white' : 'text-gray-700'
              }`}
            >
              {cls}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView className="flex-1 px-4 pt-4">
        {filteredStudents.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onDelete={handleDeleteStudent}
          />
        ))}

        {filteredStudents.length === 0 && (
          <View className="items-center justify-center py-20">
            <Ionicons name="people-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-400 text-lg mt-4">No students found</Text>
          </View>
        )}
      </ScrollView>

      {/* Add Student Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-800">
                Add New Student
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={28} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-sm text-gray-600 mb-2">Student Name</Text>
            <TextInput
              className="bg-gray-100 rounded-lg p-4 mb-4 text-gray-800"
              value={newStudent.name}
              onChangeText={(text) =>
                setNewStudent({ ...newStudent, name: text })
              }
              placeholder="Enter student name"
              placeholderTextColor="#9ca3af"
            />

            <Text className="text-sm text-gray-600 mb-2">Roll Number</Text>
            <TextInput
              className="bg-gray-100 rounded-lg p-4 mb-4 text-gray-800"
              value={newStudent.rollNumber}
              onChangeText={(text) =>
                setNewStudent({ ...newStudent, rollNumber: text })
              }
              placeholder="Enter roll number"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />

            <Text className="text-sm text-gray-600 mb-2">Class</Text>
            <View className="flex-row mb-6">
              {['CS-A', 'CS-B'].map((cls) => (
                <TouchableOpacity
                  key={cls}
                  className={`px-6 py-3 rounded-lg mr-2 ${
                    newStudent.class === cls ? 'bg-blue-600' : 'bg-gray-100'
                  }`}
                  onPress={() => setNewStudent({ ...newStudent, class: cls })}
                >
                  <Text
                    className={`font-semibold ${
                      newStudent.class === cls ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {cls}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              className="bg-blue-600 rounded-lg p-4"
              onPress={handleAddStudent}
            >
              <Text className="text-center text-white font-semibold text-lg">
                Add Student
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
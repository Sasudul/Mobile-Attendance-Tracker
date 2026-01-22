import { Header } from '@/components/Header';
import { database } from '@/database/db';
import { Subject } from '@/types';
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

export default function SettingsScreen() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', code: '' });
  const [stats, setStats] = useState({ totalStudents: 0, totalSubjects: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allSubjects = database.getAllSubjects();
    const allStudents = database.getAllStudents();
    setSubjects(allSubjects);
    setStats({
      totalStudents: allStudents.length,
      totalSubjects: allSubjects.length,
    });
  };

  const handleAddSubject = () => {
    if (!newSubject.name || !newSubject.code) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      database.addSubject(newSubject.name, newSubject.code);
      loadData();
      setShowAddSubject(false);
      setNewSubject({ name: '', code: '' });
      Alert.alert('Success', 'Subject added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add subject. Code might already exist.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="Settings" subtitle="Manage app configuration" />

      <ScrollView className="flex-1">
        {/* Statistics */}
        <View className="px-4 pt-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Statistics
          </Text>
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <View className="flex-row justify-around">
              <View className="items-center">
                <Ionicons name="people" size={32} color="#2563eb" />
                <Text className="text-2xl font-bold text-gray-800 mt-2">
                  {stats.totalStudents}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">Students</Text>
              </View>
              <View className="items-center">
                <Ionicons name="book" size={32} color="#9333ea" />
                <Text className="text-2xl font-bold text-gray-800 mt-2">
                  {stats.totalSubjects}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">Subjects</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Subjects Management */}
        <View className="px-4 pt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-800">
              Manage Subjects
            </Text>
            <TouchableOpacity
              className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
              onPress={() => setShowAddSubject(true)}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text className="text-white font-semibold ml-1">Add</Text>
            </TouchableOpacity>
          </View>

          {subjects.map((subject) => (
            <View
              key={subject.id}
              className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
            >
              <Text className="text-lg font-semibold text-gray-800">
                {subject.name}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Code: {subject.code}
              </Text>
            </View>
          ))}
        </View>

        {/* About */}
        <View className="px-4 pt-6 pb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-4">About</Text>
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Text className="text-base font-semibold text-gray-800 mb-2">
              Mobile Attendance System
            </Text>
            <Text className="text-sm text-gray-600 leading-6">
              Version 1.0.0{'\n\n'}
              A modern attendance management system designed for schools and
              colleges. Eliminates paperwork and streamlines the attendance
              tracking process.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Add Subject Modal */}
      <Modal
        visible={showAddSubject}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddSubject(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-800">
                Add New Subject
              </Text>
              <TouchableOpacity onPress={() => setShowAddSubject(false)}>
                <Ionicons name="close" size={28} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-sm text-gray-600 mb-2">Subject Name</Text>
            <TextInput
              className="bg-gray-100 rounded-lg p-4 mb-4 text-gray-800"
              value={newSubject.name}
              onChangeText={(text) =>
                setNewSubject({ ...newSubject, name: text })
              }
              placeholder="e.g., Mathematics"
              placeholderTextColor="#9ca3af"
            />

            <Text className="text-sm text-gray-600 mb-2">Subject Code</Text>
            <TextInput
              className="bg-gray-100 rounded-lg p-4 mb-6 text-gray-800"
              value={newSubject.code}
              onChangeText={(text) =>
                setNewSubject({ ...newSubject, code: text })
              }
              placeholder="e.g., MATH101"
              placeholderTextColor="#9ca3af"
            />

            <TouchableOpacity
              className="bg-blue-600 rounded-lg p-4"
              onPress={handleAddSubject}
            >
              <Text className="text-center text-white font-semibold text-lg">
                Add Subject
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
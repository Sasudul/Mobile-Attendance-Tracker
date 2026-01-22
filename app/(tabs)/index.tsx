import { database } from '@/database/db';
import { Subject } from '@/types';
import { getCurrentDate } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-b-3xl p-6 mb-6">
          <Text className="text-white text-3xl font-bold mb-2">
            Attendance System
          </Text>
          <Text className="text-blue-100 text-base">
            Manage student attendance efficiently
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </Text>

          <TouchableOpacity
            className="bg-white rounded-xl p-5 mb-3 shadow-sm border border-gray-100"
            onPress={handleMarkAttendance}
          >
            <View className="flex-row items-center">
              <View className="bg-blue-100 p-3 rounded-lg mr-4">
                <Ionicons name="checkmark-circle" size={28} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">
                  Mark Attendance
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  Take attendance for today's class
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white rounded-xl p-5 mb-3 shadow-sm border border-gray-100"
            onPress={() => router.push('/history')}
          >
            <View className="flex-row items-center">
              <View className="bg-purple-100 p-3 rounded-lg mr-4">
                <Ionicons name="bar-chart" size={28} color="#9333ea" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">
                  View Reports
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  Check attendance records
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View className="px-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Session Settings
          </Text>

          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            {/* Class Selection */}
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Class
            </Text>
            <View className="flex-row mb-4">
              {['CS-A', 'CS-B'].map((cls) => (
                <TouchableOpacity
                  key={cls}
                  className={`px-6 py-3 rounded-lg mr-2 ${
                    selectedClass === cls ? 'bg-blue-600' : 'bg-gray-100'
                  }`}
                  onPress={() => setSelectedClass(cls)}
                >
                  <Text
                    className={`font-semibold ${
                      selectedClass === cls ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {cls}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Subject Selection */}
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Subject
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
            >
              {subjects.map((subject) => (
                <TouchableOpacity
                  key={subject.id}
                  className={`px-6 py-3 rounded-lg mr-2 ${
                    selectedSubject?.id === subject.id
                      ? 'bg-blue-600'
                      : 'bg-gray-100'
                  }`}
                  onPress={() => setSelectedSubject(subject)}
                >
                  <Text
                    className={`font-semibold ${
                      selectedSubject?.id === subject.id
                        ? 'text-white'
                        : 'text-gray-700'
                    }`}
                  >
                    {subject.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Date Display */}
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Date
            </Text>
            <View className="bg-gray-100 rounded-lg p-4">
              <Text className="text-gray-800 font-medium">
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
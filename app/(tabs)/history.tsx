import { Header } from '@/components/Header';
import { database } from '@/database/db';
import { AttendanceRecord } from '@/types';
import { formatDate, formatTime } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    Share,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [filterDate, setFilterDate] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const history = database.getAllAttendance();
    setAttendanceHistory(history);
  };

  const filteredHistory = attendanceHistory.filter((record) => {
    const matchesDate = !filterDate || record.date.includes(filterDate);
    return matchesDate;
  });

  const handleExport = async () => {
    if (!selectedDate || !selectedSubject) {
      Alert.alert('Error', 'Please select both date and subject to export');
      return;
    }

    try {
      const csvContent = database.exportAttendanceToCSV(selectedDate, selectedSubject);
      
      await Share.share({
        message: csvContent,
        title: `Attendance_${selectedDate}_${selectedSubject}.csv`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to export attendance data');
    }
  };

  // Group records by date
  const groupedByDate = filteredHistory.reduce((acc, record) => {
    if (!acc[record.date]) {
      acc[record.date] = [];
    }
    acc[record.date].push(record);
    return acc;
  }, {} as Record<string, AttendanceRecord[]>);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="Attendance History" subtitle="View all records" />

      {/* Filter Section */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Filter by Date
        </Text>
        <TextInput
          className="bg-gray-100 rounded-lg p-3 text-gray-800"
          value={filterDate}
          onChangeText={setFilterDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Export Section */}
      <View className="bg-blue-50 px-4 py-3 border-b border-blue-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-2">
            <Text className="text-xs font-semibold text-blue-900 mb-1">
              Export Data
            </Text>
            <Text className="text-xs text-blue-700">
              Select date & subject to share
            </Text>
          </View>
          <TouchableOpacity
            className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
            onPress={handleExport}
          >
            <Ionicons name="share-outline" size={18} color="white" />
            <Text className="text-white font-semibold ml-2">Export</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        {Object.keys(groupedByDate).length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-400 text-lg mt-4">
              No attendance records found
            </Text>
          </View>
        ) : (
          Object.keys(groupedByDate)
            .sort((a, b) => b.localeCompare(a))
            .map((date) => (
              <View key={date} className="mb-6">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-lg font-bold text-gray-800">
                    {formatDate(date)}
                  </Text>
                  <View className="bg-blue-100 px-3 py-1 rounded-full">
                    <Text className="text-xs font-semibold text-blue-700">
                      {groupedByDate[date].length} records
                    </Text>
                  </View>
                </View>

                {/* Group by subject for this date */}
                {Object.entries(
                  groupedByDate[date].reduce((acc, record) => {
                    if (!acc[record.subject]) {
                      acc[record.subject] = [];
                    }
                    acc[record.subject].push(record);
                    return acc;
                  }, {} as Record<string, AttendanceRecord[]>)
                ).map(([subject, records]) => {
                  const presentCount = records.filter((r) => r.status === 'present').length;
                  const absentCount = records.filter((r) => r.status === 'absent').length;

                  return (
                    <TouchableOpacity
                      key={`${date}-${subject}`}
                      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
                      onPress={() => {
                        setSelectedDate(date);
                        setSelectedSubject(subject);
                      }}
                    >
                      <View className="flex-row justify-between items-start mb-3">
                        <View className="flex-1">
                          <Text className="text-lg font-semibold text-gray-800">
                            {subject}
                          </Text>
                          <Text className="text-sm text-gray-500 mt-1">
                            {records[0].class} • {formatTime(records[0].timestamp)}
                          </Text>
                        </View>
                        {selectedDate === date && selectedSubject === subject && (
                          <View className="bg-blue-100 px-2 py-1 rounded">
                            <Text className="text-xs font-semibold text-blue-700">
                              Selected
                            </Text>
                          </View>
                        )}
                      </View>

                      <View className="flex-row justify-around pt-3 border-t border-gray-100">
                        <View className="items-center">
                          <Text className="text-xl font-bold text-green-600">
                            {presentCount}
                          </Text>
                          <Text className="text-xs text-gray-600 mt-1">Present</Text>
                        </View>
                        <View className="items-center">
                          <Text className="text-xl font-bold text-red-600">
                            {absentCount}
                          </Text>
                          <Text className="text-xs text-gray-600 mt-1">Absent</Text>
                        </View>
                        <View className="items-center">
                          <Text className="text-xl font-bold text-blue-600">
                            {records.length}
                          </Text>
                          <Text className="text-xs text-gray-600 mt-1">Total</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface AttendanceCardProps {
  studentName: string;
  rollNumber: string;
  status: 'present' | 'absent';
  onStatusChange: (status: 'present' | 'absent') => void;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  studentName,
  rollNumber,
  status,
  onStatusChange
}) => {
  return (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">
            {studentName}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Roll No: {rollNumber}
          </Text>
        </View>
        
        <View className="flex-row space-x-2">
          <TouchableOpacity
            className={`px-6 py-3 rounded-lg ${
              status === 'present' ? 'bg-green-500' : 'bg-gray-200'
            }`}
            onPress={() => onStatusChange('present')}
          >
            <Text className={`font-semibold ${
              status === 'present' ? 'text-white' : 'text-gray-600'
            }`}>
              P
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className={`px-6 py-3 rounded-lg ${
              status === 'absent' ? 'bg-red-500' : 'bg-gray-200'
            }`}
            onPress={() => onStatusChange('absent')}
          >
            <Text className={`font-semibold ${
              status === 'absent' ? 'text-white' : 'text-gray-600'
            }`}>
              A
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
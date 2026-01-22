import { Student } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface StudentCardProps {
  student: Student;
  onDelete?: (id: number) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ 
  student, 
  onDelete 
}) => {
  return (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">
            {student.name}
          </Text>
          <View className="flex-row mt-1">
            <Text className="text-sm text-gray-500">Roll: {student.rollNumber}</Text>
            <Text className="text-sm text-gray-400 mx-2">•</Text>
            <Text className="text-sm text-gray-500">Class: {student.class}</Text>
          </View>
        </View>
        
        {onDelete && (
          <TouchableOpacity 
            onPress={() => onDelete(student.id)}
            className="bg-red-50 p-2 rounded-lg"
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
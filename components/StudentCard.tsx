import { Student } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StudentCardProps {
  student: Student;
  onDelete?: (id: number) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ 
  student, 
  onDelete 
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.name}>{student.name}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detail}>Roll: {student.rollNumber}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.detail}>Class: {student.class}</Text>
          </View>
        </View>
        
        {onDelete && (
          <TouchableOpacity 
            onPress={() => onDelete(student.id)}
            style={styles.deleteBtn}
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  detailRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  detail: {
    fontSize: 14,
    color: '#6b7280',
  },
  dot: {
    fontSize: 14,
    color: '#9ca3af',
    marginHorizontal: 8,
  },
  deleteBtn: {
    backgroundColor: '#fef2f2',
    padding: 8,
    borderRadius: 8,
  },
});

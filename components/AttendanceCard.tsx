import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.name}>{studentName}</Text>
          <Text style={styles.rollNo}>Roll No: {rollNumber}</Text>
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.statusBtn, status === 'present' ? styles.presentActive : styles.statusInactive]}
            onPress={() => onStatusChange('present')}
          >
            <Text style={[styles.statusText, status === 'present' ? styles.activeText : styles.inactiveText]}>
              P
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.statusBtn, status === 'absent' ? styles.absentActive : styles.statusInactive]}
            onPress={() => onStatusChange('absent')}
          >
            <Text style={[styles.statusText, status === 'absent' ? styles.activeText : styles.inactiveText]}>
              A
            </Text>
          </TouchableOpacity>
        </View>
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
  rollNo: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  presentActive: {
    backgroundColor: '#22c55e',
  },
  absentActive: {
    backgroundColor: '#ef4444',
  },
  statusInactive: {
    backgroundColor: '#e5e7eb',
  },
  statusText: {
    fontWeight: '600',
  },
  activeText: {
    color: 'white',
  },
  inactiveText: {
    color: '#4b5563',
  },
});

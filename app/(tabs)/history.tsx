import { Header } from '@/components/Header';
import { database } from '@/database/db';
import { AttendanceRecord } from '@/types';
import { formatDate, formatTime } from '@/utils/helper';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [filterDate, setFilterDate] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = () => { setAttendanceHistory(database.getAllAttendance()); };

  const filteredHistory = attendanceHistory.filter((record) => !filterDate || record.date.includes(filterDate));

  const handleExport = async () => {
    if (!selectedDate || !selectedSubject) { Alert.alert('Error', 'Please select both date and subject to export'); return; }
    try {
      const csvContent = database.exportAttendanceToCSV(selectedDate, selectedSubject);
      await Share.share({ message: csvContent, title: `Attendance_${selectedDate}_${selectedSubject}.csv` });
    } catch (error) { Alert.alert('Error', 'Failed to export attendance data'); }
  };

  const groupedByDate = filteredHistory.reduce((acc, record) => {
    if (!acc[record.date]) acc[record.date] = [];
    acc[record.date].push(record);
    return acc;
  }, {} as Record<string, AttendanceRecord[]>);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Attendance History" subtitle="View all records" />

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Filter by Date</Text>
        <TextInput style={styles.filterInput} value={filterDate} onChangeText={setFilterDate} placeholder="YYYY-MM-DD" placeholderTextColor="#9ca3af" />
      </View>

      <View style={styles.exportSection}>
        <View style={styles.exportInfo}>
          <Text style={styles.exportTitle}>Export Data</Text>
          <Text style={styles.exportSubtitle}>Select date & subject to share</Text>
        </View>
        <TouchableOpacity style={styles.exportBtn} onPress={handleExport}>
          <Ionicons name="share-outline" size={18} color="white" />
          <Text style={styles.exportBtnText}>Export</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
        {Object.keys(groupedByDate).length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>No attendance records found</Text>
          </View>
        ) : (
          Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a)).map((date) => (
            <View key={date} style={styles.dateGroup}>
              <View style={styles.dateHeader}>
                <Text style={styles.dateTitle}>{formatDate(date)}</Text>
                <View style={styles.badge}><Text style={styles.badgeText}>{groupedByDate[date].length} records</Text></View>
              </View>

              {Object.entries(
                groupedByDate[date].reduce((acc, record) => {
                  if (!acc[record.subject]) acc[record.subject] = [];
                  acc[record.subject].push(record);
                  return acc;
                }, {} as Record<string, AttendanceRecord[]>)
              ).map(([subject, records]) => {
                const presentCount = records.filter((r) => r.status === 'present').length;
                const absentCount = records.filter((r) => r.status === 'absent').length;
                return (
                  <TouchableOpacity key={`${date}-${subject}`} style={styles.recordCard} onPress={() => { setSelectedDate(date); setSelectedSubject(subject); }}>
                    <View style={styles.recordHeader}>
                      <View style={styles.recordInfo}>
                        <Text style={styles.subjectName}>{subject}</Text>
                        <Text style={styles.recordMeta}>{records[0].class} • {formatTime(records[0].timestamp)}</Text>
                      </View>
                      {selectedDate === date && selectedSubject === subject && (
                        <View style={styles.selectedBadge}><Text style={styles.selectedBadgeText}>Selected</Text></View>
                      )}
                    </View>
                    <View style={styles.statsRow}>
                      <View style={styles.statItem}><Text style={[styles.statValue, { color: '#16a34a' }]}>{presentCount}</Text><Text style={styles.statLabel}>Present</Text></View>
                      <View style={styles.statItem}><Text style={[styles.statValue, { color: '#dc2626' }]}>{absentCount}</Text><Text style={styles.statLabel}>Absent</Text></View>
                      <View style={styles.statItem}><Text style={[styles.statValue, { color: '#2563eb' }]}>{records.length}</Text><Text style={styles.statLabel}>Total</Text></View>
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  filterSection: { backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  filterLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  filterInput: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 12, color: '#1f2937' },
  exportSection: { backgroundColor: '#eff6ff', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#bfdbfe', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  exportInfo: { flex: 1, marginRight: 8 },
  exportTitle: { fontSize: 12, fontWeight: '600', color: '#1e3a5f', marginBottom: 4 },
  exportSubtitle: { fontSize: 12, color: '#1d4ed8' },
  exportBtn: { backgroundColor: '#2563eb', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
  exportBtnText: { color: 'white', fontWeight: '600', marginLeft: 8 },
  list: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyText: { color: '#9ca3af', fontSize: 18, marginTop: 16 },
  dateGroup: { marginBottom: 24 },
  dateHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  dateTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  badge: { backgroundColor: '#dbeafe', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 100 },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#1d4ed8' },
  recordCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f3f4f6', elevation: 1 },
  recordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  recordInfo: { flex: 1 },
  subjectName: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  recordMeta: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  selectedBadge: { backgroundColor: '#dbeafe', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  selectedBadgeText: { fontSize: 12, fontWeight: '600', color: '#1d4ed8' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#4b5563', marginTop: 4 },
});

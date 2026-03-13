import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatCardProps {
  label: string;
  value: number | string;
  color?: string;
}

const colorMap: Record<string, string> = {
  blue: '#2563eb',
  green: '#16a34a',
  red: '#dc2626',
  purple: '#9333ea',
};

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  color = 'blue' 
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.value, { color: colorMap[color] || colorMap.blue }]}>
        {value}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  value: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
  },
});

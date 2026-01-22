import React from 'react';
import { Text, View } from 'react-native';

interface StatCardProps {
  label: string;
  value: number | string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    purple: 'text-purple-600'
  };

  return (
    <View className="items-center">
      <Text className={`text-3xl font-bold ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
        {value}
      </Text>
      <Text className="text-sm text-gray-600 mt-1">{label}</Text>
    </View>
  );
};
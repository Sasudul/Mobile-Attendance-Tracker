import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightButton?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  onBack, 
  rightButton 
}) => {
  return (
    <View className="bg-blue-600 px-4 pt-12 pb-6">
      <View className="flex-row items-center justify-between mb-2">
        {onBack ? (
          <TouchableOpacity onPress={onBack} className="flex-row items-center">
            <Ionicons name="arrow-back" size={24} color="white" />
            <Text className="text-white text-lg ml-2">Back</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        
        {rightButton && (
          <TouchableOpacity onPress={rightButton.onPress}>
            <Ionicons name={rightButton.icon} size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
      
      <Text className="text-white text-3xl font-bold">{title}</Text>
      {subtitle && (
        <Text className="text-blue-100 text-base mt-1">{subtitle}</Text>
      )}
    </View>
  );
};
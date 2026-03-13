import { seedDatabase } from '@/database/seed';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    seedDatabase();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="mark-attendance" />
    </Stack>
  );
}

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F1EFE8' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(guest)" />
        <Stack.Screen
          name="hotel/[id]"
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack>
    </>
  );
}

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'sonner-native';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
        <Stack.Screen
          name="chat/[id]"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="call/[id]"
          options={{ animation: 'fade', contentStyle: { backgroundColor: '#0A0A0A' } }}
        />
        <Stack.Screen
          name="booking/[id]"
          options={{ animation: 'fade' }}
        />
      </Stack>
      <Toaster position="top-center" />
    </GestureHandlerRootView>
  );
}

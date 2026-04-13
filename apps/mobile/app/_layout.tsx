import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F8F7F3' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(guest)" />
        <Stack.Screen name="hotel/[id]" />
        <Stack.Screen name="chat/[id]" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="call/[id]" options={{ animation: 'fade' }} />
        <Stack.Screen name="booking/[id]" options={{ animation: 'fade' }} />
        <Stack.Screen name="payment/[id]" />
        <Stack.Screen name="review/[id]" />
      </Stack>
    </>
  );
}

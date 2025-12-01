import { StripeProvider } from '@stripe/stripe-react-native';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';


export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  const publishableKey = 'pk_test_51RxkeOCOsgdbibnyIIPAAUxlM0lkd7zZLZ84VvhHOJDNSSoU29GG3PXaSwm1KIdcaBMk9ywWkgQuQKUBMKsFtXW6004z30uTeA';

  return (
    <StripeProvider publishableKey={publishableKey}>

      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} /> */}
      </Stack>
      <Toast/>
    </StripeProvider>
  );
}

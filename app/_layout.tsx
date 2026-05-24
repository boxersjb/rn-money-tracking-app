import { SplashScreen, Stack } from "expo-router";
import { useFonts, Kanit_400Regular, Kanit_700Bold } from '@expo-google-fonts/kanit';
import { useEffect } from "react";

// ป้องกันไม่ให้ Splash Screen หายไปจนกว่าฟอนต์จะโหลดเสร็จสมบูรณ์
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  // Load Google Font
  const [fontsLoaded] = useFonts({
    Kanit_400Regular,
    Kanit_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // เมื่อฟอนต์โหลดเสร็จ ค่อยสั่งซ่อน Splash Screen
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <Stack 
      screenOptions={{
        // ปิด Header มาตรฐาน เพราะเราจะทำ Custom UI ตามภาพ Design
        headerShown: false, 
      }}
    >
      {/* ลำดับหน้าจอหลักของแอป */}
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      
      {/* หน้า frame ที่จะเป็นตัวจัดการ Tab หรือ Layout ด้านในอีกที */}
      <Stack.Screen name="frame" />
      <Stack.Screen name="income" />
      <Stack.Screen name="expense" />
      <Stack.Screen name="home" />
    </Stack>
  );
}
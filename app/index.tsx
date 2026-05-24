import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    // หน่วงเวลา 3 วินาที แล้วแทนที่หน้าจอ (replace) เพื่อไม่ให้กด Back กลับมาหน้านี้ได้
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      {/* ส่วนข้อความตรงกลาง */}
      <View style={styles.centerContent}>
        <Text style={styles.title}>Money Tracking</Text>
        <Text style={styles.subtitle}>รายรับรายจ่ายของฉัน</Text>
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 25 }} />
      </View>

      {/* ส่วนข้อความเครดิตด้านล่าง */}
      <View style={styles.bottomContent}>
        <Text style={styles.footerText}>Created by 6852D10001</Text>
        <Text style={styles.footerText}>- SAU -</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#529D94', // สีเขียวอมฟ้าตามภาพ
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Kanit_700Bold',
    fontSize: 36,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Kanit_400Regular',
    fontSize: 22,
    color: '#FFFFFF',
  },
  bottomContent: {
    position: 'absolute',
    bottom: 50, // ดันขึ้นมาจากขอบล่าง
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Kanit_400Regular',
    fontSize: 16,
    color: '#FFE600', // สีเหลืองตามภาพ
    marginTop: 4,
  },
});
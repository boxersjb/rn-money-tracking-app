import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

// ดึงขนาดหน้าจอมาใช้เพื่อจัดสัดส่วน
const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  const handleStart = () => {
    // นำทางไปยังกลุ่มหน้า frame (Tab หรือ Layout หลักของแอป)
    // ใช้ replace เพื่อป้องกันไม่ให้ผู้ใช้กด Back กลับมาหน้า Welcome ได้
    router.replace('/frame');
  };

  return (
    <View style={styles.container}>
      
      {/* ส่วนครึ่งบน: พื้นหลังและรูปภาพ */}
      <View style={styles.topSection}>
        {/* คุณสามารถเปลี่ยน Path นี้ไปชี้ที่รูปภาพของคุณได้เลยครับ */}
        <Image 
          source={require('@/assets/images/man.png')} 
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* ส่วนครึ่งล่าง: ข้อความและปุ่ม */}
      <View style={styles.bottomSection}>
        <Text style={styles.title}>บันทึก</Text>
        <Text style={styles.title}>รายรับรายจ่าย</Text>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>เริ่มใช้งานแอปพลิเคชัน</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topSection: {
    flex: 1.5,
    backgroundColor: '#F0F8F7', // สีพื้นหลังโทนฟ้าอมเขียวอ่อนๆ ตามภาพ
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 50, // ทำความโค้งนิดหน่อยให้ดูสมูท
    borderBottomRightRadius: 50,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontFamily: 'Kanit_700Bold',
    fontSize: 32,
    color: '#418B81', // สีเขียวของตัวหนังสือตามภาพ
    lineHeight: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#529D94',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 40,
    alignItems: 'center',
    // ตั้งค่าเงาสำหรับ iOS
    shadowColor: '#529D94',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    // ตั้งค่าเงาสำหรับ Android
    elevation: 8,
  },
  buttonText: {
    fontFamily: 'Kanit_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
});
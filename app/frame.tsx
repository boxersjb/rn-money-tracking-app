import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './home';
import IncomeScreen from './income';
import ExpensesScreen from './expenses';

// const HomeScreen = () => (
//   <View style={styles.contentContainer}>
//     <Text style={styles.placeholderText}>หน้าหลัก (Home)</Text>
//   </View>
// );

// const IncomeScreen = () => (
//   <View style={styles.contentContainer}>
//     <Text style={styles.placeholderText}>บันทึกรายรับ (Income)</Text>
//   </View>
// );

// const ExpensesScreen = () => (
//   <View style={styles.contentContainer}>
//     <Text style={styles.placeholderText}>บันทึกรายจ่าย (Expenses)</Text>
//   </View>
// );

export default function FrameLayout() {
  // สร้าง State เพื่อเก็บว่าตอนนี้อยู่ที่หน้าไหน
  const [activeTab, setActiveTab] = useState('home');

  // ฟังก์ชันสำหรับ Render หน้าจอตาม Tab ที่เลือก
  const renderContent = () => {
    switch (activeTab) {
      case 'income': return <IncomeScreen />;
      case 'home': return <HomeScreen />;
      case 'expenses': return <ExpensesScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        {/* --- เพิ่มส่วน Header สีเขียวมาไว้ที่นี่ --- */}
      <View style={styles.headerBackground}>
        <View style={styles.headerTop}>
          <Text style={styles.profileName}>Chanachai Pansarakam</Text>
          <Image 
            source={(require('@/assets/images/me.jpg'))} 
            style={styles.profileImage}
          />
        </View>
      </View>
      {/* ส่วนเนื้อหาหลัก (Dynamic Content) */}
      <View style={styles.mainView}>
        {renderContent()}
      </View>

      {/* แถบเมนูด้านล่าง (Custom Bottom Tab Bar) */}
      <View style={styles.tabBar}>
        
        {/* ปุ่ม Income */}
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('income')}
        >
          <View style={[styles.iconWrapper, activeTab === 'income' && styles.activeIcon]}>
            <FontAwesome6 name="money-bill-trend-up" size={24} color="#FFF" />
          </View>
          <Text style={styles.tabText}>รายรับ</Text>
        </TouchableOpacity>

        {/* ปุ่ม Home (ปุ่มกลาง) */}
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('home')}
        >
          <View style={[styles.homeIconWrapper, activeTab === 'home' && styles.activeHomeIcon]}>
            <FontAwesome6 name="house" size={28} color="#FFF" />
          </View>
          <Text style={styles.tabText}>หน้าแรก</Text>
        </TouchableOpacity>

        {/* ปุ่ม Expenses */}
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('expenses')}
        >
          <View style={[styles.iconWrapper, activeTab === 'expenses' && styles.activeIcon]}>
            <FontAwesome6 name="money-bill-transfer" size={24} color="#FFF" />
          </View>
          <Text style={styles.tabText}>รายจ่าย</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerBackground: {
    backgroundColor: '#418B81',
    height: 220,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 50,
    paddingHorizontal: 24,
    zIndex: 1, // ให้อยู่ด้านหลัง
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileName: {
    fontFamily: 'Kanit_700Bold',
    fontSize: 22,
    color: '#FFF',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  // -----------------------------
  mainView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: 'Kanit_400Regular',
    fontSize: 20,
    color: '#333',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#418B81', // สีเขียวเข้มตามดีไซน์
    height: 90,
    paddingBottom: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    // Shadow สำหรับ Android
    elevation: 10,
    // Shadow สำหรับ iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 15,
  },
  activeIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // ไฮไลท์เมื่อเลือก
  },
  homeIconWrapper: {
    backgroundColor: '#529D94', // สีปุ่มโฮม
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40, // ดันปุ่มขึ้นมาข้างบนเหมือนในภาพ
    borderWidth: 4,
    borderColor: '#F8F9FA',
  },
  activeHomeIcon: {
    backgroundColor: '#418B81',
    transform: [{ scale: 1.1 }],
  },
  tabText: {
    fontFamily: 'Kanit_400Regular',
    fontSize: 12,
    color: '#FFF',
    marginTop: 4,
  }
});
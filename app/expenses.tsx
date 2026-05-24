import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { supabase } from '@/services/supabase';

export default function ExpensesScreen() {
  const [detail, setDetail] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 });

  // ฟังก์ชันดึงข้อมูลสรุปยอด
  const fetchSummary = async () => {
    try {
      const { data, error } = await supabase
        .from('money-tracker-transactions')
        .select('type, amount');

      if (error) throw error;

      if (data) {
        let totalIncome = 0;
        let totalExpense = 0;
        data.forEach((item) => {
          if (item.type === 'income') totalIncome += Number(item.amount);
          if (item.type === 'expense') totalExpense += Number(item.amount);
        });

        setSummary({
          balance: totalIncome - totalExpense,
          income: totalIncome,
          expense: totalExpense,
        });
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  // ฟังก์ชันบันทึกข้อมูลเงินออก
  const handleSave = async () => {
    if (!detail.trim()) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกรายการเงินออก');
      return;
    }
    if (!amount.trim() || isNaN(Number(amount))) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกจำนวนเงินให้ถูกต้อง');
      return;
    }

    setIsSubmitting(true);

    try {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];

      // บันทึกข้อมูลโดยกำหนด type เป็น 'expense'
      const { error } = await supabase
        .from('money-tracker-transactions')
        .insert([
          {
            type: 'expense', 
            amount: Number(amount),
            category: 'expense',
            note: detail,
            transaction_date: formattedDate,
          }
        ]);

      if (error) throw error;

      Alert.alert('สำเร็จ', 'บันทึกรายจ่ายเรียบร้อยแล้ว');
      
      setDetail('');
      setAmount('');
      
      fetchSummary();

    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentDateThai = () => {
    const date = new Date();
    const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    return `วันที่ ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
  };

  const formatCurrency = (val: number) => {
    return val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#529D94" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: -80, zIndex: 2}}contentContainerStyle={{ paddingBottom: 40 }}>

        {/* --- Summary Card --- */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>ยอดเงินคงเหลือ</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(summary.balance)}</Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={styles.summaryLabelRow}>
                <View style={[styles.smallIconCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <FontAwesome6 name="arrow-down" size={10} color="#FFF" />
                </View>
                <Text style={styles.summaryLabel}>ยอดเงินเข้ารวม</Text>
              </View>
              <Text style={styles.summarySubAmount}>{formatCurrency(summary.income)}</Text>
            </View>

            <View style={[styles.summaryItem, { alignItems: 'flex-end' }]}>
              <View style={styles.summaryLabelRow}>
                <Text style={styles.summaryLabel}>ยอดเงินออกรวม</Text>
                <View style={[styles.smallIconCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <FontAwesome6 name="arrow-up" size={10} color="#FFF" />
                </View>
              </View>
              <Text style={styles.summarySubAmount}>{formatCurrency(summary.expense)}</Text>
            </View>
          </View>
        </View>

        {/* --- Form --- */}
        <View style={styles.formContainer}>
          <Text style={styles.dateText}>{getCurrentDateThai()}</Text>
          <Text style={styles.formTitle}>เงินออก</Text>

          {/* รายการเงินออก */}
          <View style={styles.inputWrapper}>
            <Text style={styles.floatingLabel}>รายการเงินออก</Text>
            <TextInput
              style={styles.textInput}
              placeholder="DETAIL"
              placeholderTextColor="#B0B0B0"
              value={detail}
              onChangeText={setDetail}
            />
          </View>

          {/* จำนวนเงินออก */}
          <View style={styles.inputWrapper}>
            <Text style={styles.floatingLabel}>จำนวนเงินออก</Text>
            <TextInput
              style={styles.textInput}
              placeholder="0.00"
              placeholderTextColor="#B0B0B0"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          {/* ปุ่มบันทึก */}
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>บันทึกเงินออก</Text>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  headerBackground: {
    backgroundColor: '#418B81',
    height: 220,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 50,
    paddingHorizontal: 24,
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
  summaryCard: {
    backgroundColor: '#377A71',
    borderRadius: 20,
    marginHorizontal: 24,
    padding: 24,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  summaryTitle: {
    fontFamily: 'Kanit_400Regular',
    fontSize: 16,
    color: '#E0F0EE',
    textAlign: 'center',
  },
  balanceAmount: {
    fontFamily: 'Kanit_700Bold',
    fontSize: 36,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  smallIconCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: 'Kanit_400Regular',
    fontSize: 12,
    color: '#E0F0EE',
  },
  summarySubAmount: {
    fontFamily: 'Kanit_700Bold',
    fontSize: 18,
    color: '#FFF',
  },
  formContainer: {
    paddingHorizontal: 24,
    marginTop: 30,
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'Kanit_700Bold',
    fontSize: 24,
    color: '#333',
    marginBottom: 10,
  },
  formTitle: {
    fontFamily: 'Kanit_700Bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 25,
  },
  inputWrapper: {
    width: '100%',
    position: 'relative',
    marginBottom: 25,
  },
  floatingLabel: {
    position: 'absolute',
    top: -10,
    left: 15,
    backgroundColor: '#F8F9FA', 
    paddingHorizontal: 5,
    fontFamily: 'Kanit_400Regular',
    fontSize: 12,
    color: '#666',
    zIndex: 1,
  },
  textInput: {
    fontFamily: 'Kanit_400Regular',
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#418B81',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    height: 50,
  },
  submitButton: {
    backgroundColor: '#529D94',
    width: '100%',
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#529D94',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  submitButtonText: {
    fontFamily: 'Kanit_700Bold',
    fontSize: 18,
    color: '#FFF',
  },
});
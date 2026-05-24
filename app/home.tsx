import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { supabase } from '@/services/supabase'; 

// อินเทอร์เฟซสำหรับข้อมูล Transaction
interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  note: string;
  transaction_date: string;
}

export default function HomeScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 });

  // ฟังก์ชันดึงข้อมูลจาก Supabase
  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('money-tracker-transactions')
        .select('*')
        .order('transaction_date', { ascending: false }) // เรียงจากล่าสุดไปเก่าสุด
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setTransactions(data);
        
        // คำนวณยอดเงิน
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
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  // ฟังก์ชันแปลงวันที่เป็นภาษาไทย
  const formatDateThai = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
  };

  // ฟังก์ชันใส่คอมม่าให้ตัวเลข
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Render รายการแต่ละบรรทัด
  const renderItem = ({ item }: { item: Transaction }) => {
    const isIncome = item.type === 'income';
    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionLeft}>
          <View style={[styles.iconCircle, { backgroundColor: isIncome ? '#2EBA6F' : '#FF3B30' }]}>
            <FontAwesome6 
              name={isIncome ? "arrow-down" : "arrow-up"} 
              size={14} 
              color="#FFF" 
            />
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionNote} numberOfLines={1}>{item.note || item.category}</Text>
            <Text style={styles.transactionDate}>{formatDateThai(item.transaction_date)}</Text>
          </View>
        </View>
        <Text style={[styles.transactionAmount, { color: isIncome ? '#2EBA6F' : '#FF3B30' }]}>
          {formatCurrency(Number(item.amount))}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#529D94" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 2. การ์ดสรุปยอด (ทับลงบน Header) */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>ยอดเงินคงเหลือ</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(summary.balance)}</Text>

        <View style={styles.summaryRow}>
          {/* ยอดเงินเข้า */}
          <View style={styles.summaryItem}>
            <View style={styles.summaryLabelRow}>
              <View style={[styles.smallIconCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <FontAwesome6 name="arrow-down" size={10} color="#FFF" />
              </View>
              <Text style={styles.summaryLabel}>ยอดเงินเข้ารวม</Text>
            </View>
            <Text style={styles.summarySubAmount}>{formatCurrency(summary.income)}</Text>
          </View>

          {/* ยอดเงินออก */}
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

      {/* 3. รายการ Transaction */}
      <View style={styles.listContainer}>
        <Text style={styles.listHeader}>เงินเข้า/เงินออก</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#529D94" />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>ยังไม่มีรายการบันทึก</Text>
          }
        />
      </View>
    </View>
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
  // --- Header ---
  headerBackground: {
    backgroundColor: '#418B81', // สีเขียวตามภาพ
    height: 220,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 50, // เผื่อระยะ Status Bar
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
    marginTop: -80,
    zIndex: 2,
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
  // --- Transaction List ---
  listContainer: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  listHeader: {
    fontFamily: 'Kanit_700Bold',
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionNote: {
    fontFamily: 'Kanit_700Bold',
    fontSize: 15,
    color: '#333',
    marginBottom: 2,
  },
  transactionDate: {
    fontFamily: 'Kanit_400Regular',
    fontSize: 12,
    color: '#888',
  },
  transactionAmount: {
    fontFamily: 'Kanit_700Bold',
    fontSize: 16,
  },
  emptyText: {
    fontFamily: 'Kanit_400Regular',
    textAlign: 'center',
    marginTop: 30,
    color: '#888',
  }
});
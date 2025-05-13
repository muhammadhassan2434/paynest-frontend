import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '@/components/Header';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS } from '@/constants';
import Button from '@/components/Button';
import Toast from 'react-native-toast-message';
import { FETCH_BILL_REMINDER, FETCH_PENDING_BILL_REMINDER, FETCH_SUCCESS_BILL_REMINDER } from '@/utils/mutations/billreminder';
import { useAuth } from '@/utils/hooks/AuthContext';
import useFetchServices from '@/hooks/services';
import { DELETE_BILL_REMINDER } from '@/utils/mutations/billreminder';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

type Reminder = {
  id: string;
  bill_type: string;
  due_date: string;
  is_notified: number;
  status?: 'pending' | 'success'; 
};

type Nav = {
  navigate: (screen: string, params?: any) => void;
};

const tabs = ['All', 'Executed','Cancelled', 'Failed'];

const ShedulePayment = () => {
  const { colors, dark } = useTheme();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('All');
  const navigation = useNavigation();
  const {account, userId,token } = useAuth();
  const heldBalance = account?.[0]?.held_balance || '0.00';
  const accountId =account[0].id;
console.log(accountId)
  const {
    data: billReminder = [],
    isLoading: billReminderLoading,
    isError: billReminderError,
    refetch: refetchBillReminder,
  } = useFetchServices(["fetch_bill_reminder"], () => FETCH_BILL_REMINDER(userId,token));


  const {
    data: pendingreminders = [],
    isLoading: pendingremindersLoading,
    isError: pendingremindersError,
    refetch: refetchPendingReminders,
  } = useFetchServices(["fetch_pending_bill_reminder"], () => FETCH_PENDING_BILL_REMINDER(userId,token));

  const {
    data: successreminders = [],
    isLoading: successremindersLoading,
    isError: successremindersError,
  } = useFetchServices(["fetch_success_bill_reminder"], () => FETCH_SUCCESS_BILL_REMINDER(userId,token));

  useFocusEffect(
    useCallback(() => {
      refetchPendingReminders();
    }, [refetchPendingReminders])
  );
  useFocusEffect(
    useCallback(() => {
      refetchBillReminder();
    }, [refetchBillReminder ])
  );
  

  const deleteReminder = async (id: string, token: any) => {
    console.log("Deleting reminder with id: ", token); // Debugging the id being passed
  
    try {
      const response = await DELETE_BILL_REMINDER(id, token);
      if (response.status) {
        console.log('Delete response:', response); 
        setReminders((prevReminders) => prevReminders.filter((reminder) => reminder.id !== id));
        refetchBillReminder(); 
        refetchPendingReminders(); 
        Toast.show({
          type: 'success',
          text1: 'Deleted',
          text2: 'Bill reminder deleted successfully',
        });
      } else {
        throw new Error('Failed to delete reminder');
      }
    } catch (error) {
      console.error('Error deleting reminder:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete reminder',
      });
    }
  };
  
  

  const renderSchedulePayment: ListRenderItem<Reminder> = ({ item }: { item: Reminder }) => (
    <View style={[styles.reminderCard, { backgroundColor: dark ? COLORS.dark2 : '#F0F0F0' }]}>
      <TouchableOpacity
        style={styles.scheduleInfo}
        onPress={() => navigation.navigate('billreminderdetail', { reminder: item })}
      >
        <Text style={[styles.billName, { color: dark ? COLORS.white : COLORS.black }]}>{item.bill_type}</Text>
        <Text style={[styles.billDate, { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 }]}>{item.due_date}</Text>
      </TouchableOpacity>

      {item.is_notified == 0 && (
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
          onPress={() => navigation.navigate('editbillreminder', { reminderToEdit: item })}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.error }]}
          onPress={() => deleteReminder(item.id, token)}
        >
          <Text style={styles.actionButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    )}
    </View>
  );

  const filteredReminders = (() => {
    if (selectedTab === 'All') return billReminder;
    if (selectedTab === 'Executed') return successreminders;
    if (selectedTab === 'Cancelled') return pendingreminders;
    if (selectedTab === 'Failed') return successreminders;
    return billReminder;
  })();

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Header title="Schedule Payment" />
        <View style={styles.cardcontainer}>
    <View style={styles.card}>
      <Text style={styles.balanceLabel}>PKR</Text>
      <Text style={styles.balance}>{heldBalance}</Text>
    <Text style={styles.header}>Total Held Balance</Text>
    </View>

  </View>
        <View style={styles.viewContainer}>
        <Button
  color="black"
  title="Create a Schedule Payment"
  onPress={() => navigation.navigate('addschedulepayment')}
  style={{
    marginBottom: 20,
    borderColor: '#35383F',
    borderWidth: 1,
    backgroundColor: 'transparent',
  }}
  textColor="#35383F"
/>


          {/* NEW Tab bar */}
          <View style={styles.tabContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  {
                    backgroundColor: selectedTab === tab
                      ? COLORS.primary
                      : dark
                      ? COLORS.dark2
                      : COLORS.grayscale200,
                  },
                ]}
                onPress={() => setSelectedTab(tab)}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    { color: selectedTab === tab ? COLORS.white : COLORS.black },
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {filteredReminders.length === 0 ? (
            <Text style={{ color: dark ? COLORS.greyscale500 : COLORS.greyscale600, textAlign: 'center', marginTop: 20 }}>
              No Payment Scheduled
            </Text>
          ) : (
            <FlatList
              data={filteredReminders}
              keyExtractor={(item) => item.id}
              renderItem={renderSchedulePayment}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: { flex: 1 },
  container: { flex: 1, padding: 16 },
  viewContainer: { flex: 1 },
  labelText: { fontSize: 18, fontFamily: 'bold', marginBottom: 16 },
  reminderCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleInfo: { flex: 1 },
  billName: { fontSize: 16, fontFamily: 'bold' },
  billDate: { fontSize: 14, fontFamily: 'regular', marginTop: 4 },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 16,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'bold',
  },
  title: { fontSize: 24, fontFamily: 'bold', textAlign: 'center', marginTop: 16 },
  subtitle: { fontSize: 16, fontFamily: 'regular', textAlign: 'center', marginBottom: 8 },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  tabButtonText: {
    fontSize: 14,
    fontFamily: 'bold',
  },

  cardcontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20, 
  },
  header: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  card: {
    width: '90%',
    borderRadius: 12,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 18,
    color: '#555',
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
});

export default ShedulePayment;

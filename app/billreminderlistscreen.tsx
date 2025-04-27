import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '@/components/Header';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS } from '@/constants';
import Button from '@/components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  is_notified: string;
  status?: 'pending' | 'success'; // added status type optional
};

type Nav = {
  navigate: (screen: string, params?: any) => void;
};

const tabs = ['All', 'Pending', 'Success'];

const BillReminder = () => {
  const { colors, dark } = useTheme();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('All');
  const navigation = useNavigation();
  const { token } = useAuth();

  const {
    data: billReminder = [],
    isLoading: billReminderLoading,
    isError: billReminderError,
    refetch,
  } = useFetchServices(["fetch_bill_reminder"], () => FETCH_BILL_REMINDER(token));

  const {
    data: pendingreminders = [],
    isLoading: pendingremindersLoading,
    isError: pendingremindersError,
  } = useFetchServices(["fetch_pending_bill_reminder"], () => FETCH_PENDING_BILL_REMINDER(token));

  const {
    data: successreminders = [],
    isLoading: successremindersLoading,
    isError: successremindersError,
  } = useFetchServices(["fetch_success_bill_reminder"], () => FETCH_SUCCESS_BILL_REMINDER(token));

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const deleteReminder = async (id: string, token: any) => {
    console.log("Deleting reminder with id: ", token); // Debugging the id being passed
  
    try {
      const response = await DELETE_BILL_REMINDER(id, token);
      if (response.status) {
        console.log('Delete response:', response); 
        setReminders((prevReminders) => prevReminders.filter((reminder) => reminder.id !== id));
        refetch(); 
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
  
  

  const renderReminder: ListRenderItem<Reminder> = ({ item }: { item: Reminder }) => (
    <View style={[styles.reminderCard, { backgroundColor: dark ? COLORS.dark2 : '#F0F0F0' }]}>
      <TouchableOpacity
        style={styles.reminderInfo}
        onPress={() => navigation.navigate('billreminderdetail', { reminder: item })}
      >
        <Text style={[styles.billName, { color: dark ? COLORS.white : COLORS.black }]}>{item.bill_type}</Text>
        <Text style={[styles.billDate, { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 }]}>{item.due_date}</Text>
      </TouchableOpacity>

      {item.is_notified == 0 && (
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
          onPress={() => navigation.navigate('ManageReminders', { reminderToEdit: item })}
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
    if (selectedTab === 'Pending') return pendingreminders;
    if (selectedTab === 'Success') return successreminders;
    return billReminder;
  })();

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Header title="Bill Reminder" />
        <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Bill Reminders</Text>
        <Text style={[styles.subtitle, { color: dark ? COLORS.greyscale300 : COLORS.greyScale800 }]}>
          Never miss a due date. Set reminders for your upcoming bills.
        </Text>
        <View style={styles.viewContainer}>
          <Button
            title="Add Reminder"
            onPress={() => navigation.navigate('addbillreminder')}
            style={{ marginBottom: 20 }}
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
              No reminders added yet.
            </Text>
          ) : (
            <FlatList
              data={filteredReminders}
              keyExtractor={(item) => item.id}
              renderItem={renderReminder}
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
  reminderInfo: { flex: 1 },
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
});

export default BillReminder;

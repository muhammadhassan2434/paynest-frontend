import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '@/components/Header';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS } from '@/constants';
import Button from '@/components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message'; // Make sure Toast is installed
import { FETCH_BILL_REMINDER } from '@/utils/mutations/billreminder';
import { useAuth } from '@/utils/hooks/AuthContext';
import useFetchServices from '@/hooks/services';

const BillReminder = () => {
  const { colors, dark } = useTheme();
  const [reminders, setReminders] = useState([]);
  const navigation = useNavigation();
  const { token } = useAuth();

  const {
    data: billReminder = [],
    isLoading: billReminderLoading,
    isError: billReminderError,
    refetch, 
  } = useFetchServices(["fetch_bill_reminder"], () => FETCH_BILL_REMINDER(token));
  
  useFocusEffect(
    useCallback(() => {
      refetch(); 
    }, [refetch])
  );
  

  const deleteReminder = async (id) => {
    try {
      const updatedReminders = reminders.filter(reminder => reminder.id !== id);
      await AsyncStorage.setItem('billReminders', JSON.stringify(updatedReminders));
      setReminders(updatedReminders);
      Toast.show({
        type: 'success',
        text1: 'Deleted',
        text2: 'Bill reminder deleted successfully',
      });
    } catch (err) {
      console.error('Failed to delete reminder:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete reminder',
      });
    }
  };

  const renderReminder = ({ item }) => (
    <View style={[styles.reminderCard, { backgroundColor: dark ? COLORS.dark2 : '#F0F0F0' }]}>
      <View style={styles.reminderInfo}>
        <Text style={[styles.billName, { color: dark ? COLORS.white : COLORS.black }]}>{item.bill_type}</Text>
        <Text style={[styles.billDate, { color: dark ? COLORS.greyscale500 : COLORS.greyScale700 }]}>{item.due_date}</Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
          onPress={() => navigation.navigate('ManageReminders', { reminderToEdit: item })}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.error }]}
          onPress={() => deleteReminder(item.id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Header title="Bill Reminder" />
        <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>All Bill Reminders</Text>
        <Text style={[styles.subtitle, { color: dark ? COLORS.greyscale300 : COLORS.greyScale800 }]}>
          Never miss a due date. Set reminders for your upcoming bills.
        </Text>
        <View style={styles.viewContainer}>
          <Button
            title="Add Reminder"
            onPress={() => navigation.navigate('addbillreminder')}
            style={{ marginBottom: 20 }}
          />

          <Text style={[styles.labelText, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
            Saved Reminders
          </Text>

          {billReminder.length === 0 ? (
            <Text style={{ color: dark ? COLORS.greyscale500 : COLORS.greyscale600, textAlign: 'center', marginTop: 20 }}>
              No reminders added yet.
            </Text>
          ) : (
            <FlatList
              data={billReminder}
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
  labelText: { fontSize: 18, fontFamily: "bold", marginBottom: 16 },
  reminderCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderInfo: { flex: 1 },
  billName: { fontSize: 16, fontFamily: "bold" },
  billDate: { fontSize: 14, fontFamily: "regular", marginTop: 4 },
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
    fontFamily: "bold",
  },
  title: { fontSize: 24, fontFamily: "bold", textAlign: "center", marginTop: 16 },
  subtitle: { fontSize: 16, fontFamily: "regular", textAlign: "center", marginBottom: 8 },
});

export default BillReminder;

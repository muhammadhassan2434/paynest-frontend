import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '@/components/Header';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, FONTS } from '@/constants';
import Button from '@/components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UPDATE_BILL_REMINDER } from '@/utils/mutations/billreminder';
import { useAuth } from '@/utils/hooks/AuthContext';
import { getFormatedDate } from 'react-native-modern-datepicker';
import { Feather } from '@expo/vector-icons';
import DatePickerModal from '@/components/DatePickerModal';

const EditBillReminder = () => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const route = useRoute(); 
  const { reminderToEdit } = route.params;
  const { userId,token } = useAuth();

  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);

  const today = new Date();
  const formattedToday = getFormatedDate(
    new Date(today.setDate(today.getDate() + 1)),
    'YYYY/MM/DD'
  );
  const [startedDate, setStartedDate] = useState(reminderToEdit?.due_date);

  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker);
  };

  // State to hold the form data
  const [billType, setBillType] = useState(reminderToEdit?.bill_type || '');
  const [amount, setAmount] = useState(reminderToEdit?.amount || '');
  const [dueDate, setDueDate] = useState(reminderToEdit?.due_date || '');
  const [loading, setLoading] = useState(false);

  // Update AsyncStorage with the edited reminder
  const saveReminder = async () => {
    if (!billType || !amount || !dueDate) return;
  
    const updatedReminder = {
      user_id: userId, // Keep the same ID to update the existing reminder
      id: reminderToEdit.id, // Keep the same ID to update the existing reminder
      bill_type: billType,
      amount: amount,
      due_date: dueDate,
    };
  
    try {
      // Call the mutation to update the reminder using the API
      await UPDATE_BILL_REMINDER(updatedReminder.id, updatedReminder, token); // Pass the user token here
      setLoading(false);
      navigation.goBack(); // Navigate back to the previous screen
    } catch (err) {
      console.error('Failed to update reminder:', err);
    }
  };

  const inputStyle = {
    backgroundColor: dark ? COLORS.dark2 : '#fff',
    color: dark ? COLORS.white : COLORS.black,
    borderWidth: 1,
    borderColor: dark ? COLORS.greyscale900 : COLORS.grayscale200,
    ...styles.input,
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Header title="Edit Bill Reminder" />

        <View style={styles.viewContainer}>
          <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Edit Bill Reminder</Text>
          <Text style={[styles.subtitle, { color: dark ? COLORS.greyscale300 : COLORS.greyScale800 }]}>
            Never miss a due date. Set reminders for your upcoming bills.
          </Text>

          <View style={[styles.separateLine, { backgroundColor: dark ? COLORS.greyscale900 : COLORS.grayscale200 }]} />

          <View style={styles.form}>
            <TextInput
              placeholder="Bill Type"
              placeholderTextColor={dark ? COLORS.greyscale500 : COLORS.greyscale600}
              value={billType}
              onChangeText={setBillType}
              style={styles.inputStyle}
            />

            <TextInput
              placeholder="Amount"
              placeholderTextColor={dark ? COLORS.greyscale500 : COLORS.greyscale600}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={styles.inputStyle}
            />

            <TouchableOpacity
              style={[
                inputStyle,
                {
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              ]}
              onPress={handleOnPressStartDate}>
              <Feather name="calendar" size={24} color={COLORS.grayscale400} />
              <Text style={{ ...FONTS.body4, color: COLORS.grayscale400, marginLeft: 8 }}>
                {startedDate}
              </Text>
            </TouchableOpacity>

            {openStartDatePicker && (
              <DatePickerModal
                open={openStartDatePicker}
                startDate={formattedToday} // Default value for the date picker
                selectedDate={startedDate}
                onClose={() => setOpenStartDatePicker(false)}
                onChangeStartDate={(date) => {
                  setStartedDate(date); // Update the selected date
                  setDueDate(date); // Optionally update dueDate as well if needed
                }}
              />
            )}

            <Button
              title="Save"
              onPress={saveReminder}
              filled
              style={{ marginTop: 20 }}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: { flex: 1 },
  container: { padding: 16, flex: 1 },
  viewContainer: { flex: 1 },
  title: { fontSize: 24, fontFamily: 'bold', textAlign: 'center', marginTop: 16 },
  subtitle: { fontSize: 16, fontFamily: 'regular', textAlign: 'center', marginBottom: 8 },
  inputStyle: {
    height: 45,
    borderWidth: 1,
    borderColor: COLORS.greyscale300,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  separateLine: { height: 1, marginVertical: 16 },
  form: { flex: 1 },
  input: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    fontSize: 16,
    fontFamily: 'regular',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
});

export default EditBillReminder;

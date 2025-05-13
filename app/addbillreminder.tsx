import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Button from '@/components/Button';
import Header from '@/components/Header';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, FONTS, icons } from '@/constants';
import { Feather } from '@expo/vector-icons';
import { getFormatedDate } from 'react-native-modern-datepicker';
import DatePickerModal from '@/components/DatePickerModal';
import { useAuth } from '@/utils/hooks/AuthContext';
import { STORE_BILL_REMINDER } from '@/utils/mutations/billreminder';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

const AddBillReminder = () => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const {userId, token } = useAuth();

  const [billType, setBillType] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);

  const today = new Date();
  const startDate = getFormatedDate(
    new Date(today.setDate(today.getDate() + 1)),
    'YYYY/MM/DD'
  );
  const [startedDate, setStartedDate] = useState('12/12/2023');

  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker);
  };

  const addBillReminderMutation = useMutation({


    mutationFn: (data: {
      user_id: number;
      bill_type: string;
      amount: string;
      due_date: string;
    }) => STORE_BILL_REMINDER(data, token),
    onSuccess: (data) => {
      if (data?.status) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Bill reminder added successfully',
        });
        navigation.goBack();
      } else {
        if (data?.message) {
          setErrors(data.message);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Something went wrong',
          });
        }
      }
    },
    
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Validation Error ! Please fill all inputs',
      });
    },
  });

  const handleSave = () => {
    Keyboard.dismiss();
    setErrors({});

    const data = {
      user_id: userId,
      bill_type: billType,
      amount: amount,
      due_date: startedDate,
    };

    addBillReminderMutation.mutate(data);
  };

  const renderError = (field: string) =>
    errors[field] ? (
      <Text style={styles.errorText}>{errors[field][0]}</Text>
    ) : null;

  const inputStyle = {
    backgroundColor: dark ? COLORS.dark2 : '#fff',
    color: dark ? COLORS.white : COLORS.black,
    borderWidth: 1,
    borderColor: dark ? COLORS.greyscale900 : COLORS.grayscale200,
    ...styles.input,
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Header title="Bill Reminder" />

        <View style={styles.content}>
          <Image
            source={icons.security}
            style={styles.icon}
            resizeMode="contain"
          />

          <Text style={[styles.title, { color: colors.text }]}>
            Set a Bill Reminder
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
            ]}>
            Never miss a due date. Set reminders for your upcoming bills.
          </Text>

          <TextInput
            placeholder="Bill Type"
            placeholderTextColor={
              dark ? COLORS.greyscale500 : COLORS.greyscale600
            }
            value={billType}
            onChangeText={setBillType}
            style={inputStyle}
          />
          {renderError('bill_type')}

          <TextInput
            placeholder="Amount"
            placeholderTextColor={
              dark ? COLORS.greyscale500 : COLORS.greyscale600
            }
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={inputStyle}
          />
          {renderError('amount')}

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
          {renderError('due_date')}

          {openStartDatePicker && (
            <DatePickerModal
              open={openStartDatePicker}
              startDate={startDate}
              selectedDate={startedDate}
              onClose={() => setOpenStartDatePicker(false)}
              onChangeStartDate={(date) => setStartedDate(date)}
            />
          )}

          <Button
            title="Save"
            onPress={handleSave}
            filled
            style={styles.button}
            loading={addBillReminderMutation.isLoading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    alignItems: 'center',
    paddingTop: 24,
  },
  icon: {
    height: 100,
    width: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'regular',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  input: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    fontSize: 16,
    fontFamily: 'regular',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    width: '100%',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
});

export default AddBillReminder;

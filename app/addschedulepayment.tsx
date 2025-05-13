import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { getFormatedDate } from 'react-native-modern-datepicker';
import Toast from 'react-native-toast-message';
import { useMutation } from '@tanstack/react-query';

import Button from '@/components/Button';
import Header from '@/components/Header';
import DatePickerModal from '@/components/DatePickerModal';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, FONTS, icons } from '@/constants';
import { useAuth } from '@/utils/hooks/AuthContext';
import { STORE_BILL_REMINDER } from '@/utils/mutations/billreminder';

const AddSchedulePayment: React.FC = () => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const { userId, token } = useAuth();

  const today = new Date();
  const formattedTomorrow = getFormatedDate(
    new Date(today.setDate(today.getDate() + 1)),
    'YYYY/MM/DD'
  );

  const [amount, setAmount] = useState('');
  const [scheduledFor, setScheduledFor] = useState(formattedTomorrow);
  const [purpose, setPurpose] = useState('');
  const [type] = useState('bill');
  const [category, setCategory] = useState('');
  const [referenceNo, setReferenceNo] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverContact, setReceiverContact] = useState('');
  const [receiverAccountNo, setReceiverAccountNo] = useState('');
  const [receiverBank, setReceiverBank] = useState('');
  const [note, setNote] = useState('');
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const inputStyle = {
    backgroundColor: dark ? COLORS.dark2 : '#fff',
    color: dark ? COLORS.white : COLORS.black,
    borderWidth: 1,
    borderColor: dark ? COLORS.greyscale900 : COLORS.grayscale200,
    ...styles.input,
  };

  const renderError = (field: string) =>
    errors[field] ? (
      <Text style={styles.errorText}>{errors[field][0]}</Text>
    ) : null;

  const storePaymentSchedule = useMutation({
    mutationFn: (data: any) => STORE_BILL_REMINDER(data, token),
    onSuccess: (data) => {
      if (data?.status) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Payment scheduled successfully',
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
        text1: 'Validation Error',
        text2: 'Please fill all required fields.',
      });
    },
  });

  const handleSubmit = () => {
    Keyboard.dismiss();
    setErrors({});
    storePaymentSchedule.mutate({
      user_id: userId,
      amount,
      scheduled_for: scheduledFor,
      purpose,
      type,
      category,
      reference_no: referenceNo,
      receiver_name: receiverName,
      receiver_contact: receiverContact,
      receiver_account_no: receiverAccountNo,
      receiver_bank: receiverBank,
      note,
    });
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Header title="Schedule Payment" />

        <View style={styles.content}>
          <Image
            source={icons.security}
            style={styles.icon}
            resizeMode="contain"
          />

          <Text style={[styles.title, { color: colors.text }]}>
            Schedule a Payment
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
            ]}>
            Fill in the payment details to schedule a future transaction.
          </Text>

          <TextInput
            placeholder="Purpose"
            placeholderTextColor={dark ? COLORS.greyscale500 : COLORS.greyscale600}
            value={purpose}
            onChangeText={setPurpose}
            style={inputStyle}
          />
          {renderError('purpose')}

          <TextInput
            placeholder="Amount"
            placeholderTextColor={dark ? COLORS.greyscale500 : COLORS.greyscale600}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={inputStyle}
          />
          {renderError('amount')}

          <TextInput
            placeholder="Category"
            placeholderTextColor={dark ? COLORS.greyscale500 : COLORS.greyscale600}
            value={category}
            onChangeText={setCategory}
            style={inputStyle}
          />
          {renderError('category')}

          <TouchableOpacity
            style={[inputStyle, { flexDirection: 'row', alignItems: 'center' }]}
            onPress={() => setOpenDatePicker(true)}>
            <Feather name="calendar" size={24} color={COLORS.grayscale400} />
            <Text style={{ ...FONTS.body4, color: COLORS.grayscale400, marginLeft: 8 }}>
              {scheduledFor}
            </Text>
          </TouchableOpacity>
          {renderError('scheduled_for')}

          {openDatePicker && (
            <DatePickerModal
              open={openDatePicker}
              startDate={formattedTomorrow}
              selectedDate={scheduledFor}
              onClose={() => setOpenDatePicker(false)}
              onChangeStartDate={setScheduledFor}
            />
          )}

          <TextInput
            placeholder="Reference No"
            placeholderTextColor={dark ? COLORS.greyscale500 : COLORS.greyscale600}
            value={referenceNo}
            onChangeText={setReferenceNo}
            style={inputStyle}
          />
          {renderError('reference_no')}

          <TextInput
            placeholder="Receiver Name"
            placeholderTextColor={dark ? COLORS.greyscale500 : COLORS.greyscale600}
            value={receiverName}
            onChangeText={setReceiverName}
            style={inputStyle}
          />
          {renderError('receiver_name')}

          <TextInput
            placeholder="Receiver Contact"
            placeholderTextColor={dark ? COLORS.greyscale500 : COLORS.greyscale600}
            keyboardType="phone-pad"
            value={receiverContact}
            onChangeText={setReceiverContact}
            style={inputStyle}
          />
          {renderError('receiver_contact')}

          <TextInput
            placeholder="Receiver Account No"
            placeholderTextColor={dark ? COLORS.greyscale500 : COLORS.greyscale600}
            value={receiverAccountNo}
            onChangeText={setReceiverAccountNo}
            style={inputStyle}
          />
          {renderError('receiver_account_no')}

          <TextInput
            placeholder="Receiver Bank"
            placeholderTextColor={dark ? COLORS.greyscale500 : COLORS.greyscale600}
            value={receiverBank}
            onChangeText={setReceiverBank}
            style={inputStyle}
          />
          {renderError('receiver_bank')}

          <TextInput
            placeholder="Note"
            placeholderTextColor={dark ? COLORS.greyscale500 : COLORS.greyscale600}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            style={[inputStyle, { height: 80, textAlignVertical: 'top' }]}
          />
          {renderError('note')}

          <Button
            title="Schedule Payment"
            onPress={handleSubmit}
            filled
            style={styles.button}
            loading={storePaymentSchedule.isLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
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

export default AddSchedulePayment;

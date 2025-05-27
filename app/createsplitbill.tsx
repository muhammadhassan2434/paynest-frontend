import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Button from '@/components/Button';
import Header from '@/components/Header';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, FONTS } from '@/constants';
import { useAuth } from '@/utils/hooks/AuthContext';
import Toast from 'react-native-toast-message';
import { useMutation } from '@tanstack/react-query';
import { CREATE_SPLIT_BILL } from '@/utils/mutations/splitbill'; // <-- create this mutation

const CreateSplitBill = () => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const {account, userId, token } = useAuth();
  const [receiverAccountNo, setReceiverAccountNo] = useState('');
  const [receiverBank, setReceiverBank] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
//  const authPhone = account.?phone; 
  const [members, setMembers] = useState([
  { phone: account[0].phone|| '', amount: '' }
]);
  const splitBillMutation = useMutation({
      mutationFn: (data: any) => CREATE_SPLIT_BILL(data, token),
    onSuccess: (data) => {
  if (data?.status === true || data?.status === 'true') {
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Split bill created successfully',
    });
    navigation.goBack();
  } else {
    console.log("Error Response:", data); 
    if (data?.errors) {
      setErrors(data.errors); 
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please correct the highlighted fields',
      });
    } else if (data?.message) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: data.message,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong',
      });
    }
  }
}
,
    onError: (error) => {
        console.log(error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong',
      });
    },
  });

 const handleAddMember = () => {
  const newMembers = [...members, { phone: '', amount: '' }];

  if (!isNaN(parseFloat(totalAmount)) && totalAmount !== '') {
    const split = (parseFloat(totalAmount) / newMembers.length).toFixed(2);
    const updatedMembers = newMembers.map((member) => ({
      ...member,
      amount: split,
    }));
    setMembers(updatedMembers);
  } else {
    setMembers(newMembers);
  }
};


 const handleTotalAmountChange = (value: string) => {
  setTotalAmount(value);

  const num = parseFloat(value);
  if (!isNaN(num) && members.length > 0) {
    const split = (num / members.length).toFixed(2);
    const updatedMembers = members.map((member) => ({
      ...member,
      amount: split,
    }));
    setMembers(updatedMembers);
  }
};
 


  const handleMemberChange = (index: number, key: 'phone' | 'amount', value: string) => {
    const updated = [...members];
    updated[index][key] = value;
    setMembers(updated);
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    setErrors({});

    const payload = {
  user_id: userId,
  receiver_account_no: receiverAccountNo,
  receiver_bank: receiverBank,
  total_amount: parseFloat(totalAmount), // <- Ensure it's a number
  title,
  note,
  members: members.map(m => ({
    phone: m.phone,
    amount: parseFloat(m.amount || '0')
  })),
};
              console.log(payload)



    splitBillMutation.mutate(payload);
  };

  const renderError = (field: string) =>
    errors[field] ? <Text style={styles.errorText}>{errors[field][0]}</Text> : null;

  const inputStyle = {
    backgroundColor: dark ? COLORS.dark2 : '#fff',
    color: dark ? COLORS.white : COLORS.black,
    borderWidth: 1,
    borderColor: dark ? COLORS.greyscale900 : COLORS.grayscale200,
    ...styles.input,
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Header title="Split Bill" />
        <Text style={[styles.title, { color: colors.text }]}>
                    Split bill here
                  </Text>
                  <Text
                    style={[
                      styles.subtitle,
                      { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                    ]}>
                     Never forget to settle up. Set reminders for shared expenses with friends
                  </Text>

        <TextInput
          placeholder="Receiver Account No"
          value={receiverAccountNo}
          onChangeText={setReceiverAccountNo}
          style={inputStyle}
        />
        {renderError('receiver_account_no')}

        <TextInput
          placeholder="Receiver Bank"
          value={receiverBank}
          onChangeText={setReceiverBank}
          style={inputStyle}
        />
        {renderError('receiver_bank')}

       <TextInput
  placeholder="Total Amount"
  value={totalAmount}
  onChangeText={handleTotalAmountChange}
  keyboardType="numeric"
  style={inputStyle}
/>

        {renderError('total_amount')}

        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={inputStyle}
        />
        {renderError('title')}

        <TextInput
          placeholder="Note (optional)"
          value={note}
          onChangeText={setNote}
          style={inputStyle}
        />
        {renderError('note')}

        <Text style={[styles.memberTitle, { color: colors.text }]}>Members</Text>

        {members.map((member, index) => (
  <View key={index} style={styles.memberContainer}>
    <TextInput
      placeholder="Phone"
      value={member.phone}
      onChangeText={(value) => handleMemberChange(index, 'phone', value)}
      editable={index !== 0} // Disable editing for the first member
      style={[
        inputStyle,
        index === 0 && { backgroundColor: '#f0f0f0', color: '#999' },
      ]}
      keyboardType="phone-pad"
    />
    {renderError(`members.${index}.phone`)}

    <TextInput
      placeholder="Amount"
      value={member.amount}
      onChangeText={(value) => handleMemberChange(index, 'amount', value)}
      style={inputStyle}
      keyboardType="numeric"
    />
    {renderError(`members.${index}.amount`)}
  </View>
))}


        <TouchableOpacity onPress={handleAddMember} style={styles.addMemberBtn}>
          <Text style={styles.addMemberText}>+ Add Member</Text>
        </TouchableOpacity>

        <Button
          title="Create Split Bill"
          onPress={handleSubmit}
          filled
          style={styles.button}
          loading={splitBillMutation.isLoading}
        />
      </ScrollView>
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
  input: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    fontSize: 16,
    fontFamily: 'regular',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  button: {
    marginTop: 20,
    width: '100%',
  },
  memberTitle: {
    fontSize: 18,
    fontFamily: 'bold',
    marginVertical: 10,
  },
  memberContainer: {
    marginBottom: 12,
  },
  addMemberBtn: {
    marginVertical: 10,
  },
  addMemberText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: 'medium',
  },
  title: {
    fontSize: 22,
    fontFamily: 'bold',
    textAlign: 'center',
    margin: 14,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'regular',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 12,
  },
});

export default CreateSplitBill;

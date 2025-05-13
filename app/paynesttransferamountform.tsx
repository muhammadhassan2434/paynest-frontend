import { View, StyleSheet, Text, TextInput } from 'react-native';
import React, { useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, SIZES } from '@/constants';
import Header from '@/components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import Button from '@/components/Button';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/utils/hooks/AuthContext';
import Toast from 'react-native-toast-message';
import { useMutation } from '@tanstack/react-query';
import { VALIDATE_PAYNEST_AMOUNT } from '@/utils/mutations/paynesttransfer'; 

type Nav = {
  navigate: (screen: string, params?: any) => void;
};

const PaynestTransferAmountForm = () => {
  const amountRef = useRef<TextInput>(null);
  const amountValueRef = useRef('');
  const { navigate } = useNavigation<Nav>();
  const { colors, dark } = useTheme();
  const { reciever_number } = useLocalSearchParams();
  const { account, token } = useAuth();

  const initiateTransfer = useMutation({
    mutationFn: (payload: {
      amount: string;
      reciever_number: string;
      account_id: string;
    }) => VALIDATE_PAYNEST_AMOUNT(payload, token),
    onSuccess: (data) => {
      if (data?.status) {
        navigate("paynesttransfersummary", {
          amount: data.amount,
          reciever_number: data.reciever_number,
          reciever_paynestid: data.reciever_paynestid,
          reciever_name: data.reciever_name,
          reciever_email: data.reciever_email,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Transfer Failed",
          text2: data?.message || "Something went wrong",
        });
      }
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.message || "Try again later",
      });
    },
  });

  const handleContinue = () => {
    const amount = amountValueRef.current.trim();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Toast.show({
        type: "error",
        text1: "Invalid Amount",
        text2: "Please enter a valid transfer amount.",
      });
      return;
    }

    initiateTransfer.mutate({
      amount,
      reciever_number: String(reciever_number),
      account_id: account?.[0]?.id,
    });
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Transfer to Your Bank" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.separateLine, {
            backgroundColor: dark ? COLORS.greyscale900 : COLORS.grayscale200
          }]} />
          <Text style={[styles.amountText, {
            color: dark ? COLORS.grayscale400 : COLORS.greyScale800
          }]}>Enter the amount to transfer</Text>
          <TextInput
            ref={amountRef}
            placeholder=' Rs 1000'
            keyboardType="numeric"
            placeholderTextColor={dark ? COLORS.white : COLORS.greyscale900}
            onChangeText={(val) => (amountValueRef.current = val)}
            style={[styles.amountInput, {
              color: dark ? COLORS.white : COLORS.greyscale900,
            }]}
          />
          <Text style={[styles.amountText, {
            color: dark ? COLORS.grayscale400 : COLORS.greyScale800
          }]}>Available balance:  {account?.[0]?.balance}</Text>
          <View style={[styles.separateLine, {
            backgroundColor: dark ? COLORS.greyscale900 : COLORS.grayscale200
          }]} />
        </ScrollView>
      </View>
      <View style={styles.bottomContainer}>
        <Button
          title="Continue"
          style={styles.sendBtn}
          onPress={handleContinue}
          filled
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  separateLine: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginVertical: 16
  },
  amountText: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.greyScale800,
    marginVertical: 16,
    textAlign: "center"
  },
  amountInput: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 131,
    borderWidth: 3,
    borderColor: COLORS.primary,
    borderRadius: 24,
    fontSize: 48,
    fontFamily: "bold",
    textAlign: "center"
  },
  bottomContainer: {
    position: "absolute",
    bottom: 28,
    right: 0,
    left: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16
  },
  sendBtn: {
    width: SIZES.width - 32
  }
});

export default PaynestTransferAmountForm;

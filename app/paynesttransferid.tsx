import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, SIZES, icons, images } from '@/constants';
import { Image } from 'expo-image';
import Button from '@/components/Button';
import { useNavigation } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { VALIDATE_PAYNEST_NUMBER } from '../utils/mutations/paynesttransfer';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/utils/hooks/AuthContext';


type Nav = {
  navigate: (value: string, params?: any) => void;
};

const PaynestTransferId = () => {
  const { colors, dark } = useTheme();
  const { token } = useAuth();
  const { navigate } = useNavigation<Nav>();
  const [value, setValue] = useState<string>('');

  const validateMutation = useMutation({
    mutationFn: (data: { reciever_number: string }) => VALIDATE_PAYNEST_NUMBER(data,token),
    onSuccess: (data) => {
      if (data?.status) {
        navigate("paynesttransferamountform", {
          reciever_number: data?.reciever_number
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Validation Failed',
          text2: data?.message || 'Invalid number'
        });
      }
      console.log(data)
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: error?.message || 'Please try again later'
      });
    }
  });
  

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Paynest Transfer" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.viewContainer}>
            
            <Text style={[styles.title, {
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}>Paynest Transfer</Text>
            <View style={{ marginVertical: 12 }}>
              <Text style={[styles.subtitle, {
                color: dark ? COLORS.greyscale300 : COLORS.greyScale800
              }]}>Your Money, Your Way  Instantly with Paynest.</Text>
              <Text style={[styles.subtitle, {
                color: dark ? COLORS.greyscale300 : COLORS.greyScale800
              }]}>You can pay anytime and anywhere!</Text>
            </View>
            <View style={[styles.separateLine, {
              backgroundColor: dark ? COLORS.greyscale900 : COLORS.grayscale200
            }]} />
          </View>
          <Text style={[styles.idText, {
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>Transfer To Paynest:</Text>
          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder='37173838939'
            style={[styles.idInput, {
              backgroundColor: dark ? COLORS.dark2 : "#FAFAFA",
              color: dark ? COLORS.white : COLORS.greyscale900,
            }]}
            placeholderTextColor={dark ? COLORS.white : COLORS.greyscale900}
          />
          <Button
            title="Verify"
            filled
            style={styles.continueBtn}
            onPress={() => {
              if (!value) {
                Toast.show({
                  type: 'error',
                  text1: 'Validation Error',
                  text2: 'Please enter a receiver number.'
                });
                return;
              }
            
              validateMutation.mutate({ reciever_number: value });
            }}
            
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16
  },
  
  viewContainer: {
    alignItems: "center",
    marginTop: 32
  },
  title: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginTop: 32
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.greyScale800,
    textAlign: "center",
  },
  separateLine: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginVertical: 16
  },
  idText: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginBottom: 12
  },
  idInput: {
    width: SIZES.width - 32,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FAFAFA",
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.greyscale900,
    paddingHorizontal: 12
  },
  continueBtn: {
    marginVertical: 22
  }
})

export default PaynestTransferId
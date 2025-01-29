import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '@/constants'; // Update with your constants if needed
import Button from '@/components/Button';
import { useNavigation } from '@react-navigation/native'; // Navigation hook

const OTPVerification = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const navigation = useNavigation(); // Navigation hook

  // Function to send OTP
  const sendOtp = () => {
    if (phoneNumber.length < 10) {
      Alert.alert('Invalid phone number', 'Please enter a valid phone number.');
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    setGeneratedOtp(otp);
    setIsOtpSent(true);
    Alert.alert('OTP Sent', `Your OTP is ${otp}`); // Replace this with actual SMS service in production
  };

  // Function to verify OTP
  const verifyOtp = () => {
    if (otp === generatedOtp) {
      Alert.alert('Success', 'OTP Verified Successfully!');
      setPhoneNumber('');
      setOtp('');
      setIsOtpSent(false);

      // Navigate to the home screen
      navigation.navigate('login'); // Replace 'Home' with your home screen's route name
    } else {
      Alert.alert('Failed', 'Invalid OTP. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      {!isOtpSent ? (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <Button
            title="Send OTP"
            filled
            style={styles.button}
            onPress={sendOtp}
          />
        </View>
      ) : (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter OTP</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
          />
          <Button
            title="Verify OTP"
            filled
            style={styles.button}
            onPress={verifyOtp}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    fontFamily: 'bold',
    marginBottom: 16,
    color: COLORS.primary,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.greyscale900,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.grayscale200,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: COLORS.white,
    marginBottom: 16,
  },
  button: {
    marginTop: 12,
    borderRadius: 32,
    width: '100%',
  },
});

export default OTPVerification;

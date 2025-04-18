import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { COLORS } from "../constants";
import { OtpInput } from "react-native-otp-entry";
import Button from "../components/Button";
import { useTheme } from "../theme/ThemeProvider";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { VERIFY_OTP } from "@/utils/mutations/accountCreationMutation";

type Nav = {
  navigate: (value: string, params?: any) => void;
};

const OTPVerification = () => {
  const { navigate } = useNavigation<Nav>();
  const [time, setTime] = useState(2000);
  const { colors, dark } = useTheme();
  const { user_id = null } = useLocalSearchParams();
  const [otp, setOtp] = useState(""); // OTP state

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const { mutate: verifyOtp, isPending } = useMutation({
    mutationFn: VERIFY_OTP,
    onSuccess: (data) => {
      if (!data || !data.status) {
        Alert.alert("Error", data?.message || "Verification failed.");
        return;
      }

      Alert.alert("Success", "OTP Verified Successfully", [
        { text: "OK", onPress: () => navigate("fillyourprofile", { user_id : data.user_id }) },
      ]);
    },
    onError: (error: any) => {
      console.error("OTP verification error:", error);
      Alert.alert("OTP Failed", error?.message || "Invalid OTP");
    },
  });

  // Handle OTP change and log it
  const handleOtpChange = (text: string) => {
    console.log(`OTP entered: ${text}`);
    setOtp(text); // Update the OTP state
  };

  const handleVerifyPress = () => {
    console.log("user_id:", user_id);
    console.log("otp:", otp);

    if (!otp) {
      Alert.alert("Error", "Please enter the OTP first");
      return;
    }

    if (!user_id) {
      Alert.alert("Error", "User ID is missing");
      return;
    }

    if (otp.length !== 4) {
      Alert.alert("Error", "OTP must be 4 digits");
      return;
    }

    verifyOtp({ user_id, otp }); // Proceed with OTP verification
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Otpverification" />
        <ScrollView>
          <Text
            style={[
              styles.title,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Code has been sent to your email
          </Text>

          <OtpInput
            numberOfDigits={4}
            onTextChange={handleOtpChange} 
            focusColor={COLORS.primary}
            focusStickBlinkingDuration={500}
            onFilled={(text) => {
              console.log(`OTP filled: ${text}`);
              setOtp(text); // Store filled OTP
            }}
            theme={{
              pinCodeContainerStyle: {
                backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite,
                borderColor: dark ? COLORS.gray : COLORS.secondaryWhite,
                borderWidth: 0.4,
                borderRadius: 10,
                height: 58,
                width: 58,
              },
              pinCodeTextStyle: {
                color: dark ? COLORS.white : COLORS.black,
              },
            }}
          />

          {/* <View style={styles.codeContainer}>
            <Text
              style={[
                styles.code,
                { color: dark ? COLORS.white : COLORS.greyscale900 },
              ]}
            >
              Resend code in
            </Text>
            <Text style={styles.time}>{` ${time} `}</Text>
            <Text
              style={[
                styles.code,
                { color: dark ? COLORS.white : COLORS.greyscale900 },
              ]}
            >
              s
            </Text>
          </View> */}
        </ScrollView>

        <Button
          title="Verify"
          filled
          style={styles.button}
          onPress={handleVerifyPress}
          disabled={isPending}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 18,
    fontFamily: "medium",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 54,
  },
  OTPStyle: {
    borderRadius: 8,
    height: 58,
    width: 58,
    backgroundColor: COLORS.white,
    borderBottomColor: "gray",
    borderBottomWidth: 0.4,
    borderWidth: 0.4,
    borderColor: "gray",
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    justifyContent: "center",
  },
  code: {
    fontSize: 18,
    fontFamily: "medium",
    color: COLORS.greyscale900,
    textAlign: "center",
  },
  time: {
    fontFamily: "medium",
    fontSize: 18,
    color: COLORS.primary,
  },
  button: {
    borderRadius: 32,
  },
});

export default OTPVerification;

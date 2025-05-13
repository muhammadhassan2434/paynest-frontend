import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { useTheme } from "@/theme/ThemeProvider";
import { COLORS, SIZES, icons } from "@/constants";
import { Image } from "expo-image";
import Button from "@/components/Button";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { VALIDATE_CONSUMER_NUMBER } from "@/utils/mutations/billpayment";
import { useAuth } from "@/utils/hooks/AuthContext";
import Toast from "react-native-toast-message";

type Nav = {
  navigate: (
    screen: string,
    params?: {
      bill_provider: number;
      consumer_number: string;
      customer_name: string;
      amount: string;
      due_date: string;
    }
  ) => void;
};

const PayBillsElectricityCustomerId = () => {
  const { colors, dark } = useTheme();
  const route = useRoute();
  const { providerId } = route.params as { providerId: number };
  const { navigate } = useNavigation<Nav>();
  const [value, setValue] = useState<string>("");
  const { token } = useAuth();
  const handleContinue = async () => {
    if (!value) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter Customer ID",
      });
      return;
    }

    if (!providerId) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Provider ID is missing",
      });
      return;
    }

    try {
      const payload = {
        consumer_number: value,
        service_provider_id: providerId,
      };

      const response = await VALIDATE_CONSUMER_NUMBER(payload, token);

      if (response?.status === true) {
        navigate("paybillselectricityreviewsummary", {
          bill_provider: providerId,
          consumer_number: response.consumer_number,
          customer_name: response.customer_name,
          amount: response.amount,
          due_date: response.due_date,
        });
      } else {
        // Show all validation errors
        if (response?.errors && typeof response.errors === "object") {
          Object.values(response.errors).forEach((messages: any) => {
            if (Array.isArray(messages)) {
              Toast.show({
                type: "error",
                text1: "Validation Failed",
                text2: messages[0],
              });
            }
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Validation Failed",
            text2: response?.message || "Invalid input.",
          });
        }
      }
    } catch (errors) {
      console.error("Validation Error", errors);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter correct consumer id.",
      });
    }
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Electricity" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.viewContainer}>
            <View style={styles.iconContainer}>
              <Image
                source={icons.electricity}
                contentFit="contain"
                style={styles.icon}
              />
            </View>
            <Text
              style={[
                styles.title,
                {
                  color: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            >
              Pay Electricity Bill
            </Text>
            <View style={{ marginVertical: 12 }}>
              <Text
                style={[
                  styles.subtitle,
                  {
                    color: dark ? COLORS.greyscale300 : COLORS.greyScale800,
                  },
                ]}
              >
                Pay electricity bills safely, conveniently & easily.
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  {
                    color: dark ? COLORS.greyscale300 : COLORS.greyScale800,
                  },
                ]}
              >
                You can pay anytime and anywhere!
              </Text>
            </View>
            <View
              style={[
                styles.separateLine,
                {
                  backgroundColor: dark
                    ? COLORS.greyscale900
                    : COLORS.grayscale200,
                },
              ]}
            />
          </View>
          <Text
            style={[
              styles.idText,
              {
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          >
            Customer ID
          </Text>
          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder="37173838939"
            style={[
              styles.idInput,
              {
                backgroundColor: dark ? COLORS.dark2 : "#FAFAFA",
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
            placeholderTextColor={dark ? COLORS.white : COLORS.greyscale900}
          />
          <Button
            title="Continue"
            filled
            style={styles.continueBtn}
            onPress={handleContinue}
          />
        </ScrollView>
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
    backgroundColor: COLORS.white,
    padding: 16,
  },
  iconContainer: {
    height: 124,
    width: 124,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "rgba(255, 211, 0, .12)",
  },
  icon: {
    height: 60,
    width: 60,
    tintColor: "#FFD300",
  },
  viewContainer: {
    alignItems: "center",
    marginTop: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginTop: 32,
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
    marginVertical: 16,
  },
  idText: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginBottom: 12,
  },
  idInput: {
    width: SIZES.width - 32,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FAFAFA",
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.greyscale900,
    paddingHorizontal: 12,
  },
  continueBtn: {
    marginVertical: 22,
  },
});

export default PayBillsElectricityCustomerId;

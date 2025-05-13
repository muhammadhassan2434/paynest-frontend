import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { ScrollView } from "react-native-virtualized-view";
import { useTheme } from "@/theme/ThemeProvider";
import { COLORS, SIZES, icons, images } from "@/constants";
import { Image } from "expo-image";
import Button from "@/components/Button";
import { useNavigation } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/utils/hooks/AuthContext";
import Toast from 'react-native-toast-message';
import { STORE_BILL_PAYMENT } from "@/utils/mutations/billpayment";

type Nav = {
  navigate: (value: string) => void;
};

const PayBillsElectricityReviewSummary = () => {
  const { colors, dark } = useTheme();
  const { navigate } = useNavigation<Nav>();
  const params = useLocalSearchParams();
  const { userId, token } = useAuth();
  const { bill_provider, consumer_number, customer_name, amount, due_date } = params;
  console.log(bill_provider)

const handleContinue = async () => {
  if (!consumer_number || !bill_provider || !amount || !due_date || !customer_name || !userId) {
    Toast.show({
      type: "error",
      text1: "Validation Error",
      text2: "Please enter all required fields.",
    });
    console.log('Missing fields:', { consumer_number, bill_provider, amount, due_date, customer_name, userId });
    return;
  }

  try {
    const payload = {
      consumer_number: consumer_number,
      service_provider_id: bill_provider,
      user_id: userId,
      amount: amount,
      due_date: due_date,
      customer_name: customer_name,
    };

    console.log('Payload:', payload);

    // ✅ Await the async call here
    const response = await STORE_BILL_PAYMENT(payload, token);

    console.log('API Response:', response);

    if (response?.status === true) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Bill payment stored successfully.",
      });
      navigate("paybillssuccessful");
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: response?.message || "Something went wrong.",
      });
      console.error("Error response:", response);
    }
  } catch (error) {
  const err = error as { message?: string };

  console.error("Error storing bill payment", err);
  Toast.show({
    type: "error",
    text1: "Error",
    text2: err.message || "Something went wrong.",
  });
}

};




  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Electricity" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.viewViewContainer}>
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
          <View
            style={[
              styles.viewContainer,
              {
                backgroundColor: dark ? COLORS.dark2 : "#FAFAFA",
              },
            ]}
          >
            <View
              style={[
                styles.separateLine,
                {
                  backgroundColor: dark
                    ? COLORS.greyScale800
                    : COLORS.grayscale200,
                },
              ]}
            />
            <View style={styles.view}>
              <Text
                style={[
                  styles.viewLeft,
                  {
                    color: dark ? COLORS.greyscale300 : COLORS.grayscale700,
                  },
                ]}
              >
                Bill Amount (PKR)
              </Text>
              <Text
                style={[
                  styles.viewRight,
                  {
                    color: dark ? COLORS.white : COLORS.greyscale900,
                  },
                ]}
              >
                RS {amount}
              </Text>
            </View>
            <View style={styles.view}>
              <Text
                style={[
                  styles.viewLeft,
                  {
                    color: dark ? COLORS.greyscale300 : COLORS.grayscale700,
                  },
                ]}
              >
                Name
              </Text>
              <Text
                style={[
                  styles.viewRight,
                  {
                    color: dark ? COLORS.white : COLORS.greyscale900,
                  },
                ]}
              >
                {customer_name}
              </Text>
            </View>
            <View style={styles.view}>
              <Text
                style={[
                  styles.viewLeft,
                  {
                    color: dark ? COLORS.greyscale300 : COLORS.grayscale700,
                  },
                ]}
              >
                Customer ID
              </Text>
              <Text
                style={[
                  styles.viewRight,
                  {
                    color: dark ? COLORS.white : COLORS.greyscale900,
                  },
                ]}
              >
                {consumer_number}
              </Text>
            </View>
            <View style={styles.view}>
              <Text
                style={[
                  styles.viewLeft,
                  { color: dark ? COLORS.greyscale300 : COLORS.grayscale700 },
                ]}
              >
                Due Date
              </Text>
              <Text
                style={[
                  styles.viewRight,
                  { color: dark ? COLORS.white : COLORS.greyscale900 },
                ]}
              >
                {due_date}
              </Text>
            </View>
            <View
              style={[
                styles.separateLine,
                {
                  backgroundColor: dark
                    ? COLORS.greyScale800
                    : COLORS.grayscale200,
                },
              ]}
            />
            <View style={styles.view}>
              <Text
                style={[
                  styles.viewLeft,
                  {
                    color: dark ? COLORS.greyscale300 : COLORS.grayscale700,
                  },
                ]}
              >
                Status
              </Text>
              <View style={styles.paidBtn}>
                <Text style={styles.paidBtnText}>Unpaid</Text>
              </View>
            </View>
          </View>
          <Button
            title="Confirm & Pay Now"
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
    backgroundColor: "rgba(255, 211, 0, .12)",
  },
  icon: {
    height: 60,
    width: 60,
    tintColor: "#FFD300",
  },
  viewViewContainer: {
    alignItems: "center",
    marginTop: 22,
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
    marginVertical: 12,
  },
  continueBtn: {
    marginVertical: 22,
  },
  viewContainer: {
    width: SIZES.width - 32,
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 6,
    marginVertical: 2,
    alignItems: "center",
  },
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
    width: SIZES.width - 32,
    paddingHorizontal: 10,
  },
  viewLeft: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.grayscale700,
  },
  viewRight: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.greyscale900,
  },
  paidBtn: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 6,
  },
  paidBtnText: {
    fontSize: 10,
    fontFamily: "regular",
    color: COLORS.white,
  },
});

export default PayBillsElectricityReviewSummary;

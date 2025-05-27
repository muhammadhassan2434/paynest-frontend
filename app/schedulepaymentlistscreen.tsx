import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Header from "@/components/Header";
import { useTheme } from "@/theme/ThemeProvider";
import { COLORS } from "@/constants";
import Button from "@/components/Button";
import Toast from "react-native-toast-message";
import { useAuth } from "@/utils/hooks/AuthContext";
import useFetchServices from "@/hooks/services";
import { DELETE_BILL_REMINDER } from "@/utils/mutations/billreminder";
import {
  CANCEL_SCHEDULE_PAYMENT,
  GET_ALL_SCHEDULE_PAYMENT,
  GET_CANCELLED_SCHEDULE_PAYMENT,
  GET_EXECUTED_SCHEDULE_PAYMENT,
  GET_FAILED_SCHEDULE_PAYMENT,
  GET_REFUNDED_SCHEDULE_PAYMENT,
} from "@/utils/mutations/schedulepayment";

type Schedule = {
  id: string;
  purpose: string;
  scheduled_for: string;
  is_notified: number;
  status?: "pending" | "success";
};

type Nav = {
  navigate: (screen: string, params?: any) => void;
};

const tabs = ["All", "Executed", "Cancelled", "Failed"];

const ShedulePayment = () => {
  const { colors, dark } = useTheme();
  const [selectedTab, setSelectedTab] = useState<string>("All");
  const navigation = useNavigation();
  const { account, userId, token, getUserInfo } = useAuth();
  const heldBalance = account?.[0]?.held_balance || "0.00";
  const accountId = account[0].id;

   useFocusEffect(
      useCallback(() => {
        const fetchUserInfo = async () => {
          if (token && account && account.length > 0) {
            await getUserInfo(); // Updates only account state
          }
        };
      
        fetchUserInfo();
      }, [token, account?.[0]?.id]) 
    );

  const {
    data: allScheduleData,
    isLoading: allSchedulePaymentLoading,
    isError: allSchedulePaymentError,
    refetch: refetchallSchedulePayment,
  } = useFetchServices(["fetch_all_schedule_payments"], () =>
    GET_ALL_SCHEDULE_PAYMENT({ account_id: accountId }, token)
  );

  const {
    data: exedutedData,
    isLoading: executedSchedulePaymentLoading,
    isError: executedSchedulePaymentError,
    refetch: refetchexecutedSchedulePayment,
  } = useFetchServices(["fetch_executed_schedule_payments"], () =>
    GET_EXECUTED_SCHEDULE_PAYMENT({ account_id: accountId }, token)
  );

  const {
    data: cancelledScheduleData,
    isLoading: cancelledSchedulePaymentLoading,
    isError: cancelledSchedulePaymentError,
    refetch: refetchcancelledSchedulePayment,
  } = useFetchServices(["fetch_cancelled_schedule_payments"], () =>
    GET_CANCELLED_SCHEDULE_PAYMENT({ account_id: accountId }, token)
  );
  const {
    data: failedScheduleData,
    isLoading: failedSchedulePaymentLoading,
    isError: failedSchedulePaymentError,
    refetch: refetchfailedSchedulePayment,
  } = useFetchServices(["fetch_failed_schedule_payments"], () =>
    GET_FAILED_SCHEDULE_PAYMENT({ account_id: accountId }, token)
  );
  const {
    data: refundedScheduleData,
    isLoading: refundedSchedulePaymentLoading,
    isError: refundedSchedulePaymentError,
    refetch: refetchrefundedSchedulePayment,
  } = useFetchServices(["fetch_refunded_schedule_payments"], () =>
    GET_REFUNDED_SCHEDULE_PAYMENT({ account_id: accountId }, token)
  );

  const allSchedulePayment = allScheduleData?.schedulePayment;
  const executedPaymentSchedule = exedutedData?.schedulePayment;
  const cancelledSchedulePayment = cancelledScheduleData?.schedulePayment;
  const failedSchedulePayment = failedScheduleData?.schedulePayment;
  const refundedSchedulePayment = refundedScheduleData?.schedulePayment;

  // console.log(allSchedulePayment);

  useFocusEffect(
    useCallback(() => {
      refetchexecutedSchedulePayment();
    }, [refetchexecutedSchedulePayment])
  );
  useFocusEffect(
    useCallback(() => {
      refetchallSchedulePayment();
    }, [refetchallSchedulePayment])
  );
  useFocusEffect(
    useCallback(() => {
      refetchfailedSchedulePayment();
    }, [refetchfailedSchedulePayment])
  );
  useFocusEffect(
    useCallback(() => {
      refetchcancelledSchedulePayment();
    }, [refetchcancelledSchedulePayment])
  );

  const cancelSchedule = async (id: string, token: any) => {
    console.log("Deleting reminder with id: ", token); // Debugging the id being passed

    try {
      const response = await CANCEL_SCHEDULE_PAYMENT(id, token);
      if (response.status) {
        console.log("Delete response:", response);
        // setReminders((prevReminders) =>
        //   prevReminders.filter((reminder) => reminder.id !== id)
        // );
        refetchallSchedulePayment();
        refetchexecutedSchedulePayment();
        refetchfailedSchedulePayment();
         getUserInfo();
        refetchcancelledSchedulePayment();
        Toast.show({
          type: "success",
          text1: "Cancel",
          text2: "Schedule  cancelled and funds returned",
        });
      } else {
        throw new Error("Failed to delete schedule");
      }
    } catch (error) {
      console.error("Error deleting reminder:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to delete schedule",
      });
    }
  };

  const renderSchedulePayment: ListRenderItem<Schedule> = ({
    item,
  }: {
    item: Schedule;
  }) => (
    <View
      style={[
        styles.reminderCard,
        { backgroundColor: dark ? COLORS.dark2 : "#F0F0F0" },
      ]}
    >
      <TouchableOpacity
        style={styles.scheduleInfo}
        onPress={() =>
          navigation.navigate("scheduledetail", { Schedule: item })
        }
      >
        <Text
          style={[
            styles.billName,
            { color: dark ? COLORS.white : COLORS.black },
          ]}
        >
          {item.purpose}
        </Text>
        <Text
          style={[
            styles.billDate,
            { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
          ]}
        >
          {item.scheduled_for}
        </Text>
      </TouchableOpacity>

      {/* {item.is_notified == 0 && ( */}
      {selectedTab === "All" && (
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: COLORS.error }]}
            onPress={() => cancelSchedule(item.id, token)}
          >
            <Text style={styles.actionButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* )} */}
    </View>
  );

  const filteredSchedulePayments = (() => {
    if (selectedTab === "All") return allSchedulePayment;
    if (selectedTab === "Executed") return executedPaymentSchedule;
    if (selectedTab === "Refunded") return refundedSchedulePayment;
    if (selectedTab === "Cancelled") return cancelledSchedulePayment;
    if (selectedTab === "Failed") return failedSchedulePayment;
    return allSchedulePayment;
  })();

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Header title="Schedule Payment" />
        <View style={styles.cardcontainer}>
          <View style={styles.card}>
            <Text style={styles.balanceLabel}>PKR</Text>
            <Text style={styles.balance}>{heldBalance}</Text>
            <Text style={styles.header}>Total Held Balance</Text>
          </View>
        </View>
        <View style={styles.viewContainer}>
          <Button
            color="black"
            title="Create a Schedule Payment"
            onPress={() => navigation.navigate("addschedulepayment")}
            style={{
              marginBottom: 20,
              borderColor: "#35383F",
              borderWidth: 1,
              backgroundColor: "transparent",
            }}
            textColor="#35383F"
          />

          {/* NEW Tab bar */}
          <View style={styles.tabContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  {
                    backgroundColor:
                      selectedTab === tab
                        ? COLORS.primary
                        : dark
                        ? COLORS.dark2
                        : COLORS.grayscale200,
                  },
                ]}
                onPress={() => setSelectedTab(tab)}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    {
                      color: selectedTab === tab ? COLORS.white : COLORS.black,
                    },
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {allSchedulePaymentLoading ? (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Loading payments...
            </Text>
          ) : filteredSchedulePayments.length === 0 ? (
            <Text
              style={{
                color: dark ? COLORS.greyscale500 : COLORS.greyscale600,
                textAlign: "center",
                marginTop: 20,
              }}
            >
              No Payment Scheduled
            </Text>
          ) : (
            <FlatList
              data={filteredSchedulePayments}
              keyExtractor={(item) => item.id}
              renderItem={renderSchedulePayment}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: { flex: 1 },
  container: { flex: 1, padding: 16 },
  viewContainer: { flex: 1 },
  labelText: { fontSize: 18, fontFamily: "bold", marginBottom: 16 },
  reminderCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scheduleInfo: { flex: 1 },
  billName: { fontSize: 16, fontFamily: "bold" },
  billDate: { fontSize: 14, fontFamily: "regular", marginTop: 4 },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
    marginLeft: 16,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "bold",
  },
  title: {
    fontSize: 24,
    fontFamily: "bold",
    textAlign: "center",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "regular",
    textAlign: "center",
    marginBottom: 8,
  },
  tabContainer: {
    flexDirection: "row",
    overflow: 'scroll',
    justifyContent: "space-around",
    marginVertical: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  tabButtonText: {
    fontSize: 14,
    fontFamily: "bold",
  },

  cardcontainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  card: {
    width: "90%",
    borderRadius: 12,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 18,
    color: "#555",
  },
  balance: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
});

export default ShedulePayment;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";
import { useTheme } from "@/theme/ThemeProvider";
import { useAuth } from "@/utils/hooks/AuthContext";
import { SIZES, COLORS } from "@/constants";

interface DailyData {
  day: string;
  expense: string;
  income: string;
}

interface Summary {
  best_week: { week: number; income: string };
  worst_week: { week: number; income: string };
  average_value: number;
  transactions: number;
}

interface AnalyticsResponse {
  daily: DailyData[];
  summary: Summary;
}

const AnalyticsQuarterV1 = () => {
  const { userId, token } = useAuth();
  const { colors, dark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsResponse | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://paynest.coinxness.com/api/analytics/quarterly/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
    } catch (err) {
      console.error("Analytics fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to load analytics.</Text>
      </View>
    );
  }

  const labels = data.daily.map((d) => d.day.split("-")[2]); // get just the day part
  const incomeData = data.daily.map((d) => parseFloat(d.income));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text
        style={[styles.heading, { color: dark ? COLORS.white : COLORS.black }]}
      >
        Monthly Income
      </Text>

      <LineChart
        data={{
          labels,
          datasets: [{ data: incomeData }],
        }}
        width={SIZES.width - 32}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: COLORS.primary,
          backgroundGradientFrom: COLORS.primary,
          backgroundGradientTo: COLORS.primary,
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: () => COLORS.white,
        }}
        bezier
        style={styles.chart}
      />

      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <Text>
          📈 Best Week: Week {data.summary.best_week.week} — Rs.{" "}
          {data.summary.best_week.income}
        </Text>
        <Text>
          📉 Worst Week: Week {data.summary.worst_week.week} — Rs.{" "}
          {data.summary.worst_week.income}
        </Text>
        <Text>
          📊 Average Income: Rs. {data.summary.average_value.toFixed(2)}
        </Text>
        <Text>💰 Total Transactions: {data.summary.transactions}</Text>
      </View>

      <Text
        style={[
          styles.dailyTitle,
          { color: dark ? COLORS.white : COLORS.black },
        ]}
      >
        Daily Entries
      </Text>
      <FlatList
        data={data.daily}
        keyExtractor={(item) => item.day}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowText}>{item.day}</Text>
            <Text style={[styles.rowText, { color: COLORS.green }]}>
              + Rs .{item.income}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontFamily: "bold",
    marginBottom: 16,
  },
  chart: {
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryBox: {
    marginBottom: 24,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: "bold",
    marginBottom: 8,
  },
  dailyTitle: {
    fontSize: 16,
    fontFamily: "bold",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: COLORS.gray,
  },
  rowText: {
    fontSize: 14,
    fontFamily: "regular",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: COLORS.red,
  },
});

export default AnalyticsQuarterV1;

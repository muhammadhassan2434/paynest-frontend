import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS } from '@/constants';
import Header from '@/components/Header';

// Define the route params type
type Reminder = {
  id: string;
  bill_type: string;
  due_date: string;
  amount?: string;
  is_notified?: number;
  created_at?: string;
};

type RouteParams = {
  reminder: Reminder;
};

const BillReminderDetail = () => {
  const { colors, dark } = useTheme();
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const { reminder } = route.params;

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header title="Reminder Detail" />

        <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.black }]}>
          {reminder.bill_type}
        </Text>

        <View style={styles.detailBox}>
          <Text style={[styles.label, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}>Due Date:</Text>
          <Text style={[styles.value, { color: dark ? COLORS.white : COLORS.black }]}>{reminder.due_date}</Text>
        </View>

        {reminder.amount && (
          <View style={styles.detailBox}>
            <Text style={[styles.label, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}>Amount:</Text>
            <Text style={[styles.value, { color: dark ? COLORS.white : COLORS.black }]}>{reminder.amount}</Text>
          </View>
        )}
{reminder.is_notified !== undefined && (
  <View style={styles.detailBox}>
    <Text style={[styles.label, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}>
      Is Notification Sent:
    </Text>
    <Text
      style={[
        styles.value,
        {
          color: reminder.is_notified === 0 ? COLORS.error : COLORS.success, // red for "No", green for "Yes"
        },
      ]}
    >
      {reminder.is_notified === 0 ? 'No' : 'Yes'}
    </Text>
  </View>
)}


{reminder.created_at && (
  <View style={styles.detailBox}>
    <Text style={[styles.label, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}>
      Created At:
    </Text>
    <Text style={[styles.value, { color: dark ? COLORS.white : COLORS.black }]}>
      {new Date(reminder.created_at).toISOString().slice(0, 10)}
    </Text>
  </View>
)}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: { flex: 1 },
  container: { flexGrow: 1, padding: 16 },
  title: { fontSize: 24, fontFamily: 'bold', textAlign: 'center', marginVertical: 16 },
  detailBox: { marginBottom: 16 },
  label: { fontSize: 16, fontFamily: 'medium' },
  value: { fontSize: 18, fontFamily: 'regular', marginTop: 4 },
});

export default BillReminderDetail;

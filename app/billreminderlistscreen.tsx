import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '@/components/Header';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, icons } from '@/constants';
import { Image } from 'expo-image';
import Button from '@/components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BillReminder = () => {
  const { colors, dark } = useTheme();
  const [billName, setBillName] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminders, setReminders] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      loadReminders();
    }, [])
  );

  const loadReminders = async () => {
    try {
      const data = await AsyncStorage.getItem('billReminders');
      if (data) setReminders(JSON.parse(data));
    } catch (err) {
      console.error('Failed to load reminders:', err);
    }
  };

  const saveReminder = async () => {
    if (!billName || !reminderDate) return;

    const newReminder = {
      id: Date.now().toString(),
      billName,
      reminderDate
    };

    const updatedReminders = [...reminders, newReminder];

    try {
      await AsyncStorage.setItem('billReminders', JSON.stringify(updatedReminders));
      setReminders(updatedReminders);
      setBillName('');
      setReminderDate('');
    } catch (err) {
      console.error('Failed to save reminder:', err);
    }
  };

  const renderReminder = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => navigation.navigate('ManageReminders', { reminderToEdit: item })}
      style={[styles.reminderCard, { backgroundColor: dark ? COLORS.dark2 : '#F0F0F0' }]}
    >
      <Text style={[styles.reminderText, { color: dark ? COLORS.white : COLORS.black }]}>
        {item.billName} - {item.reminderDate}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Header title="Bill Reminder" />

        <View style={styles.viewContainer}>
          <View style={styles.iconContainer}>
            <Image source={icons.amazon} contentFit="contain" style={styles.icon} />
          </View>

          <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Set a Bill Reminder</Text>
          <Text style={[styles.subtitle, { color: dark ? COLORS.greyscale300 : COLORS.greyScale800 }]}>
            Never miss a due date. Set reminders for your upcoming bills.
          </Text>

          <View style={[styles.separateLine, { backgroundColor: dark ? COLORS.greyscale900 : COLORS.grayscale200 }]} />

          <Text style={[styles.labelText, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Bill Name</Text>
          <TextInput
            value={billName}
            onChangeText={setBillName}
            placeholder="e.g. Electricity Bill"
            style={[styles.input, {
              backgroundColor: dark ? COLORS.dark2 : "#FAFAFA",
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}
            placeholderTextColor={dark ? COLORS.white : COLORS.greyscale900}
          />

          <Text style={[styles.labelText, { color: dark ? COLORS.white : COLORS.greyscale900, marginTop: 20 }]}>Reminder Date</Text>
          <TextInput
            value={reminderDate}
            onChangeText={setReminderDate}
            placeholder="e.g. 2025-04-25"
            style={[styles.input, {
              backgroundColor: dark ? COLORS.dark2 : "#FAFAFA",
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}
            placeholderTextColor={dark ? COLORS.white : COLORS.greyscale900}
          />

          <Button title="Save Reminder" filled style={styles.button} onPress={saveReminder} />

          <Button
            title="Manage Reminders"
            onPress={() => navigation.navigate('managereminders')}
            style={{ marginTop: 12 }}
          />

          <Text style={[styles.labelText, { marginTop: 24, marginBottom: 12, color: dark ? COLORS.white : COLORS.greyscale900 }]}>
            Saved Reminders
          </Text>
          
          {reminders.length === 0 ? (
            <Text style={{ color: dark ? COLORS.greyscale500 : COLORS.greyscale700, textAlign: 'center' }}>
              No reminders added yet.
            </Text>
          ) : (
            reminders.map(item => renderReminder({ item }))
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: { flex: 1 },
  container: { padding: 16, flex: 1 },
  iconContainer: {
    height: 124,
    width: 124,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "rgba(52, 152, 219, 0.12)"
  },
  icon: { height: 60, width: 60 },
  viewContainer: { alignItems: "center", marginTop: 16, flex: 1 },
  title: { fontSize: 24, fontFamily: "bold", textAlign: "center", marginTop: 16 },
  subtitle: { fontSize: 16, fontFamily: "regular", textAlign: "center", marginBottom: 8 },
  separateLine: { width: "100%", height: 1, marginVertical: 16 },
  labelText: { fontSize: 18, fontFamily: "bold", alignSelf: "flex-start" },
  input: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    fontSize: 16,
    fontFamily: "regular",
    paddingHorizontal: 12,
    marginBottom: 8
  },
  button: { marginTop: 20, width: "100%" },
  reminderCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    width: "100%"
  },
  reminderText: {
    fontSize: 16,
    fontFamily: "regular"
  }
});

export default BillReminder;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS } from '@/constants';
import Button from '@/components/Button';
import Header from '@/components/Header';

const ManageReminders = () => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  const [reminders, setReminders] = useState([]);
  const [billName, setBillName] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReminders();

    if (route.params?.reminderToEdit) {
      const { billName, reminderDate, id } = route.params.reminderToEdit;
      setBillName(billName);
      setReminderDate(reminderDate);
      setEditId(id);
    }
  }, [route.params]);

  const loadReminders = async () => {
    setLoading(true);
    try {
      const data = await AsyncStorage.getItem('billReminders');
      if (data) setReminders(JSON.parse(data));
    } catch (err) {
      Alert.alert('Error', 'Failed to load reminders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateInputs = () => {
    if (!billName.trim()) {
      Alert.alert('Error', 'Please enter a bill name');
      return false;
    }
    if (!reminderDate.trim()) {
      Alert.alert('Error', 'Please enter a reminder date');
      return false;
    }
    return true;
  };

  const saveReminder = async () => {
    if (!validateInputs()) return;

    Keyboard.dismiss();
    setLoading(true);

    try {
      let updated;
      if (editId) {
        updated = reminders.map(r =>
          r.id === editId ? { ...r, billName, reminderDate } : r
        );
      } else {
        updated = [
          ...reminders,
          {
            id: Date.now().toString(),
            billName,
            reminderDate,
          },
        ];
      }

      await AsyncStorage.setItem('billReminders', JSON.stringify(updated));
      setReminders(updated);
      setBillName('');
      setReminderDate('');
      setEditId(null);

      // Clear route param after edit
      if (route.params?.reminderToEdit) {
        navigation.setParams({ reminderToEdit: null });
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to save reminder');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteReminder = async id => {
    try {
      const updated = reminders.filter(r => r.id !== id);
      await AsyncStorage.setItem('billReminders', JSON.stringify(updated));
      setReminders(updated);
      if (editId === id) {
        setBillName('');
        setReminderDate('');
        setEditId(null);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to delete reminder');
      console.error(err);
    }
  };

  const confirmDelete = id => {
    Alert.alert('Delete Reminder', 'Are you sure you want to delete this reminder?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => deleteReminder(id), style: 'destructive' },
    ]);
  };

  const inputStyle = {
    backgroundColor: dark ? COLORS.dark2 : '#fff',
    color: dark ? COLORS.white : COLORS.black,
    ...styles.input,
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Manage Reminders" onPressBack={() => navigation.goBack()} />

        <View style={styles.form}>
          <TextInput
            placeholder="Bill Name"
            placeholderTextColor={dark ? COLORS.greyscale500 : COLORS.greyscale700}
            value={billName}
            onChangeText={setBillName}
            style={inputStyle}
          />
          <TextInput
            placeholder="Reminder Date (YYYY-MM-DD)"
            placeholderTextColor={dark ? COLORS.greyscale500 : COLORS.greyscale700}
            value={reminderDate}
            onChangeText={setReminderDate}
            style={inputStyle}
          />

          <Button
            title={editId ? 'Update Reminder' : 'Add Reminder'}
            onPress={saveReminder}
            filled
            style={{ marginTop: 10 }}
            loading={loading}
          />

          {editId && (
            <Button
              title="Cancel Edit"
              onPress={() => {
                setBillName('');
                setReminderDate('');
                setEditId(null);
              }}
              style={{ marginTop: 10 }}
              variant="outline"
            />
          )}
        </View>

        {loading && reminders.length === 0 ? (
          <Text style={[styles.loadingText, { color: dark ? COLORS.white : COLORS.black }]}>
            Loading reminders...
          </Text>
        ) : (
          <FlatList
            data={reminders}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: dark ? COLORS.greyscale500 : COLORS.greyscale700 }]}>
                No reminders found
              </Text>
            }
            renderItem={({ item }) => (
              <View style={[styles.card, { backgroundColor: dark ? COLORS.dark2 : '#F0F0F0' }]}>
                <TouchableOpacity
                  onPress={() => {
                    setBillName(item.billName);
                    setReminderDate(item.reminderDate);
                    setEditId(item.id);
                  }}
                  style={styles.cardContent}
                >
                  <Text style={{ color: dark ? COLORS.white : COLORS.black, fontSize: 16 }}>
                    {item.billName} - {item.reminderDate}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteButton}>
                  <Text style={{ color: COLORS.error }}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: 16 },
  input: {
    height: 50,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  card: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default ManageReminders;

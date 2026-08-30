import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { addTransaction } from '../api';
import { colors } from '../theme';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function AddTransactionScreen({ navigation }: any) {
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(today());
  const [busy, setBusy] = useState(false);

  async function save() {
    const n = Number(amount);
    if (!n || n <= 0) {
      Alert.alert('Amount required', 'Enter a number greater than 0.');
      return;
    }
    try {
      setBusy(true);
      await addTransaction({ type, amount: n, note, occurred_on: date });
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Save failed', e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.h}>New entry</Text>
      <View style={styles.switch}>
        <TouchableOpacity
          style={[styles.chip, type === 'income' && styles.chipOn]}
          onPress={() => setType('income')}
        >
          <Text style={styles.chipText}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, type === 'expense' && styles.chipExp]}
          onPress={() => setType('expense')}
        >
          <Text style={styles.chipText}>Expense</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        placeholderTextColor={colors.muted}
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Date YYYY-MM-DD"
        placeholderTextColor={colors.muted}
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Note (optional)"
        placeholderTextColor={colors.muted}
        value={note}
        onChangeText={setNote}
      />
      <TouchableOpacity style={styles.btn} onPress={save} disabled={busy}>
        <Text style={styles.btnText}>{busy ? 'Saving...' : 'Save'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, padding: 20 },
  h: { color: colors.text, fontSize: 24, fontWeight: '800', marginBottom: 16 },
  switch: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  chip: { flex: 1, borderWidth: 1, borderColor: colors.line, borderRadius: 12, padding: 12, alignItems: 'center' },
  chipOn: { backgroundColor: '#163528', borderColor: colors.income },
  chipExp: { backgroundColor: '#3A1B1B', borderColor: colors.expense },
  chipText: { color: colors.text, fontWeight: '700' },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    color: colors.text,
    padding: 14,
    marginBottom: 12,
  },
  btn: { backgroundColor: colors.accent, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#042016', fontWeight: '800' },
});

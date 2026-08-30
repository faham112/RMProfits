import { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { listTransactions, Tx } from '../api';
import { colors } from '../theme';

export default function HistoryScreen() {
  const [rows, setRows] = useState<Tx[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setRows(await listTransactions());
    } catch (e: any) {
      Alert.alert('History failed', e.message);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16 }}
      data={rows}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />
      }
      ListEmptyComponent={<Text style={{ color: colors.muted }}>No transactions yet.</Text>}
      renderItem={({ item }) => {
        const income = item.type === 'income';
        return (
          <View style={styles.row}>
            <View>
              <Text style={styles.note}>{item.note || item.type}</Text>
              <Text style={styles.date}>{String(item.occurred_on).slice(0, 10)}</Text>
            </View>
            <Text style={{ color: income ? colors.income : colors.expense, fontWeight: '800' }}>
              {income ? '+' : '-'}
              {Number(item.amount).toFixed(2)}
            </Text>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  note: { color: colors.text, fontWeight: '600' },
  date: { color: colors.muted, marginTop: 4, fontSize: 12 },
});

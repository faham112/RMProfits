import { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { adminSummary, adminUsers, adminTransactions, Summary, User, Tx } from '../api';
import { colors } from '../theme';

function money(n: number) {
  return Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function AdminScreen() {
  const [sum, setSum] = useState<(Summary & { users?: number }) | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [rows, setRows] = useState<Tx[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [s, u, t] = await Promise.all([adminSummary(), adminUsers(), adminTransactions()]);
      setSum(s);
      setUsers(u);
      setRows(t);
    } catch (e: any) {
      Alert.alert('Admin load failed', e.message);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <ScrollView
      style={styles.wrap}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await load();
            setRefreshing(false);
          }}
        />
      }
    >
      <Text style={styles.h}>Admin panel</Text>
      <Text style={styles.sub}>All users and all transactions</Text>

      <View style={styles.row}>
        <Box label="Users" value={String(sum?.users ?? users.length)} color={colors.gold} />
        <Box label="Income" value={money(sum?.income || 0)} color={colors.income} />
      </View>
      <View style={[styles.row, { marginTop: 10 }]}>
        <Box label="Expense" value={money(sum?.expense || 0)} color={colors.expense} />
        <Box label="Profit" value={money(sum?.profit || 0)} color={colors.accent} />
      </View>

      <Text style={styles.sec}>Users</Text>
      {users.map((u) => (
        <View key={u.id} style={styles.item}>
          <Text style={styles.name}>{u.name}</Text>
          <Text style={styles.muted}>{u.email} · {u.role || 'user'}</Text>
        </View>
      ))}

      <Text style={styles.sec}>Latest transactions</Text>
      {rows.map((item) => {
        const income = item.type === 'income';
        return (
          <View key={item.id} style={styles.item}>
            <Text style={styles.name}>{item.user_name || item.user_email || item.note || item.type}</Text>
            <Text style={styles.muted}>{String(item.occurred_on).slice(0, 10)} · {item.note || item.type}</Text>
            <Text style={{ color: income ? colors.income : colors.expense, fontWeight: '800', marginTop: 4 }}>
              {income ? '+' : '-'}{Number(item.amount).toFixed(2)}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

function Box({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={[styles.val, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  h: { color: colors.text, fontSize: 24, fontWeight: '800' },
  sub: { color: colors.muted, marginBottom: 14, marginTop: 4 },
  row: { flexDirection: 'row', gap: 10 },
  box: { flex: 1, backgroundColor: colors.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.line },
  muted: { color: colors.muted },
  val: { fontSize: 18, fontWeight: '800', marginTop: 4 },
  sec: { color: colors.text, fontWeight: '800', marginTop: 20, marginBottom: 8, fontSize: 16 },
  item: { backgroundColor: colors.card, borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.line },
  name: { color: colors.text, fontWeight: '700' },
});

import { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, RefreshControl, ScrollView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getSummary, getStoredUser, logout, Summary, User } from '../api';
import { colors } from '../theme';

function money(n: number) {
  return Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function DashboardScreen({ navigation }: any) {
  const [sum, setSum] = useState<Summary | null>(null);
  const [me, setMe] = useState<User | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setMe(await getStoredUser());
      setSum(await getSummary());
    } catch (e: any) {
      Alert.alert('Could not load', e.message);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function onLogout() {
    await logout();
    navigation.replace('Login');
  }

  return (
    <ScrollView
      style={styles.wrap}
      contentContainerStyle={{ padding: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />
      }
    >
      <Text style={styles.h}>Dashboard</Text>
      {me?.role === 'admin' ? <Text style={styles.badge}>ADMIN</Text> : null}
      <View style={styles.row}>
        <Card label="Income" value={money(sum?.income || 0)} color={colors.income} />
        <Card label="Expense" value={money(sum?.expense || 0)} color={colors.expense} />
      </View>
      <View style={[styles.card, { marginTop: 12 }]}>
        <Text style={styles.label}>Net profit</Text>
        <Text style={[styles.big, { color: (sum?.profit || 0) >= 0 ? colors.income : colors.expense }]}>
          {money(sum?.profit || 0)}
        </Text>
      </View>

      {me?.role === 'admin' ? (
        <TouchableOpacity style={styles.adminBtn} onPress={() => navigation.navigate('Admin')}>
          <Text style={styles.adminText}>Open admin panel</Text>
        </TouchableOpacity>
      ) : null}

      <TouchableOpacity style={styles.primary} onPress={() => navigation.navigate('Add')}>
        <Text style={styles.primaryText}>Add income / expense</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondary} onPress={() => navigation.navigate('History')}>
        <Text style={styles.secondaryText}>Transaction history</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondary} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.secondaryText}>Server settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onLogout}>
        <Text style={styles.out}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Card({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.card, { flex: 1 }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.val, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  h: { color: colors.text, fontSize: 26, fontWeight: '800', marginBottom: 8 },
  badge: { color: colors.gold, fontWeight: '800', marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.line },
  label: { color: colors.muted, marginBottom: 6 },
  val: { fontSize: 20, fontWeight: '700' },
  big: { fontSize: 32, fontWeight: '800' },
  adminBtn: { backgroundColor: colors.gold, borderRadius: 14, padding: 16, marginTop: 22, alignItems: 'center' },
  adminText: { color: '#1A1400', fontWeight: '800' },
  primary: { backgroundColor: colors.accent, borderRadius: 14, padding: 16, marginTop: 10, alignItems: 'center' },
  primaryText: { color: '#042016', fontWeight: '800' },
  secondary: { borderColor: colors.line, borderWidth: 1, borderRadius: 14, padding: 16, marginTop: 10, alignItems: 'center' },
  secondaryText: { color: colors.text, fontWeight: '600' },
  out: { color: colors.muted, textAlign: 'center', marginTop: 22 },
});

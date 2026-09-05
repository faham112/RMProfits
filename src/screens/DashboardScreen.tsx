import { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, RefreshControl, ScrollView, Alert, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getSummary, getStoredUser, logout, Summary, User } from '../api';
import { colors } from '../theme';

const { width } = Dimensions.get('window');

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

  const profitPositive = (sum?.profit || 0) >= 0;

  return (
    <ScrollView
      style={styles.wrap}
      contentContainerStyle={styles.content}
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
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.eyebrow}>Overview</Text>
          <Text style={styles.h}>Dashboard</Text>
        </View>
        <View style={styles.rolePill}>
          <Text style={styles.roleText}>{me?.role === 'admin' ? 'ADMIN' : 'USER'}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Card label="Income" value={money(sum?.income || 0)} color={colors.income} />
        <Card label="Expense" value={money(sum?.expense || 0)} color={colors.expense} />
      </View>

      <View style={styles.profitCard}>
        <Text style={styles.label}>Net profit</Text>
        <Text style={[styles.big, { color: profitPositive ? colors.income : colors.expense }]}>
          {money(sum?.profit || 0)}
        </Text>
      </View>

      <View style={styles.grid}>
        <ActionTile title="Add entry" subtitle="Income / expense" color={colors.accent} onPress={() => navigation.navigate('Add')} />
        <ActionTile title="History" subtitle="Transactions" color={colors.primary} onPress={() => navigation.navigate('History')} />
        <ActionTile title="Settings" subtitle="API config" color={colors.purple} onPress={() => navigation.navigate('Settings')} />
        {me?.role === 'admin' ? (
          <ActionTile title="Admin" subtitle="All users" color={colors.gold} onPress={() => navigation.navigate('Admin')} />
        ) : null}
      </View>

      <TouchableOpacity style={styles.logout} onPress={onLogout}>
        <Text style={styles.logoutText}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Card({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.card, { flex: 1, minWidth: width > 420 ? 170 : '47%' }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.val, { color }]}>{value}</Text>
    </View>
  );
}

function ActionTile({ title, subtitle, color, onPress }: { title: string; subtitle: string; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.tile, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.tileTitle}>{title}</Text>
      <Text style={styles.tileSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 18, paddingBottom: 40 },
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 18,
    marginBottom: 16,
  },
  eyebrow: { color: colors.muted, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase' },
  h: { color: colors.text, fontSize: 28, fontWeight: '800', marginTop: 5 },
  rolePill: {
    backgroundColor: 'rgba(248,199,91,0.2)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(248,199,91,0.5)',
  },
  roleText: { color: colors.gold, fontWeight: '800', fontSize: 11 },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 12,
  },
  label: { color: colors.muted, marginBottom: 8, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8 },
  val: { fontSize: 22, fontWeight: '800' },
  profitCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.line,
    marginTop: 8,
    marginBottom: 18,
  },
  big: { fontSize: 34, fontWeight: '800' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  tile: {
    width: (width - 18 * 2 - 12) / 2,
    minHeight: 120,
    borderRadius: 18,
    padding: 16,
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  tileTitle: { color: '#041A1A', fontWeight: '900', fontSize: 22 },
  tileSubtitle: { color: 'rgba(4,26,26,0.8)', fontWeight: '700', marginTop: 4 },
  logout: { marginTop: 22, paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: colors.line, alignItems: 'center' },
  logoutText: { color: colors.text, fontWeight: '700' },
});

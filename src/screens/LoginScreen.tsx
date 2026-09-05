import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { login } from '../api';
import { colors } from '../theme';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('admin@rmprofits.local');
  const [password, setPassword] = useState('Test12345');
  const [busy, setBusy] = useState(false);

  async function onLogin() {
    try {
      setBusy(true);
      await login(email.trim(), password);
      navigation.replace('Home');
    } catch (e: any) {
      Alert.alert('Login failed', e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.wrap}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.glow} />
      <View style={styles.card}>
        <Text style={styles.brand}>RM PROFITS</Text>
        <Text style={styles.sub}>Track income, expense and profit</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.muted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.btn} onPress={onLogin} disabled={busy}>
          <Text style={styles.btnText}>{busy ? 'Signing in...' : 'Sign in'}</Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Create account</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.link}>Server settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.primary,
    opacity: 0.14,
    top: '12%',
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  brand: {
    color: colors.gold,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
  },
  sub: { color: colors.muted, marginBottom: 28, marginTop: 8, textAlign: 'center' },
  input: {
    backgroundColor: '#0D1A27',
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 14,
    color: colors.text,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    fontSize: 15,
  },
  btn: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: { color: '#042016', fontWeight: '800', fontSize: 16 },
  actions: { marginTop: 18, gap: 10 },
  link: { color: colors.muted, textAlign: 'center', fontWeight: '600' },
});

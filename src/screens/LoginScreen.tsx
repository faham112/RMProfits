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
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Create account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.link}>Server settings</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, padding: 24, justifyContent: 'center' },
  brand: { color: colors.gold, fontSize: 32, fontWeight: '800', letterSpacing: 1 },
  sub: { color: colors.muted, marginBottom: 28, marginTop: 6 },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    color: colors.text,
    padding: 14,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: { color: '#042016', fontWeight: '800', fontSize: 16 },
  link: { color: colors.muted, textAlign: 'center', marginTop: 16 },
});

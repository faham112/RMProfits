import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { register } from '../api';
import { colors } from '../theme';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function onRegister() {
    if (!name || !email || password.length < 6) {
      Alert.alert('Check fields', 'Name, email and password (6+ chars) required.');
      return;
    }
    try {
      setBusy(true);
      await register(name.trim(), email.trim(), password);
      navigation.replace('Home');
    } catch (e: any) {
      Alert.alert('Register failed', e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Create account</Text>
      <TextInput style={styles.input} placeholder="Name" placeholderTextColor={colors.muted} value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.muted} autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor={colors.muted} secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.btn} onPress={onRegister} disabled={busy}>
        <Text style={styles.btnText}>{busy ? 'Creating...' : 'Register'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, padding: 24, justifyContent: 'center' },
  title: { color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: 20 },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    color: colors.text,
    padding: 14,
    marginBottom: 12,
  },
  btn: { backgroundColor: colors.accent, borderRadius: 12, padding: 16, alignItems: 'center' },
  btnText: { color: '#042016', fontWeight: '800' },
});

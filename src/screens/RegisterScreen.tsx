import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
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
    <KeyboardAvoidingView
      style={styles.wrap}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Create account</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={colors.muted}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
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
        <TouchableOpacity style={styles.btn} onPress={onRegister} disabled={busy}>
          <Text style={styles.btnText}>{busy ? 'Creating...' : 'Register'}</Text>
        </TouchableOpacity>
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
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.line,
  },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', marginBottom: 20 },
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
  btn: { backgroundColor: colors.accent, borderRadius: 14, padding: 16, alignItems: 'center' },
  btnText: { color: '#042016', fontWeight: '800' },
});

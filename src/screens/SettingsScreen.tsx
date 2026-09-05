import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getApiUrl, setApiUrl } from '../config';
import { colors } from '../theme';

export default function SettingsScreen({ navigation }: any) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    getApiUrl().then(setUrl);
  }, []);

  async function save() {
    if (!/^https?:\/\//.test(url)) {
      Alert.alert('Invalid URL', 'Use http://IP:3001 or https://your-domain');
      return;
    }
    await setApiUrl(url.trim());
    Alert.alert('Saved', 'API URL updated. Go back and sign in.');
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <Text style={styles.h}>Server settings</Text>
        <Text style={styles.p}>
          Your VPS API is on port 3001. Example: http://64.xx.xx.xx:3001
        </Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={url}
          onChangeText={setUrl}
          placeholder="http://VPS_IPV4:3001"
          placeholderTextColor={colors.muted}
        />
        <TouchableOpacity style={styles.btn} onPress={save}>
          <Text style={styles.btnText}>Save API URL</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Back to dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, padding: 20, justifyContent: 'center' },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 20,
  },
  h: { color: colors.text, fontSize: 28, fontWeight: '800' },
  p: { color: colors.muted, marginVertical: 14, lineHeight: 20 },
  input: {
    backgroundColor: '#0D1A27',
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    color: colors.text,
    padding: 14,
  },
  btn: { backgroundColor: colors.accent, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 16 },
  btnText: { color: '#042016', fontWeight: '800' },
  linkBtn: { marginTop: 14, alignItems: 'center' },
  linkText: { color: colors.muted, fontWeight: '700' },
});

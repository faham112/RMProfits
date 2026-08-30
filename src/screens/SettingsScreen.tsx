import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getApiUrl, setApiUrl } from '../config';
import { colors } from '../theme';

export default function SettingsScreen() {
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
      <Text style={styles.h}>Server</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, padding: 20 },
  h: { color: colors.text, fontSize: 24, fontWeight: '800' },
  p: { color: colors.muted, marginVertical: 12, lineHeight: 20 },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    color: colors.text,
    padding: 14,
  },
  btn: { backgroundColor: colors.accent, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 16 },
  btnText: { color: '#042016', fontWeight: '800' },
});

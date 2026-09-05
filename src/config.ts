import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'rmprofits_api_url';
const DEFAULT_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://136.244.78.245:3001';

export async function getApiUrl(): Promise<string> {
  const saved = await AsyncStorage.getItem(KEY);
  return (saved || DEFAULT_URL).replace(/\/$/, '');
}

export async function setApiUrl(url: string): Promise<void> {
  await AsyncStorage.setItem(KEY, url.replace(/\/$/, ''));
}

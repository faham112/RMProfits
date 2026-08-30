import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from './config';

export type User = { id: string; name: string; email: string; role?: 'admin' | 'user' };
export type Summary = { income: number; expense: number; profit: number };
export type Tx = {
  id: string;
  type: 'income' | 'expense';
  amount: string | number;
  note: string | null;
  occurred_on: string;
  category: string | null;
  user_email?: string;
  user_name?: string;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const base = await getApiUrl();
  const token = await AsyncStorage.getItem('token');
  const res = await fetch(base + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error('Server did not return JSON. Check API URL and port 3001.');
  }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data as T;
}

export async function login(email: string, password: string) {
  const data = await request<{ user: User; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  await AsyncStorage.setItem('token', data.token);
  await AsyncStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export async function register(name: string, email: string, password: string) {
  const data = await request<{ user: User; token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  await AsyncStorage.setItem('token', data.token);
  await AsyncStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export async function logout() {
  await AsyncStorage.multiRemove(['token', 'user']);
}

export async function getStoredUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

export const getSummary = (from?: string, to?: string) => {
  const q = new URLSearchParams();
  if (from) q.set('from', from);
  if (to) q.set('to', to);
  const s = q.toString();
  return request<Summary>('/summary' + (s ? `?${s}` : ''));
};

export const listTransactions = () => request<Tx[]>('/transactions');

export const addTransaction = (body: {
  type: 'income' | 'expense';
  amount: number;
  note?: string;
  occurred_on: string;
}) =>
  request<Tx>('/transactions', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const adminSummary = () => request<Summary & { users: number }>('/admin/summary');
export const adminUsers = () => request<User[]>('/admin/users');
export const adminTransactions = () => request<Tx[]>('/admin/transactions');

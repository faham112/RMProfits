# RM PROFITS

React Native (Expo) Android app + Node/PostgreSQL API.

Repo: https://github.com/faham112/RMProfits

## Expo QR (phone)

This QR cannot live inside GitHub. It is created on your computer when Metro starts.

1. Install [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) on Android.
2. On your PC (not the VPS):

```bash
git clone https://github.com/faham112/RMProfits.git
cd RMProfits
npm install
npx expo start --tunnel
```

3. A QR appears in the terminal and in the browser.
4. Open Expo Go → Scan QR.
5. In the app open **Server settings** and set:

```text
http://YOUR_VPS_IPV4:3001
```

Test login (already created on the VPS):

- email: `admin@rmprofits.local`
- password: `Test12345`

`--tunnel` is required if the phone is not on the same Wi-Fi as the PC.

## Production Android APK (EAS)

1. Create an Expo account: https://expo.dev/signup
2. On your PC:

```bash
npm i -g eas-cli
eas login
eas init
```

3. Copy the printed project ID into `app.json` → `expo.extra.eas.projectId`.
4. Create a token: https://expo.dev/accounts/[account]/settings/access-tokens
5. GitHub repo → Settings → Secrets and variables → Actions → New secret:

- Name: `EXPO_TOKEN`
- Value: that token

6. Actions tab → **EAS Android Preview APK** → Run workflow  
   or push to `main`.

Preview profile builds an internal APK. Production profile builds an AAB for Play Store.

```bash
eas build -p android --profile preview
eas build -p android --profile production
```

## VPS API (already running)

- Path: `/var/www/rmprofits-api`
- Process: `pm2 status` → `rmprofits-api`
- Port: `3001`
- Health: `curl http://127.0.0.1:3001/health`

Get IPv4:

```bash
curl -4 -sS ifconfig.me && echo
```

## App screens

- Login / Register
- Dashboard (income, expense, profit)
- Add transaction
- History
- Server settings

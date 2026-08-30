# Termux A to Z — VPS copy + admin + APK folder

Use Termux as the SSH client. Build on the Ubuntu VPS. APK is copied into a folder you choose.

## 1. Phone Termux — connect

```bash
pkg update -y
pkg install -y openssh git
ssh linuxuser@YOUR_VPS_IPV4
```

## 2. On VPS — clone project

```bash
cd ~
git clone https://github.com/faham112/RMProfits.git
cd ~/RMProfits
```

If you already copied files, skip clone and `cd` into that folder.

## 3. Add admin role in Postgres

```bash
sudo -u postgres psql -d rmprofits -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';"
sudo -u postgres psql -d rmprofits -c "UPDATE users SET role = 'admin' WHERE email = 'admin@rmprofits.local';"
```

## 4. Update running API

```bash
cp ~/RMProfits/server/src/index.js /var/www/rmprofits-api/src/index.js
cp ~/RMProfits/server/src/db.js /var/www/rmprofits-api/src/db.js
cd /var/www/rmprofits-api
pm2 restart rmprofits-api
curl -sS http://127.0.0.1:3001/health
```

## 5. APK output folder (change path if you want)

```bash
mkdir -p /home/linuxuser/apk
```

Desired file:

```text
/home/linuxuser/apk/RM-PROFITS.apk
```

## 6. Build APK with EAS (recommended)

Needs Expo account + token (one time).

```bash
cd ~/RMProfits
npm install
npm i -g eas-cli
eas login
eas init
eas build -p android --profile preview
```

When Expo shows the download URL:

```bash
curl -L "PASTE_APK_URL_HERE" -o /home/linuxuser/apk/RM-PROFITS.apk
ls -lh /home/linuxuser/apk/RM-PROFITS.apk
```

Copy APK to phone storage from Termux (after scp):

```bash
# on phone Termux, after you scp the file
scp linuxuser@YOUR_VPS_IPV4:/home/linuxuser/apk/RM-PROFITS.apk /sdcard/Download/RM-PROFITS.apk
```

## Login

- Admin: admin@rmprofits.local / Test12345
- Admin sees gold button: Open admin panel
- New registers are role=user only

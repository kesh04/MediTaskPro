## 🚀 How to Run the App

### Prerequisites
- Node.js v22+
- Expo CLI
- iOS Simulator (Xcode) or Android Emulator (Android Studio)

### Step 1 — Clone the repository
git clone https://github.com/kesh04/MediTaskPro.git
cd MediTaskPro

### Step 2 — Install dependencies
npm install

### Step 3 — Start the app
npm start

### Step 4 — Run on iOS
Press `i` in the terminal after npm start

### Step 5 — Run on Android
Press `a` in the terminal after npm start

---

## 🚢 How to Deploy the App

### Deploy to Firebase App Distribution
1. Go to console.firebase.google.com
2. Create a new project — MediTaskPro
3. Go to App Distribution
4. Upload your APK file
5. Add tester emails and click Distribute

---

## 🔄 CI/CD Pipeline

Every push to main or develop triggers automatically:

1. Install dependencies
2. Run ESLint
3. Run TypeScript check
4. Build Android APK
5. Archive APK as downloadable artifact


# LMS Assignment App

An educational LMS mobile application built with React Native and Expo. This app allows users to seamlessly access their coursework, view schedules, and interact offline.

---

## 🛠 Setup Instructions

To run this project locally, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/neerajsharma444/lms-assignment.git
   cd lms-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```
   *Press `a` to open on an Android emulator, or `i` to open on an iOS simulator. You can also scan the QR code using the Expo Go app on your physical device.*

---

## 🏗 Key Architectural Decisions

This application was built with a modern, performant React Native stack:
* **Framework:** [Expo](https://expo.dev/) & React Native.
* **Routing:** **Expo Router** (File-based navigation for deep linking and seamless screen transitions).
* **State Management:** **Zustand** (Lightweight and fast global state management).
* **Data Fetching:** **React Query / TanStack Query** (For handling server state, caching, and background refetching).
* **Styling:** **NativeWind / TailwindCSS** (For rapid, consistent, and responsive UI styling).
* **Local Storage:** **React Native MMKV** & **Expo Secure Store** (For blazing fast, synchronous offline storage and secure token handling).
* **Forms & Validation:** **React Hook Form** + **Zod** (For robust and type-safe form validation).

---

## 📶 Offline Functionality

The app is designed to work seamlessly even when the user loses internet connection. 
* **Data Caching:** We use `react-native-mmkv` and `React Query` to cache the latest fetched data (like schedules, user profile, etc.). 
* When offline, the app reads directly from the MMKV cache to display the last known state immediately without infinite loading spinners.
* Any offline actions (like marking attendance or sending a message) are queued and synced once the network is restored.

---

## 📱 Screenshots of Main Screens

*(Drag and drop your images directly into the GitHub README editor to replace the placeholders below with actual image URLs).*

### 🌙 Dark Theme
| Discover | Course Details | Interactive Content | Profile / History |
|:---:|:---:|:---:|:---:|
| ![Dark Discover](<img width="1080" height="2400" alt="Screenshot_1781872598" src="https://github.com/user-attachments/assets/ce7bd32e-024b-4cc8-8bee-e5211c798ecc" />) | ![Dark Course Details](<img width="1080" height="2400" alt="Screenshot_1781872611" src="https://github.com/user-attachments/assets/10223823-a794-4970-9592-0df9567d017b" />) | ![Dark Interactive](<img width="1080" height="2400" alt="Screenshot_1781872619" src="https://github.com/user-attachments/assets/abdf8c19-3576-4791-b80c-0ea5c082393b" />) | ![Dark Profile](<img width="1080" height="2400" alt="Screenshot_1781872641" src="https://github.com/user-attachments/assets/2ec4399b-3177-4019-9c82-490049f27608" />) |

### ☀️ Light Theme
| Discover | Course Details | Interactive Content | Profile / History |
|:---:|:---:|:---:|:---:|
| ![Light Discover](<img width="1080" height="2400" alt="Screenshot_1781872769" src="https://github.com/user-attachments/assets/3de87ef2-6e46-46c5-a0f8-c10242a83d0b" />) | ![Light Course Details](<img width="1080" height="2400" alt="Screenshot_1781872788" src="https://github.com/user-attachments/assets/1200882b-881f-48f0-8133-93f36cf236ca" />) | ![Light Interactive](<img width="1080" height="2400" alt="Screenshot_1781872794" src="https://github.com/user-attachments/assets/ef36e947-f3a8-45b8-90dc-679d7302fd2d" />) | ![Light Profile](<img width="1080" height="2400" alt="Screenshot_1781872803" src="https://github.com/user-attachments/assets/b11bafdf-60b5-411b-a8fe-9cf2a8e7dc33" />) |

---

## 🎥 Demo Video

[👉 Watch the 3-minute App Walkthrough Video Here](https://drive.google.com/drive/folders/191f0iiSebBDUwCmDBkixC71lpx9gZOHr?usp=sharing)

*The video demonstrates the main features of the app, including user login, navigation, and a demonstration of the offline capabilities by turning off Wi-Fi/Data.*

---

## 📦 APK Build Instructions

To build a standalone APK of this application for testing on Android devices, we use Expo Application Services (EAS).

1. Install the EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Log in to your Expo account:
   ```bash
   eas login
   ```
3. Run the following command to generate the `.apk` file:
   ```bash
   eas build -p android --profile preview
   ```
4. Once the build finishes, EAS will provide a link where you can download the `.apk` and install it on any Android device.

**[Download the Latest APK Release Here](https://expo.dev/accounts/neeraj-expo/projects/lms-assignment/builds/3e68413c-2f4e-4640-a024-b06466ec4667)**

---

## ⚠️ Known Issues / Limitations

* **No major bugs encountered** during testing. The application is stable on standard Android devices.
* **Current Limitation:** While the app successfully caches fetched data for offline viewing using MMKV, complex offline mutations (like making a POST request while offline) require the app to be open when the network is restored in order to sync properly to the backend.

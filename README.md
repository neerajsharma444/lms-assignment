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

## 🌍 Environment Variables Needed

Create a `.env` file in the root directory (if applicable) and add the necessary environment variables. 

*Currently, no explicit environment variables are required out-of-the-box to run the UI, but if you have an API base URL, place it here:*
```env
EXPO_PUBLIC_API_URL=https://your-api-endpoint.com
```

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
| ![Dark Discover](<DRAG_DARK_IMAGE_1_HERE>) | ![Dark Course Details](<DRAG_DARK_IMAGE_2_HERE>) | ![Dark Interactive](<DRAG_DARK_IMAGE_3_HERE>) | ![Dark Profile](<DRAG_DARK_IMAGE_4_HERE>) |

### ☀️ Light Theme
| Discover | Course Details | Interactive Content | Profile / History |
|:---:|:---:|:---:|:---:|
| ![Light Discover](<DRAG_LIGHT_IMAGE_1_HERE>) | ![Light Course Details](<DRAG_LIGHT_IMAGE_2_HERE>) | ![Light Interactive](<DRAG_LIGHT_IMAGE_3_HERE>) | ![Light Profile](<DRAG_LIGHT_IMAGE_4_HERE>) |

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

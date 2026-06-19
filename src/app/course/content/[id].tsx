import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function CourseWebViewScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = useAuthStore((state) => state.token);
  const { completedCourses, toggleCompleted } = useCourseStore();
  
  const isCompleted = completedCourses.includes(id as string);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
      <script>
        tailwind.config = {
          darkMode: 'media',
          theme: {
            extend: {
              fontFamily: {
                sans: ['Inter', 'sans-serif'],
              },
            }
          }
        }
      </script>
      <style>
        body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
          background-color: #f8fafc;
        }
        @media (prefers-color-scheme: dark) {
          body {
            background-color: #0f172a;
          }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
        }
        @media (prefers-color-scheme: dark) {
          .glass-card {
            background: rgba(30, 41, 59, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .btn-primary {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .btn-primary:active {
          transform: scale(0.97);
        }
        .icon-container {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
        }
      </style>
    </head>
    <body class="min-h-screen flex flex-col p-5 md:p-8 text-slate-800 dark:text-slate-100 relative overflow-x-hidden">
      
      <!-- Decorative background elements -->
      <div class="fixed top-0 left-0 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[64px] opacity-20 dark:opacity-20 animate-pulse-slow pointer-events-none z-0" style="transform: translate(-30%, -30%);"></div>
      <div class="fixed bottom-0 right-0 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[64px] opacity-20 dark:opacity-20 animate-pulse-slow pointer-events-none z-0" style="transform: translate(30%, 30%); animation-delay: 2s;"></div>

      <main class="w-full max-w-md mx-auto my-auto glass-card rounded-[2rem] p-8 animate-fade-in-up relative z-10">
        <header class="text-center mb-10">
          <div class="w-20 h-20 mx-auto icon-container rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6 transform rotate-3 transition-transform hover:rotate-6">
            <svg class="w-10 h-10 text-white transform -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <p class="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">Course Module #${id}</p>
          <h1 class="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">Interactive Content</h1>
        </header>

        <div class="space-y-6 mb-10">
          <div class="flex items-start space-x-4 bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-white/60 dark:border-slate-700/60">
            <div class="flex-shrink-0 mt-1 bg-green-100 dark:bg-green-900/40 p-2 rounded-xl text-green-600 dark:text-green-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-800 dark:text-slate-200">Understand Concepts</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Review the theoretical foundation of this module through interactive simulations.</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-4 bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-white/60 dark:border-slate-700/60">
            <div class="flex-shrink-0 mt-1 bg-amber-100 dark:bg-amber-900/40 p-2 rounded-xl text-amber-600 dark:text-amber-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-800 dark:text-slate-200">Practical Application</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Apply your knowledge in the real-world scenario provided below.</p>
            </div>
          </div>
        </div>

        ${isCompleted ? `
        <div class="w-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 font-bold py-4 px-6 rounded-2xl flex items-center justify-center space-x-2 border border-green-200 dark:border-green-800/50">
          <span>Course Completed</span>
          <svg class="w-6 h-6 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        ` : `
        <button 
          class="btn-primary w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 px-6 rounded-2xl shadow-xl shadow-slate-900/20 dark:shadow-white/10 flex items-center justify-center space-x-2 border border-transparent dark:hover:bg-slate-100 hover:bg-slate-800"
          onclick="completeModule(this)"
        >
          <span id="btn-text">Mark as Completed</span>
          <svg id="btn-icon" class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
          </svg>
        </button>
        `}
      </main>

      <script>
        function completeModule(btn) {
          const btnText = document.getElementById('btn-text');
          const btnIcon = document.getElementById('btn-icon');
          
          btnText.innerText = 'Processing...';
          btnIcon.outerHTML = '<svg class="animate-spin h-5 w-5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
          
          btn.disabled = true;
          btn.classList.add('opacity-90', 'cursor-not-allowed');
          
          setTimeout(() => {
            window.ReactNativeWebView.postMessage('COMPLETED');
          }, 800);
        }
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    const data = event.nativeEvent.data;
    if (data === 'COMPLETED') {
      if (!isCompleted) {
        toggleCompleted(id as string);
      }
      alert('Congratulations! You completed this module.');
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-900">
      <View className="flex-row items-center p-4 pt-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ChevronLeft color={Colors.primary} size={28} />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-2 text-slate-900 dark:text-white">Interactive Content</Text>
      </View>

      {isLoading && (
        <ActivityIndicator size="large" color={Colors.primary} style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: -18, marginTop: -18, zIndex: 10 }} />
      )}

      <WebView
        ref={webViewRef}
        source={{
          html: htmlContent,
          headers: { Authorization: `Bearer ${token}` }
        }}
        onMessage={handleMessage}
        onLoadEnd={() => setIsLoading(false)}
        javaScriptEnabled={true}
        showsVerticalScrollIndicator={false}
        className="flex-1"
        onError={() => alert('Failed to load content')}
      />
    </View>
  );
}

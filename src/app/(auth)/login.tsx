import { login } from '@/api/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Lock, User } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import * as z from 'zod';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      const token = data?.data?.accessToken;
      const user = data?.data?.user;
      if (token) {
        await setAuth(token, user);
        router.replace('/(tabs)');
      }
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error?.response?.data?.message || 'An error occurred',
        position: 'top',
        visibilityTime: 4000,
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: 100, paddingBottom: 40 }}
        className="bg-white dark:bg-slate-900 px-6"
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(600).springify()}>
          <View className="mb-10 items-center">
            <View className="w-16 h-16 rounded-2xl mb-6 shadow-soft dark:shadow-soft-dark overflow-hidden">
              <LinearGradient
                colors={Colors.gradients.primary as [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text className="text-white text-3xl font-bold">L</Text>
              </LinearGradient>
            </View>
            <Text className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-2">
              Welcome Back
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-center text-base">
              Sign in to continue your learning journey
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(600).springify()}>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, value, onBlur } }) => (
              <Input
                label="Username"
                placeholder="Enter your username"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.username?.message}
                autoCapitalize="none"
                leftIcon={<User color={Colors.textMuted} size={20} />}
              />
            )}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600).springify()}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value, onBlur } }) => (
              <Input
                label="Password"
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                leftIcon={<Lock color={Colors.textMuted} size={20} />}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff color={Colors.textMuted} size={20} />
                    ) : (
                      <Eye color={Colors.textMuted} size={20} />
                    )}
                  </TouchableOpacity>
                }
              />
            )}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(600).springify()} className="mt-4">
          <Button
            label="Sign In"
            onPress={handleSubmit(onSubmit)}
            isLoading={loginMutation.isPending}
            size="lg"
            className="w-full shadow-soft"
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(600).springify()} className="flex-row justify-center mt-8">
          <Text className="text-slate-600 dark:text-slate-400 text-base">Don't have an account? </Text>
          <Text
            className="text-blue-600 font-bold text-base"
            onPress={() => router.push('/(auth)/register')}
          >
            Sign Up
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

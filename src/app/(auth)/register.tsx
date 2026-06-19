import React, { useState } from 'react';
import { View, Text, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { register } from '@/api/auth';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { TouchableOpacity } from 'react-native';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['USER', 'ADMIN']),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '', role: 'USER' },
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: 'You can now log in to your account',
        position: 'top',
        visibilityTime: 4000,
      });
      router.replace('/(auth)/login');
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error?.response?.data?.message || 'An error occurred',
        position: 'top',
        visibilityTime: 4000,
      });
    },
  });

  const onSubmit = (data: any) => {
    registerMutation.mutate(data);
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
        <View className="mb-8 items-center">
          <Text className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-2">
            Create Account
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-center text-base">
            Join us to start learning today
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
              placeholder="Choose a username"
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
          name="email"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              label="Email Address"
              placeholder="Enter your email"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              autoCapitalize="none"
              leftIcon={<Mail color={Colors.textMuted} size={20} />}
            />
          )}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).duration(600).springify()}>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              label="Password"
              placeholder="Create a password"
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

      <Animated.View entering={FadeInUp.delay(400).duration(600).springify()} className="mt-6">
        <Button
          label="Sign Up"
          onPress={handleSubmit(onSubmit)}
          isLoading={registerMutation.isPending}
          size="lg"
          className="w-full shadow-soft"
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(500).duration(600).springify()} className="flex-row justify-center mt-8">
        <Text className="text-slate-600 dark:text-slate-400 text-base">Already have an account? </Text>
        <Text 
          className="text-blue-600 font-bold text-base"
          onPress={() => router.replace('/(auth)/login')}
        >
          Login
        </Text>
      </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

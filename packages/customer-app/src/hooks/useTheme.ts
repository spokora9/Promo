import { useColorScheme } from 'react-native';

const lightColors = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  disabled: '#D1D5DB',
};

const darkColors = {
  primary: '#818CF8',
  primaryDark: '#6366F1',
  primaryLight: '#A5B4FC',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  background: '#111827',
  surface: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
  disabled: '#4B5563',
};

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    isDark,
    colors: isDark ? darkColors : lightColors,
  };
};

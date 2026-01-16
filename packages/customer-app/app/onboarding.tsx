import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import { useTheme } from '@/hooks/useTheme';

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: 'location',
    title: 'Discover Nearby Deals',
    description: 'Get notified when you\'re near shops offering exclusive promotions and discounts.',
  },
  {
    icon: 'compass',
    title: 'Discovery Mode',
    description: 'Explore new businesses with special first-time customer offers. Choose Active for notifications or Silent to browse later.',
  },
  {
    icon: 'notifications',
    title: 'Never Miss Out',
    description: 'Receive real-time alerts for time-sensitive deals in your area.',
  },
];

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    slide: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: '#EEF2FF',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 16,
    },
    description: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 20,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#E5E7EB',
      marginHorizontal: 4,
    },
    dotActive: {
      backgroundColor: colors.primary,
      width: 24,
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 12,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    skipButton: {
      paddingVertical: 12,
      alignItems: 'center',
    },
    skipButtonText: {
      color: colors.textSecondary,
      fontSize: 14,
    },
  });

  const renderSlide = ({ item }: { item: typeof slides[0] }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon as any} size={60} color={colors.primary} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const handleGetStarted = () => {
    router.replace('/auth/register');
  };

  const handleSkip = () => {
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <Carousel
        width={width}
        height={500}
        data={slides}
        renderItem={renderSlide}
        onSnapToItem={setCurrentIndex}
      />

      {/* Pagination */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === currentIndex && styles.dotActive]}
          />
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

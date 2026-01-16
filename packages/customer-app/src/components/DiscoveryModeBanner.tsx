import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useTheme } from '@/hooks/useTheme';

export const DiscoveryModeBanner = () => {
  const { colors } = useTheme();
  const mode = useDiscoveryStore((state) => state.mode);

  if (mode === 'off') return null;

  const getModeConfig = () => {
    switch (mode) {
      case 'active':
        return {
          icon: 'notifications' as const,
          color: '#10B981',
          bg: '#D1FAE5',
          title: 'Discovery Mode: Active',
          description: 'You\'ll receive notifications for nearby discovery offers',
        };
      case 'silent':
        return {
          icon: 'notifications-off' as const,
          color: '#6366F1',
          bg: '#EEF2FF',
          title: 'Discovery Mode: Silent',
          description: 'Exploring quietly - review shops later in Discovery tab',
        };
      case 'smart':
        return {
          icon: 'bulb' as const,
          color: '#F59E0B',
          bg: '#FEF3C7',
          title: 'Discovery Mode: Smart',
          description: 'AI-powered notifications based on your preferences',
        };
      default:
        return null;
    }
  };

  const config = getModeConfig();
  if (!config) return null;

  const styles = StyleSheet.create({
    banner: {
      backgroundColor: config.bg,
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: config.color,
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 13,
      fontWeight: '600',
      color: config.color,
      marginBottom: 2,
    },
    description: {
      fontSize: 11,
      color: config.color,
      opacity: 0.8,
    },
    chevron: {
      marginLeft: 8,
    },
  });

  return (
    <TouchableOpacity
      style={styles.banner}
      onPress={() => router.push('/discovery')}
      activeOpacity={0.7}
    >
      <Ionicons name={config.icon} size={20} color={config.color} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.description}>{config.description}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={config.color}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
};

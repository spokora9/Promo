import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

type DiscoveryMode = 'off' | 'active' | 'silent' | 'smart';

interface DiscoveryModeSelectorProps {
  currentMode: DiscoveryMode;
  onModeChange: (mode: DiscoveryMode) => void;
}

const modes = [
  {
    value: 'off' as const,
    label: 'Off',
    icon: 'close-circle',
    description: 'No discovery features enabled',
  },
  {
    value: 'active' as const,
    label: 'Active',
    icon: 'notifications',
    description: 'Get notified about nearby discovery offers',
  },
  {
    value: 'silent' as const,
    label: 'Silent',
    icon: 'notifications-off',
    description: 'Explore quietly, review shops later',
  },
  {
    value: 'smart' as const,
    label: 'Smart',
    icon: 'bulb',
    description: 'AI-powered notifications based on your preferences',
    comingSoon: true,
  },
];

export const DiscoveryModeSelector = ({
  currentMode,
  onModeChange,
}: DiscoveryModeSelectorProps) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      gap: 12,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    optionActive: {
      borderColor: colors.primary,
      backgroundColor: '#EEF2FF',
    },
    optionDisabled: {
      opacity: 0.5,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    iconContainerActive: {
      backgroundColor: colors.primary,
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    comingSoonBadge: {
      backgroundColor: '#FEF3C7',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      marginLeft: 8,
    },
    comingSoonText: {
      fontSize: 10,
      fontWeight: '600',
      color: '#92400E',
    },
    description: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    checkmark: {
      marginLeft: 8,
    },
  });

  return (
    <View style={styles.container}>
      {modes.map((mode) => {
        const isActive = currentMode === mode.value;
        const isDisabled = mode.comingSoon;

        return (
          <TouchableOpacity
            key={mode.value}
            style={[
              styles.option,
              isActive && styles.optionActive,
              isDisabled && styles.optionDisabled,
            ]}
            onPress={() => !isDisabled && onModeChange(mode.value)}
            disabled={isDisabled}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                isActive && styles.iconContainerActive,
              ]}
            >
              <Ionicons
                name={mode.icon as any}
                size={22}
                color={isActive ? '#fff' : colors.text}
              />
            </View>

            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.label}>{mode.label}</Text>
                {mode.comingSoon && (
                  <View style={styles.comingSoonBadge}>
                    <Text style={styles.comingSoonText}>COMING SOON</Text>
                  </View>
                )}
              </View>
              <Text style={styles.description}>{mode.description}</Text>
            </View>

            {isActive && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.primary}
                style={styles.checkmark}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

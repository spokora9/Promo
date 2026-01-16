import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      label: 'Edit Profile',
      onPress: () => router.push('/settings/profile'),
    },
    {
      icon: 'compass-outline',
      label: 'Discovery Settings',
      onPress: () => router.push('/settings/discovery'),
    },
    {
      icon: 'notifications-outline',
      label: 'Notification Preferences',
      onPress: () => router.push('/settings/notifications'),
    },
    {
      icon: 'location-outline',
      label: 'Location Settings',
      onPress: () => router.push('/settings/location'),
    },
    {
      icon: 'shield-outline',
      label: 'Privacy & Security',
      onPress: () => router.push('/settings/privacy'),
    },
    {
      icon: 'help-circle-outline',
      label: 'Help & Support',
      onPress: () => router.push('/settings/help'),
    },
    {
      icon: 'information-circle-outline',
      label: 'About',
      onPress: () => router.push('/settings/about'),
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: colors.primary,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
    },
    content: {
      flex: 1,
    },
    profileSection: {
      backgroundColor: '#fff',
      paddingHorizontal: 20,
      paddingVertical: 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    profileName: {
      fontSize: 22,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    profileEmail: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    menuSection: {
      backgroundColor: '#fff',
      marginTop: 16,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuItemLast: {
      borderBottomWidth: 0,
    },
    menuIcon: {
      width: 32,
      alignItems: 'center',
    },
    menuLabel: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
    },
    logoutButton: {
      marginHorizontal: 20,
      marginTop: 24,
      marginBottom: 40,
      paddingVertical: 14,
      backgroundColor: '#FEE2E2',
      borderRadius: 8,
      alignItems: 'center',
    },
    logoutButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#DC2626',
    },
    version: {
      textAlign: 'center',
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 20,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Text style={styles.profileName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.profileEmail}>{user?.email || user?.phone}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast,
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon as any} size={24} color={colors.text} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

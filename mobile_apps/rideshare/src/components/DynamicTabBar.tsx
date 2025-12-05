import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Menu, MenuItem } from '../api/screensService';

interface DynamicTabBarProps {
  menu: Menu;
  currentScreenId: number;
  onNavigate: (screenId: number, screenName: string) => void;
}

export const DynamicTabBar: React.FC<DynamicTabBarProps> = ({
  menu,
  currentScreenId,
  onNavigate,
}) => {
  return (
    <View style={styles.container}>
      {menu.items.map((item) => {
        const isActive = item.screen_id === currentScreenId;
        const label = item.label || item.screen_name;
        const iconName = item.icon || 'help-circle-outline';

        return (
          <TouchableOpacity
            key={item.id}
            style={styles.tab}
            onPress={() => onNavigate(item.screen_id, item.screen_name)}
          >
            <Icon
              name={iconName}
              size={24}
              color={isActive ? '#007AFF' : '#8E8E93'}
            />
            <Text
              style={[
                styles.label,
                isActive ? styles.labelActive : styles.labelInactive,
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingBottom: 20, // Safe area for iPhone bottom
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 10,
    marginTop: 4,
  },
  labelActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  labelInactive: {
    color: '#8E8E93',
  },
});

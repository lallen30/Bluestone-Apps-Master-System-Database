import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Menu, MenuItem } from '../api/screensService';

interface DynamicSidebarProps {
  menu: Menu;
  visible: boolean;
  onClose: () => void;
  currentScreenId: number;
  onNavigate: (screenId: number, screenName: string) => void;
}

export const DynamicSidebar: React.FC<DynamicSidebarProps> = ({
  menu,
  visible,
  onClose,
  currentScreenId,
  onNavigate,
}) => {
  const isLeft = menu.menu_type === 'sidebar_left';

  const handleNavigate = (screenId: number, screenName: string) => {
    onNavigate(screenId, screenName);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.sidebar,
                isLeft ? styles.sidebarLeft : styles.sidebarRight,
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>{menu.name}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Icon name="close-outline" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              {/* Menu Items */}
              <ScrollView style={styles.menuList}>
                {menu.items.map((item) => {
                  const isActive = item.screen_id === currentScreenId;
                  const label = item.label || item.screen_name;
                  const iconName = item.icon || 'help-circle-outline';

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.menuItem,
                        isActive && styles.menuItemActive,
                      ]}
                      onPress={() => handleNavigate(item.screen_id, item.screen_name)}
                    >
                      <Icon
                        name={iconName}
                        size={24}
                        color={isActive ? '#007AFF' : '#000'}
                      />
                      <Text
                        style={[
                          styles.menuItemText,
                          isActive && styles.menuItemTextActive,
                        ]}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  sidebar: {
    width: 280,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  sidebarLeft: {
    marginRight: 'auto',
  },
  sidebarRight: {
    marginLeft: 'auto',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    padding: 4,
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  menuItemActive: {
    backgroundColor: '#F2F2F7',
  },
  menuItemText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  menuItemTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

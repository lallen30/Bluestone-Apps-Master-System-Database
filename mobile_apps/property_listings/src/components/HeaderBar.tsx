import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { Menu } from '../api/screensService';

interface HeaderBarConfig {
  showTitle?: boolean;
  backgroundColor?: string;
  textColor?: string;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  leftIconType?: 'menu' | 'back';
  elevation?: number;
}

interface HeaderBarProps {
  title: string;
  config: HeaderBarConfig;
  leftMenu?: Menu | null;
  rightMenu?: Menu | null;
  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  config,
  leftMenu,
  rightMenu,
  onLeftIconPress,
  onRightIconPress,
}) => {
  const navigation = useNavigation();
  
  const {
    showTitle = true,
    backgroundColor = '#FFFFFF',
    textColor = '#000000',
    showLeftIcon = true,
    showRightIcon = false,
    leftIconType = 'menu',
    elevation = 2,
  } = config;

  // Determine left icon based on type
  const leftIconName = leftIconType === 'back' ? 'arrow-left' : (leftMenu?.icon || 'menu');
  const rightIconName = rightMenu?.icon || 'dots-vertical';

  // Handle left icon press
  const handleLeftIconPress = () => {
    if (leftIconType === 'back') {
      navigation.goBack();
    } else if (onLeftIconPress) {
      onLeftIconPress();
    }
  };

  return (
    <>
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={textColor === '#FFFFFF' ? 'light-content' : 'dark-content'}
      />
      <View
        style={[
          styles.container,
          {
            backgroundColor,
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: elevation },
                shadowOpacity: 0.1,
                shadowRadius: elevation,
              },
              android: {
                elevation,
              },
            }),
          },
        ]}
      >
        {/* Left Icon */}
        {showLeftIcon && (leftIconType === 'back' || leftMenu) && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleLeftIconPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name={leftIconName} size={24} color={textColor} />
          </TouchableOpacity>
        )}

        {/* Title */}
        {showTitle && (
          <View style={styles.titleContainer}>
            <Text
              style={[styles.title, { color: textColor }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </View>
        )}

        {/* Right Icon */}
        {showRightIcon && rightMenu && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onRightIconPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name={rightIconName} size={24} color={textColor} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HeaderBar;

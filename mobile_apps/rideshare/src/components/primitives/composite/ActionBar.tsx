import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActionBarConfig, PrimitiveProps } from '../types';

interface ActionBarProps extends PrimitiveProps {
  config: ActionBarConfig;
}

const ActionBar: React.FC<ActionBarProps> = ({ config, children }) => {
  const isBottom = config.position !== 'top';

  return (
    <View
      style={[
        styles.container,
        isBottom ? styles.bottom : styles.top,
        {
          backgroundColor: config.backgroundColor ?? '#FFFFFF',
          borderColor: config.borderColor ?? '#E5E5EA',
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bottom: {
    bottom: 0,
    borderTopWidth: 1,
    borderBottomWidth: 0,
  },
  top: {
    top: 0,
    borderBottomWidth: 1,
    borderTopWidth: 0,
  },
});

export default ActionBar;

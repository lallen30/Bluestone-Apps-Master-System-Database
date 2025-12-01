import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { IconConfig, PrimitiveProps } from '../types';

interface PrimitiveIconProps extends PrimitiveProps {
  config: IconConfig;
}

const PrimitiveIcon: React.FC<PrimitiveIconProps> = ({ config }) => {
  return (
    <View>
      <Icon
        name={config.name}
        size={config.size ?? 24}
        color={config.color ?? '#1C1C1E'}
      />
    </View>
  );
};

export default PrimitiveIcon;

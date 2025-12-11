import React from 'react';
import { View } from 'react-native';
import { DividerConfig, PrimitiveProps } from '../types';

interface DividerProps extends PrimitiveProps {
  config: DividerConfig;
}

const Divider: React.FC<DividerProps> = ({ config }) => {
  return (
    <View
      style={{
        height: config.thickness ?? 1,
        backgroundColor: config.color ?? '#E5E5EA',
        marginVertical: config.marginVertical ?? 8,
      }}
    />
  );
};

export default Divider;

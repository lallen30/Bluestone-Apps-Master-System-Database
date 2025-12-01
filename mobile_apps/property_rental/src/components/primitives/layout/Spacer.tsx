import React from 'react';
import { View } from 'react-native';
import { SpacerConfig, PrimitiveProps } from '../types';

interface SpacerProps extends PrimitiveProps {
  config: SpacerConfig;
}

const Spacer: React.FC<SpacerProps> = ({ config }) => {
  return (
    <View
      style={{
        height: config.height,
        width: config.width,
      }}
    />
  );
};

export default Spacer;

declare module 'react-native-vector-icons/MaterialIcons' {
  import { Component } from 'react';
  import { TextProps } from 'react-native';

  export interface IconProps extends TextProps {
    size?: number;
    name: string;
    color?: string;
  }

  export default class Icon extends Component<IconProps> {}
}

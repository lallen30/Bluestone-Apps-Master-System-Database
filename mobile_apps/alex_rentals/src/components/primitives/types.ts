// Primitive component types and interfaces

export interface PrimitiveConfig {
  [key: string]: any;
}

export interface DataBinding {
  [key: string]: string; // e.g., { "text": "$.title", "source": "$.images[0].url" }
}

export interface ElementDefinition {
  id?: number;
  type: string;
  config?: PrimitiveConfig;
  data_binding?: DataBinding;
  children?: ElementDefinition[];
  conditions?: {
    show_if?: string; // e.g., "$.status === 'active'"
    hide_if?: string;
  };
}

export interface PrimitiveProps {
  config: PrimitiveConfig;
  data?: any;
  children?: React.ReactNode;
  navigation?: any;
  onAction?: (action: string, payload?: any) => void;
}

// Layout primitive configs
export interface ContainerConfig {
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  margin?: number;
  marginHorizontal?: number;
  marginVertical?: number;
  backgroundColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  flex?: number;
}

export interface RowConfig extends ContainerConfig {
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  gap?: number;
  wrap?: boolean;
}

export interface ColumnConfig extends RowConfig {}

export interface SpacerConfig {
  height?: number;
  width?: number;
}

// Content primitive configs
export interface TextConfig {
  text?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  lineHeight?: number;
}

export interface HeadingConfig extends TextConfig {
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export interface ImageConfig {
  source?: string;
  height?: number;
  width?: number | string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  borderRadius?: number;
  aspectRatio?: number;
}

export interface IconConfig {
  name: string;
  size?: number;
  color?: string;
}

export interface AvatarConfig {
  source?: string;
  size?: number;
  fallbackIcon?: string;
  borderColor?: string;
  borderWidth?: number;
}

export interface DividerConfig {
  color?: string;
  thickness?: number;
  marginVertical?: number;
}

// Interactive primitive configs
export interface ButtonConfig {
  label?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  action?: string; // 'navigate' | 'submit' | 'custom'
  target?: string; // screen_id or URL
  screenName?: string; // Name of the target screen for navigation
  backgroundColor?: string;
  textColor?: string;
  // Legacy format support
  actionType?: string; // 'screen' | 'url' | 'submit'
  screenId?: number | string;
}

export interface LinkConfig {
  text?: string;
  action?: string;
  target?: string;
  color?: string;
  fontSize?: number;
}

// Input primitive configs
export interface InputConfig {
  field_key: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    message?: string;
  };
}

export interface TextInputConfig extends InputConfig {
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
}

export interface DropdownConfig extends InputConfig {
  options: Array<{ label: string; value: string }>;
  multiple?: boolean;
}

export interface SwitchConfig extends InputConfig {
  onColor?: string;
  offColor?: string;
}

export interface DatePickerConfig extends InputConfig {
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: string;
  maximumDate?: string;
  format?: string;
}

export interface ImagePickerConfig extends InputConfig {
  maxImages?: number;
  allowCamera?: boolean;
  allowGallery?: boolean;
  aspectRatio?: number;
}

// Data primitive configs
export interface ListConfig {
  dataSource: string; // JSONPath to array in data
  itemTemplate: ElementDefinition;
  emptyState?: ElementDefinition;
  separator?: boolean;
  horizontal?: boolean;
}

export interface DataFieldConfig {
  field: string; // JSONPath to value
  label?: string;
  format?: 'text' | 'currency' | 'date' | 'number' | 'percentage';
  prefix?: string;
  suffix?: string;
}

export interface ConditionalConfig {
  condition: string; // Expression to evaluate
  then: ElementDefinition;
  else?: ElementDefinition;
}

// Composite primitive configs
export interface ImageGalleryConfig {
  dataSource?: string;
  height?: number;
  showPagination?: boolean;
  showFavoriteButton?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export interface RatingDisplayConfig {
  rating?: number;
  maxRating?: number;
  reviewCount?: number;
  size?: number;
  color?: string;
}

export interface PriceDisplayConfig {
  amount?: number;
  currency?: string;
  period?: string; // 'night', 'month', 'hour'
  originalAmount?: number; // For showing discounts
  fontSize?: number;
}

export interface CardConfig extends ContainerConfig {
  shadow?: boolean;
  onPress?: string; // action
}

export interface ActionBarConfig {
  position?: 'top' | 'bottom';
  backgroundColor?: string;
  borderColor?: string;
}

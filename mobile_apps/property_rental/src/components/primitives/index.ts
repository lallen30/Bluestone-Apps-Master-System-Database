// Layout primitives
export { Container, Row, Column, Card, Spacer } from './layout';

// Content primitives
export { PrimitiveText, Heading, PrimitiveImage, PrimitiveIcon, Avatar, Divider } from './content';

// Interactive primitives
export { Button, Link } from './interactive';

// Input primitives
export { TextInput, Dropdown, Switch } from './input';

// Composite primitives
export { ImageGallery, RatingDisplay, PriceDisplay, DataField, ActionBar, List } from './composite';

// Types
export * from './types';

// Element Renderer
export { default as ElementRenderer } from './ElementRenderer';

// Primitive registry - maps type names to components
import { Container, Row, Column, Card, Spacer } from './layout';
import { PrimitiveText, Heading, PrimitiveImage, PrimitiveIcon, Avatar, Divider } from './content';
import { Button, Link } from './interactive';
import { TextInput, Dropdown, Switch } from './input';
import { ImageGallery, RatingDisplay, PriceDisplay, DataField, ActionBar, List } from './composite';

export const PRIMITIVES: { [key: string]: React.ComponentType<any> } = {
  // Layout - PascalCase
  Container,
  Row,
  Column,
  Card,
  Spacer,
  // Layout - lowercase aliases
  container: Container,
  row: Row,
  column: Column,
  card: Card,
  spacer: Spacer,
  
  // Content - PascalCase
  Text: PrimitiveText,
  Heading,
  Image: PrimitiveImage,
  Icon: PrimitiveIcon,
  Avatar,
  Divider,
  // Content - lowercase aliases
  text: PrimitiveText,
  heading: Heading,
  paragraph: PrimitiveText, // paragraph maps to Text
  image: PrimitiveImage,
  icon: PrimitiveIcon,
  avatar: Avatar,
  divider: Divider,
  
  // Interactive - PascalCase
  Button,
  Link,
  // Interactive - lowercase aliases
  button: Button,
  link: Link,
  
  // Input - PascalCase
  TextInput,
  Dropdown,
  Switch,
  // Input - lowercase aliases
  text_input: TextInput,
  textInput: TextInput,
  dropdown: Dropdown,
  switch: Switch,
  
  // Composite - PascalCase
  ImageGallery,
  RatingDisplay,
  PriceDisplay,
  DataField,
  ActionBar,
  List,
  // Composite - lowercase aliases
  image_gallery: ImageGallery,
  imageGallery: ImageGallery,
  rating_display: RatingDisplay,
  ratingDisplay: RatingDisplay,
  price_display: PriceDisplay,
  priceDisplay: PriceDisplay,
  data_field: DataField,
  dataField: DataField,
  action_bar: ActionBar,
  actionBar: ActionBar,
  list: List,
};

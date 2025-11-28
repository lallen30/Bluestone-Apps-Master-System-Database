import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface ScreenElement {
  id: number;
  element_type: string;
  config?: any;
  default_config?: any;
}

interface PropertyDescriptionElementProps {
  element: ScreenElement;
  listingData?: any;
}

const PropertyDescriptionElement: React.FC<PropertyDescriptionElementProps> = ({ element, listingData }) => {
  const config = element.config || element.default_config || {};
  const {
    title = 'About this place',
    showTitle = true,
    maxLines = 5,
    showReadMore = true,
    titleFontSize = 18,
    textFontSize = 16,
    textColor = '#1C1C1E',
    titleColor = '#1C1C1E',
  } = config;

  const [expanded, setExpanded] = useState(false);

  if (!listingData?.description) {
    return null;
  }

  return (
    <View style={styles.container}>
      {showTitle && (
        <Text style={[styles.title, { fontSize: titleFontSize, color: titleColor }]}>
          {title}
        </Text>
      )}
      <Text
        style={[styles.description, { fontSize: textFontSize, color: textColor }]}
        numberOfLines={expanded ? undefined : maxLines}
      >
        {listingData.description}
      </Text>
      {showReadMore && listingData.description.length > 200 && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.readMore}>
            {expanded ? 'Show less' : 'Read more'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    lineHeight: 24,
  },
  readMore: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 8,
  },
});

export default PropertyDescriptionElement;

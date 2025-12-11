import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { ListConfig, PrimitiveProps, ElementDefinition } from '../types';

interface ListProps extends PrimitiveProps {
  config: ListConfig;
  renderElement: (element: ElementDefinition, itemData: any, index: number) => React.ReactNode;
}

const List: React.FC<ListProps> = ({ config, data, renderElement }) => {
  // Resolve data source path
  let items: any[] = [];
  if (data && config.dataSource) {
    const path = config.dataSource.replace('$.', '').split('.');
    let value = data;
    for (const key of path) {
      if (value && typeof value === 'object') {
        value = value[key];
      }
    }
    if (Array.isArray(value)) {
      items = value;
    }
  }

  if (items.length === 0 && config.emptyState) {
    return <View>{renderElement(config.emptyState, {}, 0)}</View>;
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.item}>
      {renderElement(config.itemTemplate, item, index)}
    </View>
  );

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
      horizontal={config.horizontal}
      ItemSeparatorComponent={config.separator ? () => <View style={styles.separator} /> : undefined}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  item: {},
  separator: {
    height: 1,
    backgroundColor: '#E5E5EA',
  },
});

export default List;

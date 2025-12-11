import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { PRIMITIVES, ElementDefinition, DataBinding } from './index';

interface ElementRendererProps {
  elements: ElementDefinition[];
  data?: any;
  formData?: { [key: string]: any };
  onFormChange?: (field_key: string, value: any) => void;
  onAction?: (action: string, payload?: any) => void;
  navigation?: any;
  loading?: boolean;
}

// Resolve a JSONPath-like expression against data
// Supports: $.field, $.nested.field, $.array[0].field
const resolvePath = (path: string, data: any): any => {
  if (!path || !data) return undefined;
  
  // Remove $. prefix if present
  const cleanPath = path.startsWith('$.') ? path.slice(2) : path;
  
  // Handle simple concatenation like "$.city, $.state"
  if (cleanPath.includes(',')) {
    const parts = path.split(',').map(p => p.trim());
    return parts.map(p => resolvePath(p, data)).filter(Boolean).join(', ');
  }
  
  const parts = cleanPath.split('.');
  let value = data;
  
  for (const part of parts) {
    if (value === null || value === undefined) return undefined;
    
    // Handle array access like "array[0]"
    const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
    if (arrayMatch) {
      value = value[arrayMatch[1]]?.[parseInt(arrayMatch[2])];
    } else {
      value = value[part];
    }
  }
  
  return value;
};

// Apply data bindings to config
const applyDataBindings = (
  config: any,
  dataBinding: DataBinding | undefined,
  data: any
): any => {
  if (!dataBinding || !data) return config;
  
  const resolvedConfig = { ...config };
  
  for (const [key, path] of Object.entries(dataBinding)) {
    const value = resolvePath(path, data);
    if (value !== undefined) {
      resolvedConfig[key] = value;
    }
  }
  
  return resolvedConfig;
};

// Evaluate a condition expression
const evaluateCondition = (condition: string, data: any): boolean => {
  if (!condition) return true;
  
  try {
    // Simple condition parsing: "$.field === 'value'" or "$.field > 0"
    const match = condition.match(/^\$\.(\S+)\s*(===|!==|>|<|>=|<=)\s*(.+)$/);
    if (!match) return true;
    
    const [, path, operator, rawValue] = match;
    const fieldValue = resolvePath(`$.${path}`, data);
    
    // Parse the comparison value
    let compareValue: any = rawValue.trim();
    if (compareValue.startsWith("'") && compareValue.endsWith("'")) {
      compareValue = compareValue.slice(1, -1);
    } else if (compareValue === 'true') {
      compareValue = true;
    } else if (compareValue === 'false') {
      compareValue = false;
    } else if (compareValue === 'null') {
      compareValue = null;
    } else if (!isNaN(Number(compareValue))) {
      compareValue = Number(compareValue);
    }
    
    switch (operator) {
      case '===': return fieldValue === compareValue;
      case '!==': return fieldValue !== compareValue;
      case '>': return fieldValue > compareValue;
      case '<': return fieldValue < compareValue;
      case '>=': return fieldValue >= compareValue;
      case '<=': return fieldValue <= compareValue;
      default: return true;
    }
  } catch {
    return true;
  }
};

const ElementRenderer: React.FC<ElementRendererProps> = ({
  elements,
  data,
  formData = {},
  onFormChange,
  onAction,
  navigation,
  loading,
}) => {
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const renderElement = (element: ElementDefinition, itemData?: any, index?: number): React.ReactNode => {
    const { type, config = {}, data_binding, children, conditions } = element;
    
    // Check conditions
    if (conditions?.show_if && !evaluateCondition(conditions.show_if, itemData ?? data)) {
      return null;
    }
    if (conditions?.hide_if && evaluateCondition(conditions.hide_if, itemData ?? data)) {
      return null;
    }
    
    // Get the primitive component
    const Component = PRIMITIVES[type];
    if (!Component) {
      console.warn(`Unknown primitive type: ${type}`);
      return null;
    }
    
    // Apply data bindings
    const resolvedConfig = applyDataBindings(config, data_binding, itemData ?? data);
    
    // Generate key separately (React keys should not be spread)
    const elementKey = element.id ?? `${type}-${index ?? 0}`;
    
    // Build props (without key - it will be passed directly to JSX)
    const props: any = {
      config: resolvedConfig,
      data: itemData ?? data,
      navigation,
      onAction: (action: string, payload?: any) => {
        if (action === 'navigate' && payload?.target && navigation) {
          navigation.navigate('DynamicScreen', {
            screenId: parseInt(payload.target),
            screenName: payload.screenName ?? 'Screen',
          });
        } else if (action === 'submit') {
          onAction?.('submit', formData);
        } else {
          onAction?.(action, payload);
        }
      },
    };
    
    // Add form-specific props for input primitives
    if (['TextInput', 'Dropdown', 'Switch', 'text_input', 'textInput', 'dropdown', 'switch'].includes(type)) {
      props.value = formData[resolvedConfig.field_key];
      props.onChange = onFormChange;
    }
    
    // Render children recursively
    if (children && children.length > 0) {
      props.children = children.map((child, i) => renderElement(child, itemData ?? data, i));
    }
    
    // Special handling for List primitive
    if (type === 'List' || type === 'list') {
      props.renderElement = renderElement;
    }
    
    return <Component key={elementKey} {...props} />;
  };

  return (
    <View style={styles.container}>
      {elements.map((element, index) => renderElement(element, data, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ElementRenderer;

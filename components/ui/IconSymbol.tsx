// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'checkmark': 'check',
  'search': 'search',
  'plus': 'add',
  'trash': 'delete',
  'clock': 'access-time',
  'bell': 'notifications',
  'calendar': 'calendar-today',
  'person': 'person',
  'chevron.left': 'chevron-left',
  'home': 'home',
  'list': 'list',
  'settings': 'settings',
  'stats': 'bar-chart',
} as const;

// Create a type from the mapping keys
export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const materialIconName = MAPPING[name];
  return (
    <MaterialIcons 
      name={materialIconName} 
      size={size} 
      color={color} 
      style={style} 
    />
  );
}

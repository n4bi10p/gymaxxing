import { Platform } from 'react-native';
import { requireNativeModule, requireNativeViewManager } from 'expo-modules-core';
import type { ComponentType } from 'react';
import type { ViewProps } from 'react-native';

export interface LiquidGlassProps extends ViewProps {
  pressed?: boolean;
}

type NativeModule = {
  getSystemAccent: () => string | null;
};

let nativeModule: NativeModule | null | undefined;
let nativeView: ComponentType<LiquidGlassProps> | null | undefined;

function loadModule(): NativeModule | null {
  if (Platform.OS !== 'android') return null;
  if (nativeModule !== undefined) return nativeModule;
  try {
    nativeModule = requireNativeModule<NativeModule>('GymaxxingNative');
  } catch {
    nativeModule = null;
  }
  return nativeModule;
}

export function getSystemAccent(): string | null {
  return loadModule()?.getSystemAccent() ?? null;
}

export function loadLiquidGlassView(): ComponentType<LiquidGlassProps> | null {
  if (Platform.OS !== 'android') return null;
  if (nativeView !== undefined) return nativeView;
  try {
    nativeView = requireNativeViewManager<LiquidGlassProps>('GymaxxingNative', 'LiquidGlassView');
  } catch {
    nativeView = null;
  }
  return nativeView;
}

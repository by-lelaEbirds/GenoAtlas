import { Capacitor } from '@capacitor/core';

export function isNativeRuntime() {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export function getRuntimePlatform() {
  try {
    return Capacitor.getPlatform();
  } catch {
    return 'web';
  }
}

export function isAndroidRuntime() {
  return getRuntimePlatform() === 'android';
}

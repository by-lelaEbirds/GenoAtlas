import { Preferences } from '@capacitor/preferences';

const getLocalStorage = () => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const saveNativeData = async (key, val) => {
  const nextValue = val.toString();

  try {
    await Preferences.set({ key, value: nextValue });
  } catch (e) {
    console.warn('GenoAtlas - Erro ao salvar dados nativos:', e);
  }

  getLocalStorage()?.setItem(key, nextValue);
};

export const getNativeData = async (key) => {
  try {
    const { value } = await Preferences.get({ key });
    if (value !== null && value !== undefined) {
      return value;
    }
  } catch (e) {
    console.warn('GenoAtlas - Erro ao buscar dados nativos:', e);
  }

  return getLocalStorage()?.getItem(key) ?? null;
};

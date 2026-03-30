import { Preferences } from '@capacitor/preferences';

export const saveNativeData = async (key, val) => {
  try {
    await Preferences.set({ key, value: val.toString() });
  } catch (e) {
    console.warn('GenoAtlas - Erro ao salvar dados nativos:', e);
  }
};

export const getNativeData = async (key) => {
  try {
    const { value } = await Preferences.get({ key });
    return value;
  } catch (e) {
    console.warn('GenoAtlas - Erro ao buscar dados nativos:', e);
    return null;
  }
};

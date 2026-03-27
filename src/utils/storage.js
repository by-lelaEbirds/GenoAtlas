import { Preferences } from '@capacitor/preferences';

export const saveNativeData = async (key, val) => {
  try { 
    await Preferences.set({ key, value: val.toString() }); 
  } catch (e) {
    console.error(`GenoAtlas - Erro ao salvar ${key}:`, e);
  }
};

export const getNativeData = async (key) => {
  try { 
    const { value } = await Preferences.get({ key });
    return value;
  } catch (e) {
    console.error(`GenoAtlas - Erro ao recuperar ${key}:`, e);
    return null;
  }
};

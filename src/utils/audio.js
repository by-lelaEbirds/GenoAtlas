let globalAudioCtx = null;

export function playTone(freq, type = 'sine', duration = 0.1, vol = 0.1) {
  try {
    if (!globalAudioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) globalAudioCtx = new AudioContext();
    }
    
    if (!globalAudioCtx) return;
    
    if (globalAudioCtx.state === 'suspended') globalAudioCtx.resume();

    const osc = globalAudioCtx.createOscillator();
    const gain = globalAudioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, globalAudioCtx.currentTime);
    gain.gain.setValueAtTime(vol, globalAudioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, globalAudioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(globalAudioCtx.destination);
    
    osc.start();
    osc.stop(globalAudioCtx.currentTime + duration);
  } catch (e) {
    console.error("Audio Web API bloqueada", e);
  }
}

const basePath = import.meta.env.BASE_URL;

const SOUND_PATHS = {
  success: `${basePath}assets/sounds/success.mp3`,
  error:   `${basePath}assets/sounds/error.mp3`,
  coin:    `${basePath}assets/sounds/coin.mp3`,
  stadium: `${basePath}assets/sounds/stadium.mp3`
};

const premiumSounds = {};

export function playSound(name, volume = 0.5) {
  try {
    if (!premiumSounds[name]) {
      if (!SOUND_PATHS[name]) return;
      premiumSounds[name] = new Audio(SOUND_PATHS[name]);
      premiumSounds[name].preload = 'auto';
    }
    premiumSounds[name].pause();
    premiumSounds[name].currentTime = 0;
    premiumSounds[name].volume = volume;
    const p = premiumSounds[name].play();
    if (p !== undefined) p.catch(() => {});
  } catch (e) {
    console.error('Erro ao tocar som:', e);
  }
}

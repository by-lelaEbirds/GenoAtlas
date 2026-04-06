let globalAudioCtx = null;
let isAudioEnabled = true;

function getAudioContext() {
  if (globalAudioCtx) {
    return globalAudioCtx;
  }

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    return null;
  }

  globalAudioCtx = new AudioContext();
  return globalAudioCtx;
}

export function setAudioEnabled(nextValue) {
  isAudioEnabled = Boolean(nextValue);
}

export function warmupAudio() {
  try {
    const audioContext = getAudioContext();
    if (audioContext?.state === 'suspended') {
      audioContext.resume();
    }
  } catch (e) {
    console.debug('Falha ao inicializar áudio:', e);
  }
}

export function playTone(freq, type = 'sine', duration = 0.1, vol = 0.1) {
  try {
    if (!isAudioEnabled || document.hidden) {
      return;
    }

    const audioContext = getAudioContext();
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);
    gain.gain.setValueAtTime(vol, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + duration);
  } catch (e) {
    console.warn('Audio Web API bloqueada ou indisponível:', e);
  }
}

const basePath = import.meta.env.BASE_URL || '/';

const SOUND_PATHS = {
  success: `${basePath}assets/sounds/success.mp3`,
  error: `${basePath}assets/sounds/error.mp3`,
  coin: `${basePath}assets/sounds/coin.mp3`,
  stadium: `${basePath}assets/sounds/stadium.mp3`,
};

const premiumSounds = {};

export function playSound(name, volume = 0.5) {
  try {
    if (!isAudioEnabled || document.hidden) {
      return;
    }

    if (!premiumSounds[name]) {
      if (!SOUND_PATHS[name]) return;
      premiumSounds[name] = new Audio(SOUND_PATHS[name]);
      premiumSounds[name].preload = 'auto';
      premiumSounds[name].playsInline = true;
    }

    const sound = premiumSounds[name];

    sound.pause();
    sound.currentTime = 0;
    sound.volume = volume;

    const playPromise = sound.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        if (error.name !== 'AbortError') {
          console.debug('Erro ao tocar som:', error);
        }
      });
    }
  } catch (e) {
    console.error('Erro geral ao tocar som:', e);
  }
}

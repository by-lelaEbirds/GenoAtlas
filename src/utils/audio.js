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
    console.warn("Audio Web API bloqueada ou indisponível:", e);
  }
}

const basePath = import.meta.env.BASE_URL || '/';

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
    
    const sound = premiumSounds[name];
    
    // Reseta o áudio caso ele já esteja tocando
    sound.pause();
    sound.currentTime = 0;
    sound.volume = volume;
    
    const playPromise = sound.play();
    
    // Previne erros no console de "The play() request was interrupted by a call to pause()"
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Interrupções de áudio são normais em cliques rápidos, ignoramos o erro silenciosamente
        if (error.name !== 'AbortError') {
          console.debug('Erro ao tocar som:', error);
        }
      });
    }
  } catch (e) {
    console.error('Erro geral ao tocar som:', e);
  }
}

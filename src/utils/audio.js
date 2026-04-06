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

function playToneSequence(sequence, type = 'sine', masterVolume = 0.08) {
  try {
    if (!isAudioEnabled || document.hidden) {
      return;
    }

    const audioContext = getAudioContext();
    if (!audioContext) {
      return;
    }

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    sequence.forEach(({ freq, at = 0, duration = 0.12, volume = 1 }) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + at);
      gain.gain.setValueAtTime(masterVolume * volume, audioContext.currentTime + at);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + at + duration);

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start(audioContext.currentTime + at);
      oscillator.stop(audioContext.currentTime + at + duration);
    });
  } catch (error) {
    console.debug('Falha ao tocar sequencia de audio:', error);
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

export function playThemeCue(themeId) {
  if (themeId === 'noturno') {
    playToneSequence(
      [
        { freq: 320, at: 0, duration: 0.14, volume: 0.8 },
        { freq: 480, at: 0.08, duration: 0.16, volume: 0.7 },
        { freq: 640, at: 0.18, duration: 0.18, volume: 0.65 },
      ],
      'triangle',
      0.09,
    );
    return;
  }

  if (themeId === 'ouro') {
    playToneSequence(
      [
        { freq: 392, at: 0, duration: 0.12, volume: 0.75 },
        { freq: 523, at: 0.1, duration: 0.14, volume: 0.9 },
        { freq: 784, at: 0.2, duration: 0.16, volume: 0.65 },
      ],
      'sine',
      0.1,
    );
    return;
  }

  playToneSequence(
    [
      { freq: 392, at: 0, duration: 0.12, volume: 0.65 },
      { freq: 494, at: 0.08, duration: 0.14, volume: 0.75 },
      { freq: 587, at: 0.18, duration: 0.18, volume: 0.7 },
    ],
    'triangle',
    0.08,
  );
}

export function playModeCue(mode) {
  if (mode === 'football') {
    playToneSequence(
      [
        { freq: 220, at: 0, duration: 0.12, volume: 0.8 },
        { freq: 330, at: 0.08, duration: 0.12, volume: 0.7 },
        { freq: 440, at: 0.16, duration: 0.14, volume: 0.7 },
      ],
      'square',
      0.07,
    );
    return;
  }

  if (mode === 'study') {
    playToneSequence(
      [
        { freq: 392, at: 0, duration: 0.14, volume: 0.75 },
        { freq: 440, at: 0.1, duration: 0.14, volume: 0.65 },
        { freq: 523, at: 0.22, duration: 0.16, volume: 0.6 },
      ],
      'sine',
      0.07,
    );
    return;
  }

  if (mode === 'daily') {
    playToneSequence(
      [
        { freq: 523, at: 0, duration: 0.1, volume: 0.85 },
        { freq: 659, at: 0.09, duration: 0.12, volume: 0.8 },
        { freq: 784, at: 0.2, duration: 0.14, volume: 0.75 },
      ],
      'triangle',
      0.08,
    );
    return;
  }

  playToneSequence(
    [
      { freq: 330, at: 0, duration: 0.1, volume: 0.8 },
      { freq: 440, at: 0.08, duration: 0.12, volume: 0.75 },
      { freq: 554, at: 0.18, duration: 0.14, volume: 0.7 },
    ],
    'triangle',
    0.07,
  );
}

export function playComboStinger(streak) {
  const cappedStreak = Math.min(Math.max(streak, 3), 10);
  const rootFrequency = 300 + (cappedStreak * 18);

  playToneSequence(
    [
      { freq: rootFrequency, at: 0, duration: 0.07, volume: 0.8 },
      { freq: rootFrequency * 1.25, at: 0.06, duration: 0.09, volume: 0.75 },
      { freq: rootFrequency * 1.5, at: 0.12, duration: 0.12, volume: 0.7 },
    ],
    'triangle',
    0.08,
  );
}

export function playMissionCompleteCue() {
  playToneSequence(
    [
      { freq: 523, at: 0, duration: 0.08, volume: 0.75 },
      { freq: 659, at: 0.08, duration: 0.1, volume: 0.8 },
      { freq: 784, at: 0.18, duration: 0.14, volume: 0.75 },
      { freq: 1046, at: 0.3, duration: 0.18, volume: 0.6 },
    ],
    'triangle',
    0.09,
  );
}

export function playLevelUpCue() {
  playToneSequence(
    [
      { freq: 392, at: 0, duration: 0.09, volume: 0.75 },
      { freq: 523, at: 0.08, duration: 0.1, volume: 0.8 },
      { freq: 659, at: 0.18, duration: 0.12, volume: 0.85 },
      { freq: 1046, at: 0.3, duration: 0.2, volume: 0.7 },
    ],
    'triangle',
    0.1,
  );
}

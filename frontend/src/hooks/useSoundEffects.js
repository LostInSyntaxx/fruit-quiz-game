import { useCallback } from 'react';

// Sound effect URLs (using free sound effects)
const SOUND_EFFECTS = {
  correct: 'https://actions.google.com/sounds/v1/cartoon/clown_horn.ogg',
  wrong: 'https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg',
  countdown: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
  victory: 'https://actions.google.com/sounds/v1/crowds/battle_crowd_celebrate_stutter.ogg',
  click: 'https://actions.google.com/sounds/v1/ui/click_on_on.ogg',
};

const useSoundEffects = () => {
  // Play sound effect
  const playSound = useCallback((soundName) => {
    try {
      const audio = new Audio(SOUND_EFFECTS[soundName]);
      audio.volume = 0.3;
      audio.play().catch(err => {
        // Silently fail if audio can't play (browser policy)
        console.log('Audio play failed:', err);
      });
    } catch (error) {
      console.log('Sound effect not available:', error);
    }
  }, []);

  // Play correct answer sound
  const playCorrect = useCallback(() => {
    playSound('correct');
  }, [playSound]);

  // Play wrong answer sound
  const playWrong = useCallback(() => {
    playSound('wrong');
  }, [playSound]);

  // Play countdown tick
  const playCountdown = useCallback(() => {
    playSound('countdown');
  }, [playSound]);

  // Play victory sound
  const playVictory = useCallback(() => {
    playSound('victory');
  }, [playSound]);

  // Play click sound
  const playClick = useCallback(() => {
    playSound('click');
  }, [playSound]);

  return {
    playSound,
    playCorrect,
    playWrong,
    playCountdown,
    playVictory,
    playClick,
  };
};

export default useSoundEffects;

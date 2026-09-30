'use client';

// Helper function
export const playNotificationSound = (params: { audioFile: string }) => {
  try {
    const audio = new Audio(params.audioFile);
    audio.volume = 1; // 0.0 to 1.0

    audio.play().catch((err) => {
      // Handles autoplay restriction or missing file gracefully
      console.warn('Audio playback prevented by browser autoplay policy:', err);
    });
  } catch (error) {
    console.error('Failed to play notification sound:', error);
  }
};

// Synthesizes a clean two-tone notification chime
export const playSynthChime = () => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();

    // Create oscillator and gain (volume) nodes
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine'; // 'sine', 'triangle', 'square', 'sawtooth'

    // Play a 2-note chime: start at 523.25Hz (C5) and pitch up to 659.25Hz (E5)
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);

    // Smooth volume fade-out to eliminate clicking sounds
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  } catch (err) {
    console.warn('Web Audio playback failed:', err);
  }
};

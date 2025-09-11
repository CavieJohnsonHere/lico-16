import type { LoadedSound } from "./memory";

export type Sound = {
  type: "A" | "B" | "C" | "D";

  // C5 is 0
  note: number;

  // Between 0 and 1
  volume: number;

  // in ms
  length: number;
};

export default function playSound(sound: Sound) {
  // Create audio context if not already present
  const AudioContext =
    window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  const ctx = (playSound as any)._ctx || new AudioContext();
  (playSound as any)._ctx = ctx;

  // Map note number to frequency (C5 = 523.25 Hz, 12 notes per octave)
  const baseFreq = 523.25;
  const freq = baseFreq * Math.pow(2, sound.note / 12);

  // Create oscillator
  const osc = ctx.createOscillator();
  let type: OscillatorType | undefined;
  switch (sound.type) {
    case "A":
      // Pulse wave (not natively supported, use custom waveform)
      // 25% duty cycle pulse
      const real = new Float32Array([0, 1, 0, 0, 0]);
      const imag = new Float32Array([0, 0, 0, 0, 0]);
      osc.setPeriodicWave(ctx.createPeriodicWave(real, imag));
      break;
    case "B":
      type = "square";
      break;
    case "C":
      type = "triangle";
      break;
    case "D":
      type = "sawtooth";
      break;
  }
  if (type) osc.type = type;
  osc.frequency.value = freq;

  // Gain node for volume
  const gain = ctx.createGain();
  gain.gain.value = Math.max(0, Math.min(1, sound.volume * 0.05));

  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + sound.length / 1000); // Convert ms to seconds

  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
}

const sounds: NodeJS.Timeout[][] = []

export async function playLoadedSound(loadedSound: LoadedSound, id: number) {
  // Play each sound one after the other (sequentially).
  for (const sound of loadedSound.content) {
    // Reset sounds from the id
    sounds[id] = [];

    // Start the sound
    playSound(sound);

    // Wait for its duration before playing the next one
    await new Promise((resolve) => {
      const soundTimeout = setTimeout(resolve, sound.length)
      sounds[id]?.push(soundTimeout);
    });
  }
}

export function stopSound(id: number) {
  const soundsToRemove = sounds[id]
  if (soundsToRemove) {
    soundsToRemove.forEach(soundToRemove => typeof soundToRemove.close == "function" ? soundToRemove.close() : "")
  }
}

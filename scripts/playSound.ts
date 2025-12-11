import type { LoadedSound } from "./memory";

export type Sound = {
  type: "A" | "B" | "C" | "D";

  // C5 is 0, 31 notes for 5 bits of memory
  note:
    | -15
    | -14
    | -13
    | -12
    | -11
    | -10
    | -9
    | -8
    | -7
    | -6
    | -5
    | -4
    | -3
    | -2
    | -1
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15;

  // Between 0 and 1, 7 options for 3 bits
  volume: 0 | 0.25 | 0.3 | 0.5 | 0.75 | 0.85 | 0.9 | 1;

  // in ms, 63 options for 6 bits
  // I'm to lazy to figure out the lengths...
  length: 0 | 1 | 100 | 350 | 500 | 700 | 750 | 1400;
};

const acceptableNotes = [
  -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3,
  4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
];

const acceptableVolumes = [0, 0.25, 0.3, 0.5, 0.75, 0.85, 0.9, 1];
const acceptableLengths = [0, 1, 100, 350, 500, 700, 750, 1400];

function soundIsAcceptable(sound: Sound) {
  return (
    ["A", "B", "C", "D"].includes(sound.type) &&
    acceptableNotes.includes(sound.note) &&
    acceptableVolumes.includes(sound.volume) &&
    acceptableLengths.includes(sound.length)
  );
}

export default function playSound(sound: Sound) {
  if (!soundIsAcceptable(sound)) {
    console.warn("Unacceptable sound");
    return;
  }

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

const sounds: NodeJS.Timeout[][] = [];

export async function playLoadedSound(loadedSound: LoadedSound, id: number) {
  console.log(loadedSound)

  // Play each sound one after the other (sequentially).
  for (const sound of loadedSound.content) {
    // Reset sounds from the id
    sounds[id] = [];

    // Start the sound
    playSound(sound);

    // Wait for its duration before playing the next one
    await new Promise((resolve) => {
      const soundTimeout = setTimeout(resolve, sound.length);
      sounds[id]?.push(soundTimeout);
    });
  }
}

export function stopSound(id: number) {
  console.log("Stopping sound", id);
  const soundsToRemove = sounds[id];
  if (soundsToRemove) {
    soundsToRemove.forEach((soundToRemove) => clearTimeout(soundToRemove));
  }
}

import { writeFileSync } from "node:fs";

// Original Farm Natura theme: a spacious D-major pentatonic melody, 48 BPM,
// in sixteen bars of 3/4. No recordings or third-party musical material.
const rate = 32000;
const beat = 60 / 48;
const length = Math.round(48 * beat * rate);
const left = new Float32Array(length);
const right = new Float32Array(length);
const frequency = (midi) => 440 * 2 ** ((midi - 69) / 12);
let seed = 42;
const noise = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 2147483648 - 1;
};
function note(midi, start, duration, volume, pan, instrument) {
  const hz = frequency(midi);
  const samples = Math.ceil(duration * rate);
  const offset = Math.round(start * rate);
  const l = Math.sqrt((1 - pan) / 2);
  const r = Math.sqrt((1 + pan) / 2);
  for (let i = 0; i < samples; i++) {
    const t = i / rate;
    const phase = 2 * Math.PI * hz * t;
    let sound = 0;
    if (instrument === "flute") {
      const attack = Math.min(t / 0.38, 1);
      const release = Math.min((duration - t) / 0.8, 1);
      const vibrato =
        0.025 * Math.sin(2 * Math.PI * 3.8 * t) * Math.min(t / 0.8, 1);
      sound =
        (Math.sin(phase + vibrato) +
          0.08 * Math.sin(phase * 2 + vibrato) +
          0.012 * Math.sin(phase * 3) +
          noise() * 0.006) *
        attack *
        release;
    } else if (instrument === "pluck") {
      for (let harmonic = 1; harmonic <= 3; harmonic++) {
        sound +=
          (Math.sin(phase * harmonic) *
            Math.exp(-t * (0.65 + harmonic * 0.35))) /
          harmonic ** 2.5;
      }
      sound *= Math.min(t / 0.06, 1) * Math.min((duration - t) / 0.65, 1);
    } else {
      sound =
        (Math.sin(phase) + 0.08 * Math.sin(phase * 2)) *
        Math.sin((Math.PI * t) / duration) ** 2;
    }
    const index = (offset + i) % length;
    left[index] += sound * volume * l;
    right[index] += sound * volume * r;
  }
}
const chords = [
  [50, 57, 62, 66],
  [47, 54, 59, 62],
  [43, 55, 59, 62],
  [45, 57, 59, 64],
];
// Each entry is [offset in beats, MIDI note, length in beats]. Spaces between
// phrases give the flute room to breathe rather than a continuous drone.
const phrases = [
  [[0.4, 62, 2.0]],
  [[0.5, 66, 1.8]],
  [[0.25, 69, 2.2]],
  [],
  [[0.4, 71, 1.9]],
  [[0.5, 69, 2.0]],
  [
    [0.25, 66, 1.2],
    [1.8, 64, 1.1],
  ],
  [[0.4, 62, 2.3]],
  [[0.5, 66, 2.0]],
  [],
  [[0.25, 69, 2.0]],
  [[0.4, 74, 2.1]],
  [[0.25, 71, 1.8]],
  [[0.6, 69, 2.0]],
  [[0.5, 64, 2.0]],
  [[0.35, 62, 2.4]],
];
for (let bar = 0; bar < 16; bar++) {
  const start = bar * 3 * beat;
  const chord = chords[Math.floor(bar / 2) % 4];
  chord.forEach((midi, index) =>
    note(midi, start, 5 * beat, 0.012, (index - 1.5) / 3, "pad"),
  );
  // Two mellow plucks per bar, with a small timing variation. No insistent beat.
  for (let pulse = 0; pulse < 2; pulse++) {
    const midi = chord[pulse ? 2 : 1] + 12;
    note(
      midi,
      start + (pulse * 1.65 + 0.12 + (bar % 3) * 0.035) * beat,
      3.2,
      0.03,
      pulse ? 0.28 : -0.28,
      "pluck",
    );
  }
  for (const [offset, midi, duration] of phrases[bar]) {
    note(midi, start + offset * beat, duration * beat, 0.058, -0.08, "flute");
  }
}
// Circular stereo echoes keep the reverb continuous across the loop boundary.
const dryLeft = left.slice();
const dryRight = right.slice();
for (let tap = 0; tap < 16; tap++) {
  const seconds = 0.097 + tap * 0.073;
  const amount = 0.08 * Math.exp(-tap / 5);
  const delay = Math.round(seconds * rate);
  for (let i = 0; i < length; i++) {
    const target = (i + delay) % length;
    left[target] += dryRight[i] * amount;
    right[target] += dryLeft[i] * amount;
  }
}
const buffer = Buffer.alloc(44 + length * 4);
buffer.write("RIFF", 0);
buffer.writeUInt32LE(buffer.length - 8, 4);
buffer.write("WAVEfmt ", 8);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(2, 22);
buffer.writeUInt32LE(rate, 24);
buffer.writeUInt32LE(rate * 4, 28);
buffer.writeUInt16LE(4, 32);
buffer.writeUInt16LE(16, 34);
buffer.write("data", 36);
buffer.writeUInt32LE(length * 4, 40);
let peak = 0;
for (let i = 0; i < length; i++)
  peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
const level = 0.45 / peak;
for (let i = 0; i < length; i++) {
  buffer.writeInt16LE(Math.round(left[i] * level * 32767), 44 + i * 4);
  buffer.writeInt16LE(Math.round(right[i] * level * 32767), 46 + i * 4);
}
writeFileSync(
  new URL("../public/audio/farm-natura-theme.wav", import.meta.url),
  buffer,
);
console.log(
  `Original theme: ${length / rate}s, stereo ${rate} Hz, peak ${peak.toFixed(3)}`,
);

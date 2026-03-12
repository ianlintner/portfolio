/**
 * BgTracks — 10 genre-spanning background music tracks for Cat Adventure.
 *
 * Genres: funk, jazz, techno, cyberpunk, blues, ambient, disco, fusion,
 * pop-chiptune, and dark-synth. All synthesised via ChiptuneEngine
 * (square, triangle, sawtooth, noise channels — no audio files).
 *
 * Each track loops and is designed to convey motion and action while
 * keeping variety high across runs.
 */
import type { NoteEvent, ChannelOptions } from "./ChiptuneEngine";
import type { MusicTrack } from "./MusicTracks";

// ── Helpers (same as MusicTracks) ────────────────────────────────────────
const bpm = (tempo: number) => 60 / tempo;
const n = (
  note: string,
  beats: number,
  tempo: number,
  vol?: number,
): NoteEvent => ({ note, dur: beats * bpm(tempo), vol });
const rest = (beats: number, tempo: number): NoteEvent => ({
  note: "REST",
  dur: beats * bpm(tempo),
});

// ══════════════════════════════════════════════════════════════════════════
// 1. "Funky Feline Groove" — Funk  (BPM 115, E minor)
//    Syncopated 16th-note melody, slap-bass octaves, tight hi-hats
// ══════════════════════════════════════════════════════════════════════════
const F1 = 115;

const funkyMelody: NoteEvent[] = [
  // Phrase A — syncopated hook
  rest(0.25, F1),
  n("E5", 0.25, F1),
  n("G5", 0.5, F1),
  rest(0.25, F1),
  n("A5", 0.25, F1),
  n("G5", 0.25, F1),
  n("E5", 0.25, F1),
  n("D5", 0.5, F1),
  rest(0.5, F1),
  n("E5", 0.25, F1),
  n("G5", 0.75, F1),

  rest(0.25, F1),
  n("E5", 0.25, F1),
  n("G5", 0.5, F1),
  rest(0.25, F1),
  n("B5", 0.25, F1),
  n("A5", 0.25, F1),
  n("G5", 0.25, F1),
  n("E5", 0.5, F1),
  n("D5", 0.5, F1),
  n("E5", 1, F1),

  // Phrase B — call-and-response feel
  n("B4", 0.25, F1),
  n("D5", 0.25, F1),
  n("E5", 0.5, F1),
  rest(0.5, F1),
  n("G5", 0.5, F1),
  n("A5", 0.25, F1),
  n("G5", 0.25, F1),
  n("E5", 0.5, F1),
  n("D5", 0.25, F1),
  n("B4", 0.75, F1),

  n("B4", 0.25, F1),
  n("D5", 0.25, F1),
  n("E5", 0.25, F1),
  n("G5", 0.25, F1),
  n("A5", 0.5, F1),
  n("B5", 0.5, F1),
  n("A5", 0.25, F1),
  n("G5", 0.25, F1),
  n("E5", 0.5, F1),
  rest(0.5, F1),
  n("D5", 0.25, F1),
  n("E5", 0.75, F1),
];

const funkyBass: NoteEvent[] = [
  // Slap-funk octave bass
  n("E2", 0.25, F1),
  n("E3", 0.25, F1),
  rest(0.25, F1),
  n("E2", 0.25, F1),
  n("G2", 0.5, F1),
  n("A2", 0.25, F1),
  n("G2", 0.25, F1),
  n("E2", 0.25, F1),
  n("E3", 0.25, F1),
  rest(0.25, F1),
  n("D3", 0.25, F1),
  n("E2", 0.5, F1),
  rest(0.5, F1),

  n("E2", 0.25, F1),
  n("E3", 0.25, F1),
  rest(0.25, F1),
  n("E2", 0.25, F1),
  n("G2", 0.5, F1),
  n("B2", 0.25, F1),
  n("A2", 0.25, F1),
  n("G2", 0.25, F1),
  n("E3", 0.25, F1),
  rest(0.25, F1),
  n("D3", 0.25, F1),
  n("E2", 1, F1),

  // Phrase B bass
  n("B2", 0.25, F1),
  n("B3", 0.25, F1),
  rest(0.25, F1),
  n("B2", 0.25, F1),
  n("D3", 0.5, F1),
  n("E3", 0.25, F1),
  n("D3", 0.25, F1),
  n("B2", 0.5, F1),
  rest(0.5, F1),
  n("A2", 0.5, F1),

  n("B2", 0.25, F1),
  n("B3", 0.25, F1),
  rest(0.25, F1),
  n("B2", 0.25, F1),
  n("D3", 0.5, F1),
  n("E3", 0.5, F1),
  n("G2", 0.25, F1),
  n("A2", 0.25, F1),
  n("B2", 0.5, F1),
  rest(0.5, F1),
  n("E2", 0.5, F1),
];

const funkyDrums: NoteEvent[] = [
  ...Array(4)
    .fill(null)
    .flatMap(() => [
      n("C2", 0.25, F1, 1.0),
      n("G5", 0.25, F1, 0.35),
      n("G5", 0.25, F1, 0.25),
      n("E4", 0.25, F1, 0.85),
      n("G5", 0.25, F1, 0.3),
      n("C2", 0.25, F1, 0.6),
      n("E4", 0.25, F1, 0.8),
      n("G5", 0.25, F1, 0.4),
      // bar 2 — extra syncopation
      n("C2", 0.25, F1, 1.0),
      n("G5", 0.25, F1, 0.35),
      n("E4", 0.25, F1, 0.7),
      n("G5", 0.25, F1, 0.3),
      n("G5", 0.25, F1, 0.25),
      n("E4", 0.25, F1, 0.85),
      n("G5", 0.25, F1, 0.4),
      n("G5", 0.25, F1, 0.45),
    ]),
];

export const TRACK_BG_FUNKY: MusicTrack = {
  name: "Funky Feline Groove",
  tempo: F1,
  channels: [
    { options: { type: "square", volume: 0.11 }, notes: funkyMelody },
    { options: { type: "triangle", volume: 0.17 }, notes: funkyBass },
    { options: { type: "noise", volume: 0.055 }, notes: funkyDrums },
  ],
};

// ══════════════════════════════════════════════════════════════════════════
// 2. "Jazz Cat Strut" — Jazz  (BPM 108, C maj / A min)
//    Walking bass, chromatic passing tones, dotted swing feel
// ══════════════════════════════════════════════════════════════════════════
const J1 = 108;

const jazzMelody: NoteEvent[] = [
  // Swing-ish phrasing — dotted 8ths + 16ths approximate swing
  n("C5", 0.75, J1),
  n("D5", 0.25, J1),
  n("E5", 0.75, J1),
  n("G5", 0.25, J1),
  n("A5", 0.5, J1),
  n("G5", 0.5, J1),
  n("F5", 0.75, J1),
  n("E5", 0.25, J1),
  n("D5", 1, J1),
  rest(0.5, J1),

  n("E5", 0.75, J1),
  n("F5", 0.25, J1),
  n("G5", 0.75, J1),
  n("A5", 0.25, J1),
  n("B5", 0.5, J1),
  n("A5", 0.5, J1),
  n("G5", 0.5, J1),
  n("F#5", 0.25, J1),
  n("G5", 0.25, J1),
  n("E5", 1, J1),
  rest(0.5, J1),

  // Bridge — chromatic climb
  n("A4", 0.5, J1),
  n("A#4", 0.5, J1),
  n("B4", 0.5, J1),
  n("C5", 0.5, J1),
  n("D5", 0.75, J1),
  n("E5", 0.25, J1),
  n("F5", 0.5, J1),
  n("E5", 0.5, J1),
  n("D5", 0.75, J1),
  n("C5", 0.25, J1),
  n("B4", 0.5, J1),
  n("C5", 1.5, J1),
  rest(0.5, J1),
];

const jazzBass: NoteEvent[] = [
  // Walking bass
  n("C3", 1, J1),
  n("E3", 1, J1),
  n("G3", 1, J1),
  n("A3", 1, J1),
  n("F3", 1, J1),
  n("E3", 0.5, J1),
  n("D3", 0.5, J1),
  n("G2", 1, J1),
  n("G3", 0.5, J1),
  rest(0.5, J1),

  n("C3", 1, J1),
  n("D3", 1, J1),
  n("E3", 1, J1),
  n("F3", 0.5, J1),
  n("F#3", 0.5, J1),
  n("G3", 1, J1),
  n("A3", 0.5, J1),
  n("G3", 0.5, J1),
  n("C3", 1, J1),
  rest(0.5, J1),

  // Bridge
  n("A2", 1, J1),
  n("A#2", 0.5, J1),
  n("B2", 0.5, J1),
  n("C3", 1, J1),
  n("D3", 1, J1),
  n("F3", 1, J1),
  n("E3", 1, J1),
  n("G2", 1, J1),
  n("C3", 1.5, J1),
  rest(0.5, J1),
];

const jazzHarmony: NoteEvent[] = [
  // Comping chords — soft stabs
  n("E4", 0.5, J1, 0.5),
  rest(0.5, J1),
  n("G4", 0.5, J1, 0.5),
  rest(1, J1),
  n("A4", 0.5, J1, 0.5),
  rest(0.5, J1),
  n("F4", 0.5, J1, 0.5),
  rest(1, J1),
  n("D4", 0.5, J1, 0.5),
  rest(0.5, J1),

  n("E4", 0.5, J1, 0.5),
  rest(0.5, J1),
  n("G4", 0.5, J1, 0.5),
  rest(0.5, J1),
  n("B4", 0.5, J1, 0.5),
  rest(0.5, J1),
  n("A4", 0.5, J1, 0.5),
  rest(0.5, J1),
  n("G4", 0.5, J1, 0.5),
  rest(0.5, J1),
  n("E4", 1, J1, 0.5),
  rest(0.5, J1),

  // Bridge
  n("A3", 0.5, J1, 0.5),
  rest(0.5, J1),
  n("B3", 0.5, J1, 0.5),
  rest(0.5, J1),
  n("C4", 1, J1, 0.5),
  n("D4", 0.5, J1, 0.5),
  rest(0.5, J1),
  n("F4", 0.5, J1, 0.5),
  rest(0.5, J1),
  n("E4", 0.5, J1, 0.5),
  rest(0.5, J1),
  n("C4", 1.5, J1, 0.5),
  rest(0.5, J1),
];

export const TRACK_BG_JAZZ: MusicTrack = {
  name: "Jazz Cat Strut",
  tempo: J1,
  channels: [
    { options: { type: "square", volume: 0.1 }, notes: jazzMelody },
    { options: { type: "square", volume: 0.06 }, notes: jazzHarmony },
    { options: { type: "triangle", volume: 0.15 }, notes: jazzBass },
  ],
};

// ══════════════════════════════════════════════════════════════════════════
// 3. "Neon Highway" — Techno  (BPM 138, A minor)
//    Arpeggiated synth lead, driving 4-on-floor kick, pulsing bass
// ══════════════════════════════════════════════════════════════════════════
const TN = 138;

const technoArp: NoteEvent[] = [
  // Rising arpeggio pattern — 2 bar loop x4
  ...Array(4)
    .fill(null)
    .flatMap(() => [
      n("A4", 0.25, TN),
      n("C5", 0.25, TN),
      n("E5", 0.25, TN),
      n("A5", 0.25, TN),
      n("E5", 0.25, TN),
      n("C5", 0.25, TN),
      n("A4", 0.25, TN),
      n("E4", 0.25, TN),
      // bar 2 — variation
      n("G4", 0.25, TN),
      n("B4", 0.25, TN),
      n("D5", 0.25, TN),
      n("G5", 0.25, TN),
      n("D5", 0.25, TN),
      n("B4", 0.25, TN),
      n("G4", 0.25, TN),
      n("D4", 0.25, TN),
    ]),
];

const technoBass: NoteEvent[] = [
  ...Array(4)
    .fill(null)
    .flatMap(() => [
      n("A2", 0.5, TN),
      n("A2", 0.5, TN),
      n("A2", 0.25, TN),
      n("A3", 0.25, TN),
      n("A2", 0.5, TN),
      // bar 2
      n("G2", 0.5, TN),
      n("G2", 0.5, TN),
      n("G2", 0.25, TN),
      n("G3", 0.25, TN),
      n("G2", 0.5, TN),
    ]),
];

const technoMelody: NoteEvent[] = [
  // Filter-sweep style melody
  n("E5", 1, TN, 0.7),
  n("D5", 0.5, TN, 0.7),
  n("C5", 0.5, TN, 0.7),
  n("A4", 1, TN, 0.7),
  rest(1, TN),
  n("G5", 0.5, TN, 0.7),
  n("E5", 0.5, TN, 0.7),
  n("D5", 1, TN, 0.7),
  n("C5", 1, TN, 0.7),
  rest(1, TN),

  n("A5", 0.5, TN, 0.7),
  n("G5", 0.5, TN, 0.7),
  n("E5", 0.5, TN, 0.7),
  n("D5", 0.5, TN, 0.7),
  n("C5", 1, TN, 0.7),
  n("D5", 0.5, TN, 0.7),
  n("E5", 0.5, TN, 0.7),
  n("A5", 1, TN, 0.7),
  rest(2, TN),
];

const technoDrums: NoteEvent[] = [
  // 4-on-the-floor
  ...Array(8)
    .fill(null)
    .flatMap(() => [
      n("C2", 0.25, TN, 1.0),
      n("G5", 0.25, TN, 0.3),
      n("G5", 0.25, TN, 0.35),
      n("G5", 0.25, TN, 0.3),
      n("C2", 0.25, TN, 0.9),
      n("G5", 0.25, TN, 0.3),
      n("E4", 0.25, TN, 0.8),
      n("G5", 0.25, TN, 0.35),
    ]),
];

export const TRACK_BG_TECHNO: MusicTrack = {
  name: "Neon Highway",
  tempo: TN,
  channels: [
    { options: { type: "square", volume: 0.09 }, notes: technoArp },
    { options: { type: "square", volume: 0.07 }, notes: technoMelody },
    { options: { type: "triangle", volume: 0.18 }, notes: technoBass },
    { options: { type: "noise", volume: 0.06 }, notes: technoDrums },
  ],
};

// ══════════════════════════════════════════════════════════════════════════
// 4. "Cyber Paws" — Cyberpunk  (BPM 142, D minor)
//    Dark sawtooth lead, tritone intervals, aggressive bass, fast drums
// ══════════════════════════════════════════════════════════════════════════
const CP = 142;

const cyberMelody: NoteEvent[] = [
  // Dark aggressive riff with tritone tension
  n("D5", 0.25, CP),
  n("F5", 0.25, CP),
  n("G#5", 0.5, CP), // tritone from D
  n("A5", 0.25, CP),
  n("G#5", 0.25, CP),
  n("F5", 0.5, CP),
  n("D5", 0.5, CP),
  rest(0.25, CP),
  n("C5", 0.25, CP),
  n("D5", 0.75, CP),

  n("D5", 0.25, CP),
  n("F5", 0.25, CP),
  n("A5", 0.5, CP),
  n("A#5", 0.25, CP),
  n("A5", 0.25, CP),
  n("F5", 0.25, CP),
  n("D5", 0.25, CP),
  n("C5", 0.5, CP),
  n("D5", 0.5, CP),
  n("F5", 1, CP),

  // Descending chromatic stab
  n("A5", 0.25, CP),
  n("G#5", 0.25, CP),
  n("G5", 0.25, CP),
  n("F5", 0.25, CP),
  n("E5", 0.25, CP),
  n("D5", 0.25, CP),
  n("C5", 0.25, CP),
  n("A#4", 0.25, CP),
  n("A4", 0.5, CP),
  n("D5", 1.5, CP),
  rest(0.5, CP),
];

const cyberBass: NoteEvent[] = [
  // Heavy pumping bass with tritone movement
  n("D2", 0.5, CP),
  n("D3", 0.25, CP),
  n("D2", 0.25, CP),
  n("D2", 0.5, CP),
  n("G#2", 0.5, CP), // tritone
  n("D2", 0.5, CP),
  n("D3", 0.25, CP),
  n("C3", 0.25, CP),
  n("D2", 0.5, CP),
  rest(0.5, CP),

  n("D2", 0.5, CP),
  n("D3", 0.25, CP),
  n("D2", 0.25, CP),
  n("F2", 0.5, CP),
  n("A#2", 0.5, CP),
  n("A2", 0.5, CP),
  n("F2", 0.25, CP),
  n("D2", 0.25, CP),
  n("D2", 0.5, CP),
  n("D3", 0.5, CP),

  // Resolving phrase
  n("A2", 0.5, CP),
  n("G#2", 0.5, CP),
  n("G2", 0.5, CP),
  n("F2", 0.5, CP),
  n("D2", 0.5, CP),
  n("D3", 0.5, CP),
  n("D2", 1.5, CP),
  rest(0.5, CP),
];

const cyberDrums: NoteEvent[] = [
  // Fast aggressive drums
  ...Array(4)
    .fill(null)
    .flatMap(() => [
      n("C2", 0.25, CP, 1.0),
      n("G5", 0.25, CP, 0.4),
      n("E4", 0.25, CP, 0.9),
      n("G5", 0.25, CP, 0.35),
      n("C2", 0.25, CP, 0.7),
      n("G5", 0.25, CP, 0.4),
      n("E4", 0.25, CP, 0.85),
      n("G5", 0.25, CP, 0.45),
      // bar 2 — double-kick feel
      n("C2", 0.25, CP, 1.0),
      n("C2", 0.25, CP, 0.8),
      n("E4", 0.25, CP, 0.9),
      n("G5", 0.25, CP, 0.4),
      n("C2", 0.25, CP, 0.7),
      n("E4", 0.25, CP, 0.85),
      n("G5", 0.25, CP, 0.35),
      n("G5", 0.25, CP, 0.5),
    ]),
];

export const TRACK_BG_CYBER: MusicTrack = {
  name: "Cyber Paws",
  tempo: CP,
  channels: [
    { options: { type: "sawtooth", volume: 0.09 }, notes: cyberMelody },
    { options: { type: "triangle", volume: 0.19 }, notes: cyberBass },
    { options: { type: "noise", volume: 0.065 }, notes: cyberDrums },
  ],
};

// ══════════════════════════════════════════════════════════════════════════
// 5. "Alley Blues" — Blues  (BPM 88, E blues)
//    12-bar blues form, blue-note bends approximated, shuffle feel
// ══════════════════════════════════════════════════════════════════════════
const BL = 88;

const bluesMelody: NoteEvent[] = [
  // I chord (E7) — bars 1-4
  n("E4", 0.75, BL),
  n("G4", 0.25, BL),
  n("A4", 0.5, BL),
  n("A#4", 0.25, BL), // blue note
  n("B4", 0.75, BL),
  n("G4", 0.5, BL),
  n("E4", 1, BL),
  rest(0.5, BL),

  n("E4", 0.5, BL),
  n("G4", 0.5, BL),
  n("B4", 0.75, BL),
  n("A4", 0.25, BL),
  n("G4", 0.5, BL),
  n("E4", 0.5, BL),
  n("D4", 0.5, BL),
  n("E4", 1.5, BL),

  // IV chord (A7) — bars 5-6
  n("A4", 0.75, BL),
  n("C5", 0.25, BL),
  n("D5", 0.5, BL),
  n("D#5", 0.25, BL), // blue note
  n("E5", 0.75, BL),
  n("C5", 0.5, BL),
  n("A4", 1, BL),
  rest(0.5, BL),

  // Back to I (E7) — bars 7-8
  n("E4", 0.75, BL),
  n("G4", 0.25, BL),
  n("B4", 1, BL),
  n("A4", 0.5, BL),
  n("G4", 0.5, BL),
  n("E4", 1.5, BL),
  rest(0.5, BL),

  // V-IV-I turnaround — bars 9-12
  n("B4", 0.75, BL),
  n("D5", 0.25, BL),
  n("E5", 1, BL),
  n("D5", 0.5, BL),
  n("B4", 0.75, BL),

  n("A4", 0.75, BL),
  n("G4", 0.25, BL),
  n("E4", 1, BL),
  n("D4", 0.5, BL),
  n("E4", 1.5, BL),
  rest(0.5, BL),
];

const bluesBass: NoteEvent[] = [
  // Shuffle walking bass — I chord
  n("E2", 0.75, BL),
  n("G2", 0.25, BL),
  n("A2", 0.75, BL),
  n("G2", 0.25, BL),
  n("E2", 0.75, BL),
  n("G2", 0.25, BL),
  n("B2", 0.75, BL),
  n("G2", 0.25, BL),

  n("E2", 0.75, BL),
  n("G2", 0.25, BL),
  n("A2", 0.75, BL),
  n("A#2", 0.25, BL),
  n("B2", 0.75, BL),
  n("A2", 0.25, BL),
  n("G2", 0.75, BL),
  n("E2", 0.25, BL),

  // IV chord
  n("A2", 0.75, BL),
  n("C3", 0.25, BL),
  n("D3", 0.75, BL),
  n("C3", 0.25, BL),
  n("A2", 0.75, BL),
  n("C3", 0.25, BL),
  n("E3", 0.75, BL),
  n("D3", 0.25, BL),

  // Back to I
  n("E2", 0.75, BL),
  n("G2", 0.25, BL),
  n("A2", 0.75, BL),
  n("G2", 0.25, BL),
  n("E2", 0.75, BL),
  n("B2", 0.25, BL),
  n("E2", 1, BL),
  rest(0.5, BL),

  // Turnaround
  n("B2", 0.75, BL),
  n("D3", 0.25, BL),
  n("B2", 0.75, BL),
  n("A2", 0.25, BL),

  n("A2", 0.75, BL),
  n("G2", 0.25, BL),
  n("E2", 0.75, BL),
  n("B2", 0.25, BL),
  n("E2", 1, BL),
  rest(0.5, BL),
];

const bluesDrums: NoteEvent[] = [
  // Shuffle pattern
  ...Array(6)
    .fill(null)
    .flatMap(() => [
      n("C2", 0.5, BL, 0.9),
      n("G5", 0.25, BL, 0.3),
      n("G5", 0.25, BL, 0.2),
      n("E4", 0.5, BL, 0.7),
      n("G5", 0.25, BL, 0.3),
      n("G5", 0.25, BL, 0.35),
    ]),
];

export const TRACK_BG_BLUES: MusicTrack = {
  name: "Alley Blues",
  tempo: BL,
  channels: [
    { options: { type: "square", volume: 0.1 }, notes: bluesMelody },
    { options: { type: "triangle", volume: 0.16 }, notes: bluesBass },
    { options: { type: "noise", volume: 0.05 }, notes: bluesDrums },
  ],
};

// ══════════════════════════════════════════════════════════════════════════
// 6. "Ambient Rooftops" — Ambient  (BPM 68, C major)
//    Long sustained pads, gentle arpeggios, no drums, dreamy
// ══════════════════════════════════════════════════════════════════════════
const AM = 68;

const ambientPad: NoteEvent[] = [
  // Long sustained notes — pad feel
  n("C4", 4, AM, 0.5),
  n("E4", 4, AM, 0.5),
  n("G4", 4, AM, 0.5),
  n("F4", 4, AM, 0.5),
  n("A4", 4, AM, 0.5),
  n("E4", 4, AM, 0.5),
  n("D4", 4, AM, 0.5),
  n("G4", 4, AM, 0.5),
  n("C4", 4, AM, 0.5),
];

const ambientArp: NoteEvent[] = [
  // Gentle rising arpeggio
  n("C5", 1, AM, 0.4),
  n("E5", 1, AM, 0.35),
  n("G5", 1, AM, 0.3),
  n("C6", 1, AM, 0.25),
  rest(1, AM),
  n("F5", 1, AM, 0.4),
  n("A5", 1, AM, 0.35),
  n("C6", 1, AM, 0.3),
  rest(1, AM),
  n("G5", 1, AM, 0.4),
  n("B5", 1, AM, 0.35),
  n("D6", 1, AM, 0.3),
  rest(1, AM),
  n("A4", 1, AM, 0.4),
  n("C5", 1, AM, 0.35),
  n("E5", 1, AM, 0.3),
  rest(1, AM),
  n("D5", 1, AM, 0.4),
  n("F5", 1, AM, 0.35),
  n("A5", 1, AM, 0.3),
  rest(1, AM),
  n("G4", 1, AM, 0.4),
  n("B4", 1, AM, 0.35),
  n("D5", 1, AM, 0.3),
  rest(1, AM),
  n("C5", 2, AM, 0.4),
  n("E5", 2, AM, 0.35),
  n("G5", 2, AM, 0.3),
  rest(2, AM),
];

const ambientBass: NoteEvent[] = [
  n("C2", 4, AM),
  n("C2", 4, AM),
  n("F2", 4, AM),
  n("F2", 4, AM),
  n("G2", 4, AM),
  n("G2", 4, AM),
  n("A2", 4, AM),
  n("G2", 4, AM),
  n("C2", 4, AM),
];

export const TRACK_BG_AMBIENT: MusicTrack = {
  name: "Ambient Rooftops",
  tempo: AM,
  channels: [
    { options: { type: "triangle", volume: 0.1 }, notes: ambientPad },
    { options: { type: "square", volume: 0.06 }, notes: ambientArp },
    { options: { type: "triangle", volume: 0.12 }, notes: ambientBass },
  ],
};

// ══════════════════════════════════════════════════════════════════════════
// 7. "Disco Whiskers" — Disco / Funk  (BPM 124, G major)
//    Octave bass, bright melody, steady open hi-hats
// ══════════════════════════════════════════════════════════════════════════
const DS = 124;

const discoMelody: NoteEvent[] = [
  // Catchy disco hook
  n("G5", 0.5, DS),
  n("A5", 0.5, DS),
  n("B5", 0.5, DS),
  n("D6", 0.5, DS),
  n("B5", 0.5, DS),
  n("A5", 0.25, DS),
  n("G5", 0.25, DS),
  n("A5", 1, DS),
  rest(0.5, DS),

  n("B5", 0.5, DS),
  n("A5", 0.5, DS),
  n("G5", 0.5, DS),
  n("F#5", 0.25, DS),
  n("G5", 0.25, DS),
  n("A5", 0.5, DS),
  n("B5", 0.5, DS),
  n("G5", 1, DS),
  rest(0.5, DS),

  // Second phrase — higher energy
  n("D5", 0.25, DS),
  n("G5", 0.25, DS),
  n("A5", 0.25, DS),
  n("B5", 0.25, DS),
  n("D6", 0.5, DS),
  n("E6", 0.5, DS),
  n("D6", 0.25, DS),
  n("B5", 0.25, DS),
  n("A5", 0.5, DS),
  n("G5", 0.5, DS),
  n("B5", 1, DS),
  rest(0.5, DS),

  n("D6", 0.5, DS),
  n("B5", 0.5, DS),
  n("G5", 0.5, DS),
  n("A5", 0.5, DS),
  n("B5", 0.75, DS),
  n("A5", 0.25, DS),
  n("G5", 1, DS),
  rest(1, DS),
];

const discoBass: NoteEvent[] = [
  // Disco octave bass — G major
  ...Array(2)
    .fill(null)
    .flatMap(() => [
      n("G2", 0.5, DS),
      n("G3", 0.5, DS),
      n("G2", 0.5, DS),
      n("G3", 0.5, DS),
      n("B2", 0.5, DS),
      n("B3", 0.5, DS),
      n("D3", 0.5, DS),
      n("D3", 0.5, DS),
      // bar 2
      n("C3", 0.5, DS),
      n("C3", 0.5, DS),
      n("D3", 0.5, DS),
      n("D3", 0.5, DS),
      n("G2", 0.5, DS),
      n("G3", 0.5, DS),
      n("G2", 0.5, DS),
      n("D3", 0.5, DS),
    ]),
];

const discoDrums: NoteEvent[] = [
  // Four-on-the-floor with open hi-hats
  ...Array(4)
    .fill(null)
    .flatMap(() => [
      n("C2", 0.25, DS, 1.0),
      n("G5", 0.25, DS, 0.4),
      n("G5", 0.25, DS, 0.3),
      n("G5", 0.25, DS, 0.4),
      n("E4", 0.25, DS, 0.8),
      n("G5", 0.25, DS, 0.4),
      n("G5", 0.25, DS, 0.3),
      n("G5", 0.25, DS, 0.4),
      // bar 2
      n("C2", 0.25, DS, 1.0),
      n("G5", 0.25, DS, 0.4),
      n("G5", 0.25, DS, 0.3),
      n("E4", 0.25, DS, 0.75),
      n("G5", 0.25, DS, 0.4),
      n("C2", 0.25, DS, 0.7),
      n("E4", 0.25, DS, 0.8),
      n("G5", 0.25, DS, 0.45),
    ]),
];

export const TRACK_BG_DISCO: MusicTrack = {
  name: "Disco Whiskers",
  tempo: DS,
  channels: [
    { options: { type: "square", volume: 0.1 }, notes: discoMelody },
    { options: { type: "triangle", volume: 0.17 }, notes: discoBass },
    { options: { type: "noise", volume: 0.055 }, notes: discoDrums },
  ],
};

// ══════════════════════════════════════════════════════════════════════════
// 8. "Midnight Chase" — Jazz-Fusion  (BPM 155, B minor)
//    Fast, energetic, complex rhythms, driving intensity
// ══════════════════════════════════════════════════════════════════════════
const MC = 155;

const fusionMelody: NoteEvent[] = [
  // Fast angular melody
  n("B5", 0.25, MC),
  n("D6", 0.25, MC),
  n("F#5", 0.5, MC),
  n("A5", 0.25, MC),
  n("B5", 0.25, MC),
  n("G5", 0.5, MC),
  n("F#5", 0.25, MC),
  n("E5", 0.25, MC),
  n("D5", 0.5, MC),
  n("B4", 0.5, MC),
  n("D5", 0.5, MC),

  n("E5", 0.25, MC),
  n("F#5", 0.25, MC),
  n("A5", 0.5, MC),
  n("B5", 0.25, MC),
  n("A5", 0.25, MC),
  n("G5", 0.5, MC),
  n("F#5", 0.5, MC),
  n("E5", 0.5, MC),
  n("D5", 0.25, MC),
  n("B4", 0.75, MC),
  rest(0.5, MC),

  // Ascending burst
  n("B4", 0.25, MC),
  n("D5", 0.25, MC),
  n("E5", 0.25, MC),
  n("F#5", 0.25, MC),
  n("A5", 0.25, MC),
  n("B5", 0.25, MC),
  n("D6", 0.25, MC),
  n("E6", 0.25, MC),
  n("D6", 0.5, MC),
  n("B5", 0.5, MC),
  n("A5", 0.5, MC),
  n("F#5", 0.5, MC),
  n("B4", 1, MC),
  rest(0.5, MC),
];

const fusionBass: NoteEvent[] = [
  // Driving fusion bass
  n("B2", 0.5, MC),
  n("D3", 0.5, MC),
  n("B2", 0.5, MC),
  n("F#3", 0.5, MC),
  n("G2", 0.5, MC),
  n("A2", 0.5, MC),
  n("B2", 0.5, MC),
  n("D3", 0.5, MC),

  n("E2", 0.5, MC),
  n("E3", 0.5, MC),
  n("F#2", 0.5, MC),
  n("F#3", 0.5, MC),
  n("G2", 0.5, MC),
  n("A2", 0.25, MC),
  n("B2", 0.25, MC),
  n("D3", 0.5, MC),
  rest(0.5, MC),

  n("B2", 0.5, MC),
  n("B3", 0.5, MC),
  n("A2", 0.5, MC),
  n("G2", 0.5, MC),
  n("F#2", 0.5, MC),
  n("E2", 0.5, MC),
  n("D2", 0.5, MC),
  n("B2", 1, MC),
  rest(0.5, MC),
];

const fusionDrums: NoteEvent[] = [
  // Fast jazz-fusion drums
  ...Array(4)
    .fill(null)
    .flatMap(() => [
      n("C2", 0.25, MC, 0.9),
      n("G5", 0.25, MC, 0.35),
      n("G5", 0.25, MC, 0.25),
      n("E4", 0.25, MC, 0.8),
      n("G5", 0.25, MC, 0.3),
      n("G5", 0.25, MC, 0.35),
      n("C2", 0.25, MC, 0.7),
      n("G5", 0.25, MC, 0.3),
      // bar 2
      n("E4", 0.25, MC, 0.85),
      n("G5", 0.25, MC, 0.3),
      n("C2", 0.25, MC, 0.6),
      n("G5", 0.25, MC, 0.3),
      n("E4", 0.25, MC, 0.75),
      n("G5", 0.25, MC, 0.4),
      n("G5", 0.25, MC, 0.35),
      n("G5", 0.25, MC, 0.45),
    ]),
];

export const TRACK_BG_FUSION: MusicTrack = {
  name: "Midnight Chase",
  tempo: MC,
  channels: [
    { options: { type: "square", volume: 0.11 }, notes: fusionMelody },
    { options: { type: "triangle", volume: 0.18 }, notes: fusionBass },
    { options: { type: "noise", volume: 0.06 }, notes: fusionDrums },
  ],
};

// ══════════════════════════════════════════════════════════════════════════
// 9. "Pixel Sunset" — Upbeat Pop-Chiptune  (BPM 128, D major)
//    Bright, catchy, feel-good energy, major-key
// ══════════════════════════════════════════════════════════════════════════
const PS = 128;

const popMelody: NoteEvent[] = [
  n("D5", 0.5, PS),
  n("F#5", 0.5, PS),
  n("A5", 0.5, PS),
  n("B5", 0.5, PS),
  n("A5", 0.5, PS),
  n("F#5", 0.5, PS),
  n("D5", 0.5, PS),
  n("E5", 0.5, PS),
  n("F#5", 1, PS),
  rest(0.5, PS),

  n("G5", 0.5, PS),
  n("A5", 0.5, PS),
  n("B5", 0.5, PS),
  n("D6", 0.5, PS),
  n("B5", 0.5, PS),
  n("A5", 0.5, PS),
  n("G5", 0.5, PS),
  n("F#5", 0.5, PS),
  n("E5", 0.5, PS),
  n("D5", 1.5, PS),
  rest(0.5, PS),

  // Chorus feel
  n("A5", 0.5, PS),
  n("B5", 0.5, PS),
  n("D6", 1, PS),
  n("B5", 0.5, PS),
  n("A5", 0.5, PS),
  n("F#5", 0.5, PS),
  n("E5", 0.5, PS),
  n("D5", 1, PS),
  rest(0.5, PS),

  n("F#5", 0.5, PS),
  n("A5", 0.5, PS),
  n("B5", 0.5, PS),
  n("A5", 0.5, PS),
  n("G5", 0.5, PS),
  n("F#5", 0.5, PS),
  n("E5", 0.5, PS),
  n("D5", 1.5, PS),
  rest(0.5, PS),
];

const popHarmony: NoteEvent[] = [
  // Major triad arpeggios underneath
  n("A4", 1, PS, 0.5),
  n("F#4", 1, PS, 0.5),
  n("D4", 1, PS, 0.5),
  n("E4", 1, PS, 0.5),
  n("D4", 1, PS, 0.5),
  rest(0.5, PS),

  n("B4", 1, PS, 0.5),
  n("A4", 1, PS, 0.5),
  n("G4", 1, PS, 0.5),
  n("F#4", 1, PS, 0.5),
  n("E4", 0.5, PS, 0.5),
  n("D4", 1.5, PS, 0.5),
  rest(0.5, PS),

  n("D4", 1, PS, 0.5),
  n("G4", 1, PS, 0.5),
  n("A4", 1, PS, 0.5),
  n("D4", 1, PS, 0.5),
  rest(0.5, PS),

  n("A4", 1, PS, 0.5),
  n("G4", 0.5, PS, 0.5),
  n("F#4", 0.5, PS, 0.5),
  n("E4", 0.5, PS, 0.5),
  n("D4", 1.5, PS, 0.5),
  rest(0.5, PS),
];

const popBass: NoteEvent[] = [
  n("D3", 1, PS),
  n("D3", 1, PS),
  n("A2", 1, PS),
  n("A2", 1, PS),
  n("D3", 0.5, PS),
  n("E3", 0.5, PS),
  rest(0.5, PS),

  n("G2", 1, PS),
  n("G2", 1, PS),
  n("D3", 1, PS),
  n("A2", 1, PS),
  n("G2", 0.5, PS),
  n("D3", 1.5, PS),
  rest(0.5, PS),

  n("D3", 1, PS),
  n("G2", 1, PS),
  n("A2", 1, PS),
  n("D3", 1, PS),
  rest(0.5, PS),

  n("A2", 1, PS),
  n("G2", 1, PS),
  n("E2", 0.5, PS),
  n("D2", 1.5, PS),
  rest(0.5, PS),
];

const popDrums: NoteEvent[] = [
  ...Array(4)
    .fill(null)
    .flatMap(() => [
      n("C2", 0.25, PS, 0.9),
      n("G5", 0.25, PS, 0.35),
      n("G5", 0.25, PS, 0.3),
      n("G5", 0.25, PS, 0.35),
      n("E4", 0.25, PS, 0.8),
      n("G5", 0.25, PS, 0.35),
      n("G5", 0.25, PS, 0.3),
      n("G5", 0.25, PS, 0.35),
      // bar 2
      n("C2", 0.25, PS, 0.9),
      n("G5", 0.25, PS, 0.35),
      n("E4", 0.25, PS, 0.7),
      n("G5", 0.25, PS, 0.3),
      n("C2", 0.25, PS, 0.6),
      n("G5", 0.25, PS, 0.35),
      n("E4", 0.25, PS, 0.8),
      n("G5", 0.25, PS, 0.4),
    ]),
];

export const TRACK_BG_POP: MusicTrack = {
  name: "Pixel Sunset",
  tempo: PS,
  channels: [
    { options: { type: "square", volume: 0.1 }, notes: popMelody },
    { options: { type: "square", volume: 0.06 }, notes: popHarmony },
    { options: { type: "triangle", volume: 0.16 }, notes: popBass },
    { options: { type: "noise", volume: 0.05 }, notes: popDrums },
  ],
};

// ══════════════════════════════════════════════════════════════════════════
// 10. "Synth City" — Dark Synth / Cyberpunk  (BPM 136, F minor)
//    Pulsing bass, minor-key arpeggios, ominous atmosphere
// ══════════════════════════════════════════════════════════════════════════
const SC = 136;

const synthMelody: NoteEvent[] = [
  // Ominous minor-key lead
  n("F5", 1, SC, 0.7),
  n("G#5", 0.5, SC, 0.7),
  n("A#5", 0.5, SC, 0.7),
  n("C6", 0.5, SC, 0.7),
  n("A#5", 0.5, SC, 0.7),
  n("G#5", 0.5, SC, 0.7),
  n("F5", 0.5, SC, 0.7),
  n("D#5", 1, SC, 0.7),
  rest(0.5, SC),

  n("C5", 0.5, SC, 0.7),
  n("D#5", 0.5, SC, 0.7),
  n("F5", 0.5, SC, 0.7),
  n("G#5", 1, SC, 0.7),
  n("F5", 0.5, SC, 0.7),
  n("D#5", 0.5, SC, 0.7),
  n("C5", 1, SC, 0.7),
  rest(1, SC),

  // Rising tension
  n("F5", 0.25, SC, 0.7),
  n("G5", 0.25, SC, 0.7),
  n("G#5", 0.25, SC, 0.7),
  n("A#5", 0.25, SC, 0.7),
  n("C6", 0.5, SC, 0.7),
  n("D#6", 0.5, SC, 0.7),
  n("C6", 0.5, SC, 0.7),
  n("A#5", 0.5, SC, 0.7),
  n("G#5", 0.5, SC, 0.7),
  n("F5", 1, SC, 0.7),
  rest(1, SC),
];

const synthArp: NoteEvent[] = [
  // Minor arpeggio pulse
  ...Array(4)
    .fill(null)
    .flatMap(() => [
      n("F4", 0.25, SC, 0.4),
      n("G#4", 0.25, SC, 0.35),
      n("C5", 0.25, SC, 0.3),
      n("G#4", 0.25, SC, 0.35),
      n("F4", 0.25, SC, 0.4),
      n("C4", 0.25, SC, 0.35),
      n("D#4", 0.25, SC, 0.3),
      n("C4", 0.25, SC, 0.35),
      // bar 2 variation
      n("D#4", 0.25, SC, 0.4),
      n("G4", 0.25, SC, 0.35),
      n("A#4", 0.25, SC, 0.3),
      n("G4", 0.25, SC, 0.35),
      n("D#4", 0.25, SC, 0.4),
      n("C4", 0.25, SC, 0.35),
      n("D#4", 0.25, SC, 0.3),
      n("C4", 0.25, SC, 0.35),
    ]),
];

const synthBass: NoteEvent[] = [
  // Heavy pulsing bass
  ...Array(2)
    .fill(null)
    .flatMap(() => [
      n("F2", 0.5, SC),
      n("F2", 0.5, SC),
      n("F2", 0.25, SC),
      n("F3", 0.25, SC),
      n("F2", 0.5, SC),
      n("D#2", 0.5, SC),
      n("D#2", 0.5, SC),
      n("D#2", 0.25, SC),
      n("D#3", 0.25, SC),
      n("D#2", 0.5, SC),
      // bars 3-4
      n("G#2", 0.5, SC),
      n("G#2", 0.5, SC),
      n("G#2", 0.25, SC),
      n("G#3", 0.25, SC),
      n("C3", 0.5, SC),
      n("A#2", 0.5, SC),
      n("G#2", 0.5, SC),
      n("F2", 0.25, SC),
      n("F3", 0.25, SC),
      n("F2", 0.5, SC),
    ]),
];

const synthDrums: NoteEvent[] = [
  // Industrial pulse
  ...Array(4)
    .fill(null)
    .flatMap(() => [
      n("C2", 0.25, SC, 1.0),
      n("G5", 0.25, SC, 0.3),
      n("G5", 0.25, SC, 0.25),
      n("E4", 0.25, SC, 0.85),
      n("C2", 0.25, SC, 0.8),
      n("G5", 0.25, SC, 0.3),
      n("E4", 0.25, SC, 0.75),
      n("G5", 0.25, SC, 0.4),
      // bar 2
      n("C2", 0.25, SC, 1.0),
      n("G5", 0.25, SC, 0.3),
      n("E4", 0.25, SC, 0.8),
      n("C2", 0.25, SC, 0.6),
      n("G5", 0.25, SC, 0.3),
      n("E4", 0.25, SC, 0.85),
      n("G5", 0.25, SC, 0.35),
      n("G5", 0.25, SC, 0.5),
    ]),
];

export const TRACK_BG_SYNTH: MusicTrack = {
  name: "Synth City",
  tempo: SC,
  channels: [
    { options: { type: "sawtooth", volume: 0.08 }, notes: synthMelody },
    { options: { type: "square", volume: 0.05 }, notes: synthArp },
    { options: { type: "triangle", volume: 0.18 }, notes: synthBass },
    { options: { type: "noise", volume: 0.06 }, notes: synthDrums },
  ],
};

// ── Export all BG tracks as an array for random selection ─────────────────

export const BG_TRACK_LIST: MusicTrack[] = [
  TRACK_BG_FUNKY,
  TRACK_BG_JAZZ,
  TRACK_BG_TECHNO,
  TRACK_BG_CYBER,
  TRACK_BG_BLUES,
  TRACK_BG_AMBIENT,
  TRACK_BG_DISCO,
  TRACK_BG_FUSION,
  TRACK_BG_POP,
  TRACK_BG_SYNTH,
];

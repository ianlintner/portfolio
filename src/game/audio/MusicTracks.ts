/**
 * MusicTracks — Chiptune compositions for the Cat Adventure game.
 *
 * Inspired by Mega Man 1's Bomb Man stage: driving tempo, catchy melodies
 * on square waves, punchy triangle bass, and rhythmic noise percussion.
 *
 * All tracks are defined as arrays of NoteEvents per channel so the
 * ChiptuneEngine can play them entirely from Web Audio (no .mp3 files).
 */
import type { NoteEvent, ChannelOptions } from "./ChiptuneEngine";

// ── Helpers ──────────────────────────────────────────────────────────────

/** Shorthand: sixteenth note at given BPM. */
const bpm = (tempo: number) => 60 / tempo;
const n = (
  note: string,
  beats: number,
  tempo: number,
  vol?: number,
): NoteEvent => ({
  note,
  dur: beats * bpm(tempo),
  vol,
});
const rest = (beats: number, tempo: number): NoteEvent => ({
  note: "REST",
  dur: beats * bpm(tempo),
});

// ── Track definition type ────────────────────────────────────────────────

export interface MusicTrack {
  name: string;
  tempo: number;
  channels: {
    options: ChannelOptions;
    notes: NoteEvent[];
  }[];
}

// ──────────────────────────────────────────────────────────────────────────
// TRACK 1: "Alley Cat Assault" — Main action theme (Bomb Man vibe)
// BPM: ~150, Key of E minor, driving energy
// ──────────────────────────────────────────────────────────────────────────

const T1 = 150; // BPM

const actionMelody: NoteEvent[] = [
  // Phrase A — catchy hook (8 bars, square wave lead)
  n("E5", 0.5, T1),
  n("E5", 0.5, T1),
  n("G5", 0.5, T1),
  n("A5", 0.5, T1),
  n("B5", 1, T1),
  n("A5", 0.5, T1),
  n("G5", 0.5, T1),
  n("E5", 1, T1),
  n("D5", 0.5, T1),
  n("E5", 0.5, T1),
  n("G5", 1, T1),
  n("E5", 1, T1),

  n("E5", 0.5, T1),
  n("E5", 0.5, T1),
  n("G5", 0.5, T1),
  n("A5", 0.5, T1),
  n("B5", 1, T1),
  n("D6", 0.5, T1),
  n("B5", 0.5, T1),
  n("A5", 1, T1),
  n("G5", 0.5, T1),
  n("A5", 0.5, T1),
  n("B5", 1.5, T1),
  rest(0.5, T1),

  // Phrase B — ascending run
  n("B4", 0.5, T1),
  n("D5", 0.5, T1),
  n("E5", 0.5, T1),
  n("G5", 0.5, T1),
  n("A5", 1, T1),
  n("B5", 1, T1),
  n("A5", 0.5, T1),
  n("G5", 0.5, T1),
  n("E5", 0.5, T1),
  n("D5", 0.5, T1),
  n("E5", 2, T1),

  n("B4", 0.5, T1),
  n("D5", 0.5, T1),
  n("E5", 0.5, T1),
  n("G5", 0.5, T1),
  n("A5", 0.5, T1),
  n("B5", 0.5, T1),
  n("D6", 0.5, T1),
  n("E6", 0.5, T1),
  n("D6", 1, T1),
  n("B5", 1, T1),
  n("A5", 1, T1),
  rest(1, T1),
];

const actionBass: NoteEvent[] = [
  // Driving bass groove — 8th-note pulse
  // E minor
  n("E2", 0.5, T1),
  n("E3", 0.5, T1),
  n("E2", 0.5, T1),
  n("E3", 0.5, T1),
  n("E2", 0.5, T1),
  n("E3", 0.5, T1),
  n("E2", 0.5, T1),
  n("E3", 0.5, T1),
  n("G2", 0.5, T1),
  n("G3", 0.5, T1),
  n("G2", 0.5, T1),
  n("G3", 0.5, T1),
  n("A2", 0.5, T1),
  n("A3", 0.5, T1),
  n("A2", 0.5, T1),
  n("A3", 0.5, T1),

  n("E2", 0.5, T1),
  n("E3", 0.5, T1),
  n("E2", 0.5, T1),
  n("E3", 0.5, T1),
  n("E2", 0.5, T1),
  n("E3", 0.5, T1),
  n("E2", 0.5, T1),
  n("E3", 0.5, T1),
  n("B2", 0.5, T1),
  n("B3", 0.5, T1),
  n("B2", 0.5, T1),
  n("B3", 0.5, T1),
  n("D3", 0.5, T1),
  n("D3", 0.5, T1),
  n("E3", 0.5, T1),
  n("E3", 0.5, T1),

  // Phrase B bass
  n("B2", 0.5, T1),
  n("B3", 0.5, T1),
  n("B2", 0.5, T1),
  n("B3", 0.5, T1),
  n("A2", 0.5, T1),
  n("A3", 0.5, T1),
  n("A2", 0.5, T1),
  n("A3", 0.5, T1),
  n("G2", 0.5, T1),
  n("G3", 0.5, T1),
  n("G2", 0.5, T1),
  n("G3", 0.5, T1),
  n("E2", 1, T1),
  n("E2", 1, T1),

  n("B2", 0.5, T1),
  n("B3", 0.5, T1),
  n("B2", 0.5, T1),
  n("B3", 0.5, T1),
  n("A2", 0.5, T1),
  n("A3", 0.5, T1),
  n("G2", 0.5, T1),
  n("A3", 0.5, T1),
  n("D3", 0.5, T1),
  n("D3", 0.5, T1),
  n("E3", 0.5, T1),
  n("E3", 0.5, T1),
  n("E2", 1, T1),
  rest(1, T1),
];

const actionHarmony: NoteEvent[] = [
  // Counter-melody, slightly quieter square wave
  n("B4", 1, T1, 0.6),
  n("B4", 1, T1, 0.6),
  n("D5", 1, T1, 0.6),
  n("E5", 1, T1, 0.6),
  n("B4", 1, T1, 0.6),
  n("A4", 0.5, T1, 0.6),
  n("B4", 0.5, T1, 0.6),
  n("D5", 1, T1, 0.6),
  n("B4", 1, T1, 0.6),

  n("B4", 1, T1, 0.6),
  n("B4", 1, T1, 0.6),
  n("D5", 1, T1, 0.6),
  n("G5", 1, T1, 0.6),
  n("E5", 1, T1, 0.6),
  n("D5", 0.5, T1, 0.6),
  n("E5", 0.5, T1, 0.6),
  n("G5", 1.5, T1, 0.6),
  rest(0.5, T1),

  // Phrase B harmony
  n("G4", 1, T1, 0.6),
  n("B4", 1, T1, 0.6),
  n("E5", 1, T1, 0.6),
  n("D5", 1, T1, 0.6),
  n("E5", 0.5, T1, 0.6),
  n("D5", 0.5, T1, 0.6),
  n("B4", 0.5, T1, 0.6),
  n("A4", 0.5, T1, 0.6),
  n("B4", 2, T1, 0.6),

  n("G4", 1, T1, 0.6),
  n("B4", 1, T1, 0.6),
  n("E5", 0.5, T1, 0.6),
  n("D5", 0.5, T1, 0.6),
  n("G5", 0.5, T1, 0.6),
  n("B5", 0.5, T1, 0.6),
  n("A5", 1, T1, 0.6),
  n("G5", 1, T1, 0.6),
  n("E5", 1, T1, 0.6),
  rest(1, T1),
];

const actionDrums: NoteEvent[] = [
  // 4/4 pattern, 2 bars repeated 4x. Noise channel.
  // Kick-like on 1 & 3, snare-like on 2 & 4, hi-hat 8ths
  ...Array(4)
    .fill(null)
    .flatMap(() => [
      n("C2", 0.25, T1, 1.0),
      n("G5", 0.25, T1, 0.3),
      n("G5", 0.25, T1, 0.3),
      n("G5", 0.25, T1, 0.3),
      n("E4", 0.25, T1, 0.8),
      n("G5", 0.25, T1, 0.3),
      n("G5", 0.25, T1, 0.3),
      n("G5", 0.25, T1, 0.3),

      n("C2", 0.25, T1, 1.0),
      n("G5", 0.25, T1, 0.3),
      n("C2", 0.25, T1, 0.7),
      n("G5", 0.25, T1, 0.3),
      n("E4", 0.25, T1, 0.8),
      n("G5", 0.25, T1, 0.3),
      n("G5", 0.25, T1, 0.4),
      n("G5", 0.25, T1, 0.4),
    ]),
];

export const TRACK_ACTION: MusicTrack = {
  name: "Alley Cat Assault",
  tempo: T1,
  channels: [
    { options: { type: "square", volume: 0.12 }, notes: actionMelody },
    { options: { type: "square", volume: 0.07 }, notes: actionHarmony },
    { options: { type: "triangle", volume: 0.18 }, notes: actionBass },
    { options: { type: "noise", volume: 0.06 }, notes: actionDrums },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// TRACK 2: "Neon Whiskers" — Menu / Title theme (catchy, slightly chill)
// BPM: ~120, Key of C major
// ──────────────────────────────────────────────────────────────────────────

const T2 = 120;

const menuMelody: NoteEvent[] = [
  n("C5", 1, T2),
  n("E5", 0.5, T2),
  n("G5", 0.5, T2),
  n("A5", 1, T2),
  n("G5", 1, T2),
  n("E5", 0.5, T2),
  n("F5", 0.5, T2),
  n("E5", 0.5, T2),
  n("D5", 0.5, T2),
  n("C5", 2, T2),

  n("C5", 1, T2),
  n("E5", 0.5, T2),
  n("G5", 0.5, T2),
  n("B5", 1, T2),
  n("A5", 0.5, T2),
  n("G5", 0.5, T2),
  n("A5", 0.5, T2),
  n("G5", 0.5, T2),
  n("F5", 0.5, T2),
  n("E5", 0.5, T2),
  n("D5", 1.5, T2),
  rest(0.5, T2),

  // Bridge
  n("G4", 0.5, T2),
  n("A4", 0.5, T2),
  n("B4", 0.5, T2),
  n("C5", 0.5, T2),
  n("D5", 1, T2),
  n("E5", 1, T2),
  n("F5", 0.5, T2),
  n("E5", 0.5, T2),
  n("D5", 0.5, T2),
  n("C5", 0.5, T2),
  n("B4", 1, T2),
  n("C5", 1, T2),
  rest(2, T2),
];

const menuBass: NoteEvent[] = [
  n("C3", 1, T2),
  n("C3", 1, T2),
  n("F3", 1, T2),
  n("G3", 1, T2),
  n("A2", 1, T2),
  n("A2", 1, T2),
  n("G2", 1, T2),
  n("G2", 1, T2),
  n("C3", 1, T2),
  n("C3", 1, T2),
  n("E3", 1, T2),
  n("E3", 1, T2),
  n("F3", 1, T2),
  n("F3", 1, T2),
  n("G3", 1, T2),
  rest(1, T2),
  // Bridge
  n("G2", 1, T2),
  n("G2", 1, T2),
  n("A2", 1, T2),
  n("A2", 1, T2),
  n("F2", 1, T2),
  n("F2", 1, T2),
  n("G2", 1, T2),
  n("C3", 1, T2),
  rest(2, T2),
];

export const TRACK_MENU: MusicTrack = {
  name: "Neon Whiskers",
  tempo: T2,
  channels: [
    { options: { type: "square", volume: 0.1 }, notes: menuMelody },
    { options: { type: "triangle", volume: 0.14 }, notes: menuBass },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// TRACK 3: "Boss Cat Remix" — Boss fight music (intense, fast)
// BPM: ~170, Key of D minor
// ──────────────────────────────────────────────────────────────────────────

const T3 = 170;

const bossMelody: NoteEvent[] = [
  // Aggressive opening riff
  n("D5", 0.25, T3),
  n("D5", 0.25, T3),
  n("F5", 0.25, T3),
  n("D5", 0.25, T3),
  n("A5", 0.5, T3),
  n("G5", 0.5, T3),
  n("F5", 0.25, T3),
  n("E5", 0.25, T3),
  n("D5", 0.25, T3),
  n("C5", 0.25, T3),
  n("D5", 1, T3),

  n("D5", 0.25, T3),
  n("D5", 0.25, T3),
  n("F5", 0.25, T3),
  n("A5", 0.25, T3),
  n("C6", 0.5, T3),
  n("A5", 0.5, T3),
  n("G5", 0.25, T3),
  n("F5", 0.25, T3),
  n("G5", 0.5, T3),
  n("A5", 1, T3),

  // Descending power riff
  n("A5", 0.25, T3),
  n("G5", 0.25, T3),
  n("F5", 0.25, T3),
  n("E5", 0.25, T3),
  n("D5", 0.5, T3),
  n("C5", 0.5, T3),
  n("D5", 0.5, T3),
  n("F5", 0.5, T3),
  n("A5", 0.5, T3),
  n("D6", 0.5, T3),

  n("C6", 0.5, T3),
  n("A5", 0.5, T3),
  n("G5", 0.5, T3),
  n("F5", 0.5, T3),
  n("D5", 1, T3),
  rest(1, T3),
];

const bossBass: NoteEvent[] = [
  // Pumping 8th notes
  n("D2", 0.5, T3),
  n("D3", 0.5, T3),
  n("D2", 0.5, T3),
  n("D3", 0.5, T3),
  n("D2", 0.5, T3),
  n("D3", 0.5, T3),
  n("C3", 0.5, T3),
  n("C3", 0.5, T3),

  n("D2", 0.5, T3),
  n("D3", 0.5, T3),
  n("D2", 0.5, T3),
  n("F3", 0.5, T3),
  n("A2", 0.5, T3),
  n("A3", 0.5, T3),
  n("G2", 0.5, T3),
  n("G3", 0.5, T3),

  n("F2", 0.5, T3),
  n("F3", 0.5, T3),
  n("E2", 0.5, T3),
  n("E3", 0.5, T3),
  n("D2", 0.5, T3),
  n("D3", 0.5, T3),
  n("D2", 0.5, T3),
  n("D3", 0.5, T3),

  n("G2", 0.5, T3),
  n("A2", 0.5, T3),
  n("A#2", 0.5, T3),
  n("A2", 0.5, T3),
  n("D2", 1, T3),
  rest(1, T3),
];

const bossDrums: NoteEvent[] = [
  ...Array(4)
    .fill(null)
    .flatMap(() => [
      n("C2", 0.25, T3, 1.0),
      n("G5", 0.25, T3, 0.4),
      n("E4", 0.25, T3, 0.9),
      n("G5", 0.25, T3, 0.4),
      n("C2", 0.25, T3, 0.8),
      n("E4", 0.25, T3, 0.9),
      n("G5", 0.25, T3, 0.4),
      n("G5", 0.25, T3, 0.5),
    ]),
];

export const TRACK_BOSS: MusicTrack = {
  name: "Boss Cat Remix",
  tempo: T3,
  channels: [
    { options: { type: "square", volume: 0.13 }, notes: bossMelody },
    { options: { type: "triangle", volume: 0.19 }, notes: bossBass },
    { options: { type: "noise", volume: 0.07 }, notes: bossDrums },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// TRACK 4: "Game Over Blues" — short, somber
// ──────────────────────────────────────────────────────────────────────────

const T4 = 80;

const gameOverMelody: NoteEvent[] = [
  n("E4", 1.5, T4),
  n("D4", 1.5, T4),
  n("C4", 1, T4),
  n("B3", 1, T4),
  n("A3", 3, T4),
  rest(1, T4),
];

const gameOverBass: NoteEvent[] = [
  n("A2", 3, T4),
  n("G2", 2, T4),
  n("F2", 2, T4),
  n("A2", 2, T4),
  rest(1, T4),
];

export const TRACK_GAMEOVER: MusicTrack = {
  name: "Game Over Blues",
  tempo: T4,
  channels: [
    { options: { type: "square", volume: 0.1 }, notes: gameOverMelody },
    { options: { type: "triangle", volume: 0.12 }, notes: gameOverBass },
  ],
};

// ── Background tracks (10 genre-spanning compositions) ───────────────────

import {
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
  BG_TRACK_LIST,
} from "./BgTracks";

export { BG_TRACK_LIST };

// ── All tracks ───────────────────────────────────────────────────────────

export const ALL_TRACKS = {
  action: TRACK_ACTION,
  menu: TRACK_MENU,
  boss: TRACK_BOSS,
  gameover: TRACK_GAMEOVER,
  bg_funky: TRACK_BG_FUNKY,
  bg_jazz: TRACK_BG_JAZZ,
  bg_techno: TRACK_BG_TECHNO,
  bg_cyber: TRACK_BG_CYBER,
  bg_blues: TRACK_BG_BLUES,
  bg_ambient: TRACK_BG_AMBIENT,
  bg_disco: TRACK_BG_DISCO,
  bg_fusion: TRACK_BG_FUSION,
  bg_pop: TRACK_BG_POP,
  bg_synth: TRACK_BG_SYNTH,
} as const;

export type TrackName = keyof typeof ALL_TRACKS;

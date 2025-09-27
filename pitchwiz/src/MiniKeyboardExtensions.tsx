import React from "react";

interface MiniKeyboardExtensionsProps {
  notes: string[]; // e.g. ["C4", "E4", "G4", "D5"]
  root?: string;   // e.g. "C"
  width?: number;
  height?: number;
  onKeyClick?: (note: string, index: number) => void;
}

const NOTE_SEQUENCE = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
];
const WHITE_NOTES = ["C", "D", "E", "F", "G", "A", "B"];

function parseNoteWithOctave(note: string) {
  const match = note.match(/^([A-G]#?)(\d)$/);
  if (!match) return { note, octave: 4 };
  return { note: match[1], octave: parseInt(match[2], 10) };
}

function getPatternOffsetsWithOctave(notes: string[], root: string) {
  // Accept notes like "D5" and use both note and octave for offset
  const rootIdx = NOTE_SEQUENCE.indexOf(root);
  return notes.map(n => {
    const { note: baseNote, octave } = parseNoteWithOctave(n);
    const noteIdx = NOTE_SEQUENCE.indexOf(baseNote);
    if (noteIdx === -1) return null;
    return (octave - 4) * 12 + (noteIdx - rootIdx + 12) % 12;
  }).filter((x): x is number => x !== null);
}

function getVisibleKeyboardExtensions(root: string, patternOffsets: number[], notes: string[]) {
  // Compute the highest octave needed from the notes array
  let maxOctave = 4;
  notes.forEach(n => {
    const { octave } = parseNoteWithOctave(n);
    if (octave > maxOctave) maxOctave = octave;
  });
  // Show keys from base octave up to the highest extension octave
  const rootIdx = NOTE_SEQUENCE.indexOf(root);
  const totalKeys = (maxOctave - 4 + 1) * 12;
  let keys: { note: string, midi: number, offset: number, octave: number }[] = [];
  for (let i = 0; i < totalKeys; i++) {
    const midi = rootIdx + i;
    const note = NOTE_SEQUENCE[(midi + 12) % 12];
    const octave = 4 + Math.floor(i / 12);
    keys.push({ note, midi, offset: i, octave });
  }
  return keys;
}

const MiniKeyboardExtensions: React.FC<MiniKeyboardExtensionsProps> = ({ notes, root, width = 280, height = 80, onKeyClick }) => {
  if (!root || notes.length === 0) return null;
  const patternOffsets = getPatternOffsetsWithOctave(notes, root);
  const keys = getVisibleKeyboardExtensions(root, patternOffsets, notes);
  const whiteKeys = keys.filter(k => WHITE_NOTES.includes(k.note));
  const keyWidth = width / whiteKeys.length;
  let whiteX = 0;
  const whiteKeyPositions = keys.map((k, i) => {
    if (WHITE_NOTES.includes(k.note)) {
      const pos = { ...k, x: whiteX, index: i };
      whiteX += keyWidth;
      return pos;
    }
    return null;
  }).filter(Boolean) as (typeof keys[0] & { x: number, index: number })[];

  const blackKeyPositions = whiteKeyPositions.map((wkp, i, arr) => {
    const idx = NOTE_SEQUENCE.indexOf(wkp.note);
    const nextIdx = (idx + 1) % 12;
    const blackNote = NOTE_SEQUENCE[nextIdx];
    if (blackNote.includes('#') && arr[i + 1]) {
      return {
        note: blackNote,
        x: wkp.x + keyWidth * 0.7,
        midi: wkp.midi + 1,
        offset: wkp.offset + 1,
        index: wkp.index + 1,
        octave: wkp.octave
      };
    }
    return null;
  }).filter(Boolean) as (typeof keys[0] & { x: number, index: number, octave: number })[];

  const highlightSet = new Set(patternOffsets);

  return (
      <svg width={width} height={height + 20} style={{ background: '#fcfbe6', borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
        {/* Root note label */}
        {root && (
            <text
                x={width / 2}
                y={22}
                textAnchor="middle"
                fontWeight="bold"
                fontSize={24}
                fill="#444"
            >
              {root}
            </text>
        )}
        {/* White keys */}
        {whiteKeyPositions.map((key, i) => (
            <rect
                key={key.note + key.octave + i}
                x={key.x}
                y={30}
                width={keyWidth}
                height={height - 10}
                fill={highlightSet.has(key.offset) ? (key.note === root ? "#d44" : "#e88") : "white"}
                stroke="#222"
                rx={3}
                ry={3}
                onClick={onKeyClick ? () => onKeyClick(key.note + key.octave, key.index) : undefined}
                style={{ cursor: onKeyClick ? 'pointer' : 'default' }}
            />
        ))}
        {/* Black keys */}
        {blackKeyPositions.map((key, i) => (
            <rect
                key={key.note + key.octave + i + "b"}
                x={key.x}
                y={30}
                width={keyWidth * 0.6}
                height={(height - 10) * 0.65}
                fill={highlightSet.has(key.offset) ? (key.note === root ? "#a11" : "#c44") : "#222"}
                stroke="#111"
                rx={2}
                ry={2}
                onClick={onKeyClick ? () => onKeyClick(key.note + key.octave, key.index) : undefined}
                style={{ cursor: onKeyClick ? 'pointer' : 'default' }}
            />
        ))}
      </svg>
  );
};

export default MiniKeyboardExtensions;

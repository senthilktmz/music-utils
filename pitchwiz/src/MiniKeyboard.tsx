import React from "react";

interface MiniKeyboardProps {
  notes: string[]; // e.g. ["F#", "A#", "C#"]
  root?: string;   // e.g. "F#"
  width?: number;
  height?: number;
  onKeyClick?: (note: string, index: number) => void; // NEW: handle key click
}

const NOTE_SEQUENCE = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
];
const WHITE_NOTES = ["C", "D", "E", "F", "G", "A", "B"];

function getPatternOffsets(notes: string[], root: string) {
  const rootIdx = NOTE_SEQUENCE.indexOf(root);
  return notes.map(n => (NOTE_SEQUENCE.indexOf(n) - rootIdx + 12) % 12);
}

function getVisibleKeyboard(root: string, patternOffsets: number[], extra: number = 12) {
  const rootIdx = NOTE_SEQUENCE.indexOf(root);
  const totalKeys = patternOffsets.length + 2 * extra;
  let keys: { note: string, midi: number, offset: number }[] = [];
  for (let i = -extra; i < patternOffsets.length + extra; i++) {
    const midi = rootIdx + i;
    const note = NOTE_SEQUENCE[(midi + 12) % 12];
    keys.push({ note, midi, offset: i });
  }
  return keys;
}

const MiniKeyboard: React.FC<MiniKeyboardProps> = ({ notes, root, width = 280, height = 80, onKeyClick }) => {
  if (!root || notes.length === 0) return null;
  const patternOffsets = getPatternOffsets(notes, root);
  const keys = getVisibleKeyboard(root, patternOffsets, 12);
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
        index: wkp.index + 1
      };
    }
    return null;
  }).filter(Boolean) as (typeof keys[0] & { x: number, index: number })[];

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
                key={key.note + i}
                x={key.x}
                y={30}
                width={keyWidth}
                height={height - 10}
                fill={highlightSet.has(key.offset) ? (key.note === root ? "#d44" : "#e88") : "white"}
                stroke="#222"
                rx={3}
                ry={3}
                onClick={onKeyClick ? () => onKeyClick(key.note, key.index) : undefined}
                style={{ cursor: onKeyClick ? 'pointer' : 'default' }}
            />
        ))}
        {/* Black keys */}
        {blackKeyPositions.map((key, i) => (
            <rect
                key={key.note + i + "b"}
                x={key.x}
                y={30}
                width={keyWidth * 0.6}
                height={(height - 10) * 0.65}
                fill={highlightSet.has(key.offset) ? (key.note === root ? "#a11" : "#c44") : "#222"}
                stroke="#111"
                rx={2}
                ry={2}
                onClick={onKeyClick ? () => onKeyClick(key.note, key.index) : undefined}
                style={{ cursor: onKeyClick ? 'pointer' : 'default' }}
            />
        ))}
      </svg>
  );
};

export default MiniKeyboard;
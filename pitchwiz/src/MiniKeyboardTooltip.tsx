import React from "react";

interface MiniKeyboardTooltipProps {
  notes: string[];
  root: string;
  width?: number;
  height?: number;
}

const NOTE_SEQUENCE = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
];

function getPatternOffsets(notes: string[], root: string) {
  const rootIndex = NOTE_SEQUENCE.indexOf(root);
  return notes.map(n => (NOTE_SEQUENCE.indexOf(n) - rootIndex + 12) % 12);
}

function getVisibleKeyboard(root: string, patternOffsets: number[], totalKeys: number) {
  const rootIndex = NOTE_SEQUENCE.indexOf(root);
  const start = rootIndex;
  const keys = [];
  for (let i = 0; i < totalKeys; i++) {
    const idx = (start + i) % 12;
    keys.push({
      note: NOTE_SEQUENCE[idx],
      offset: (idx - rootIndex + 12) % 12,
      index: idx
    });
  }
  return keys;
}

const MiniKeyboardTooltip: React.FC<MiniKeyboardTooltipProps> = ({ notes, root, width = 120, height = 32 }) => {
  if (!root || notes.length === 0) return null;
  const patternOffsets = getPatternOffsets(notes, root);
  const keys = getVisibleKeyboard(root, patternOffsets, 12);
  const keyWidth = width / 14;
  const whiteKeyPositions = keys
    .map((k, i) => ({ ...k, x: i * keyWidth }))
    .filter(k => !k.note.includes("#"));
  const blackKeyPositions = keys
    .map((k, i) => ({ ...k, x: i * keyWidth - keyWidth * 0.3 }))
    .filter(k => k.note.includes("#"));
  const highlightSet = new Set(patternOffsets);

  return (
    <svg width={width} height={height + 10} style={{ background: '#fcfbe6', borderRadius: 6, boxShadow: '0 2px 6px #0001', marginTop: 2 }}>
      {/* Root note label */}
      {root && (
        <text
          x={width / 2}
          y={14}
          textAnchor="middle"
          fontWeight="bold"
          fontSize={12}
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
          y={20}
          width={keyWidth}
          height={height - 8}
          fill={highlightSet.has(key.offset) ? (key.note === root ? "#d44" : "#e88") : "white"}
          stroke="#222"
          rx={2}
          ry={2}
        />
      ))}
      {/* Black keys */}
      {blackKeyPositions.map((key, i) => (
        <rect
          key={key.note + i + "b"}
          x={key.x}
          y={20}
          width={keyWidth * 0.6}
          height={(height - 8) * 0.65}
          fill={highlightSet.has(key.offset) ? (key.note === root ? "#a11" : "#c44") : "#222"}
          stroke="#111"
          rx={1}
          ry={1}
        />
      ))}
    </svg>
  );
};

export default MiniKeyboardTooltip;

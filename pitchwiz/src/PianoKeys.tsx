import React from "react";

export const NOTE_SEQUENCE = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
];

interface PianoKeysProps {
  octaves?: number;
  keyWidth?: number;
  keyHeight?: number;
  renderKey?: (note: string, idx: number, x: number, keyWidth: number, keyHeight: number) => React.ReactNode;
}

const PianoKeys: React.FC<PianoKeysProps> = ({
  octaves = 2,
  keyWidth = 40,
  keyHeight = 160,
  renderKey,
}) => {
  const notes: { note: string; idx: number }[] = [];
  for (let o = 0; o < octaves; o++) {
    for (let i = 0; i < NOTE_SEQUENCE.length; i++) {
      notes.push({ note: NOTE_SEQUENCE[i], idx: o * NOTE_SEQUENCE.length + i });
    }
  }
  const svgWidth = notes.length * keyWidth;
  const svgHeight = keyHeight;

  return (
    <svg width={svgWidth} height={svgHeight} style={{ border: "1px solid #ccc", background: "#fff" }}>
      {notes.map((n, i) => (
        renderKey ? (
          renderKey(n.note, n.idx, i * keyWidth, keyWidth, keyHeight)
        ) : (
          <g key={n.note + i}>
            <rect
              x={i * keyWidth}
              y={0}
              width={keyWidth}
              height={keyHeight}
              fill={n.note.includes('#') ? '#000' : '#fff'}
              stroke="#000"
            />
            <text
              x={i * keyWidth + keyWidth / 2}
              y={keyHeight - 10}
              textAnchor="middle"
              fontSize={16}
              fill={n.note.includes('#') ? '#fff' : '#222'}
            >
              {n.note}
            </text>
          </g>
        )
      ))}
    </svg>
  );
};

export default PianoKeys;

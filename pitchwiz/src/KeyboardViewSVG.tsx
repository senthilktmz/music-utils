import React from "react";

interface KeyboardViewSVGProps {
  backwardPadding: string[];
  keySequence: string[];
  forwardPadding: string[];
  width?: number;
  height?: number;
}

const NOTE_SEQUENCE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const BLACK_KEYS = new Set(["C#", "D#", "F#", "G#", "A#"]);

function getBaseNote(note: string) {
  return note.replace(/\d+$/, "");
}

function getKeyType(note: string) {
  return BLACK_KEYS.has(getBaseNote(note)) ? 'black' : 'white';
}

function getWhiteKeysInRange(start: string, end: string) {
  const notes = [];
  let [startNote, startOct] = [start.slice(0, -1), parseInt(start.slice(-1))];
  let [endNote, endOct] = [end.slice(0, -1), parseInt(end.slice(-1))];
  let idx = NOTE_SEQUENCE.indexOf(startNote);
  let oct = startOct;
  while (!(oct > endOct || (oct === endOct && idx > NOTE_SEQUENCE.indexOf(endNote)))) {
    const n = NOTE_SEQUENCE[idx] + oct;
    if (getKeyType(n) === 'white') notes.push(n);
    idx++;
    if (idx === 12) { idx = 0; oct++; }
  }
  return notes;
}

function getBlackKeysForWhiteKeys(whiteKeys: string[]) {
  let blackKeys: { note: string; x: number }[] = [];
  for (let i = 0; i < whiteKeys.length - 1; i++) {
    const curr = whiteKeys[i];
    const currBase = getBaseNote(curr);
    const currOct = parseInt(curr.slice(-1));
    const idx = NOTE_SEQUENCE.indexOf(currBase);
    const nextIdx = (idx + 1) % 12;
    const nextBase = NOTE_SEQUENCE[nextIdx];
    if (BLACK_KEYS.has(nextBase)) {
      // Black key is between curr and next
      // The octave for the black key is the same as curr unless nextBase is 'C', then it's next octave
      const blackOct = (nextBase === 'C') ? currOct + 1 : currOct;
      const note = nextBase + blackOct;
      blackKeys.push({ note, x: i });
    }
  }
  return blackKeys;
}

const WHITE_KEY_WIDTH = 9;
const WHITE_KEY_HEIGHT = 45;
const BLACK_KEY_WIDTH = 5;
const BLACK_KEY_HEIGHT = 27;

const KeyboardViewSVG: React.FC<KeyboardViewSVGProps> = ({ backwardPadding, keySequence, forwardPadding }) => {
  const allKeys = [...backwardPadding, ...keySequence, ...forwardPadding];
  const firstWhite = allKeys.find(k => getKeyType(k.replace(/^0/, '')) === 'white')?.replace(/^0/, '');
  const lastWhite = [...allKeys].reverse().find(k => getKeyType(k.replace(/^0/, '')) === 'white')?.replace(/^0/, '');
  if (!firstWhite || !lastWhite) return null;
  const whiteKeys = getWhiteKeysInRange(firstWhite, lastWhite);
  const blackKeys = getBlackKeysForWhiteKeys(whiteKeys);
  const width = WHITE_KEY_WIDTH * whiteKeys.length;
  const height = WHITE_KEY_HEIGHT;

  // Find which keys to highlight red (main notes in keySequence, not starting with '0')
  const mainNotes = new Set(keySequence.filter(k => !k.startsWith('0')));

  return (
    <svg width={width} height={height} style={{ background: '#f9f7e6', borderRadius: 0, boxShadow: '0 2px 8px #0002', display: 'block' }}>
      {/* White keys with shadow and rectangular corners */}
      {whiteKeys.map((note, i) => {
        // Note: keySequence may have 0-prefixed notes, so compare with and without prefix
        const isRed = mainNotes.has(note);
        const base = getBaseNote(note);
        return (
          <g key={note}>
            <rect
              x={i * WHITE_KEY_WIDTH}
              y={0}
              width={WHITE_KEY_WIDTH}
              height={WHITE_KEY_HEIGHT}
              fill={isRed ? '#d44' : '#fff'}
              stroke="#222"
              rx={0}
              ry={0}
              style={{ filter: 'drop-shadow(0 2px 2px #0001)' }}
            />
            {/* Label for all white keys; use contrasting color if key is red */}
            <text
              x={i * WHITE_KEY_WIDTH + WHITE_KEY_WIDTH / 2}
              y={WHITE_KEY_HEIGHT - 6}
              textAnchor="middle"
              fontSize={7}
              fontWeight={isRed ? 'bold' : 'normal'}
              fill={isRed ? '#fff' : '#333'}
              stroke={isRed ? '#111' : 'none'}
              strokeWidth={isRed ? 0.4 : 0}
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {base}
            </text>
          </g>
        );
      })}
      {/* Black keys (shorter, layered above white) */}
      {blackKeys.map(({ note, x }, i) => {
        const isRed = mainNotes.has(note);
        return (
          <rect
            key={note}
            x={x * WHITE_KEY_WIDTH + WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2}
            y={0}
            width={BLACK_KEY_WIDTH}
            height={BLACK_KEY_HEIGHT}
            fill={isRed ? '#d44' : '#222'}
            stroke="#111"
            rx={4}
            ry={4}
            style={{ filter: 'drop-shadow(0 2px 4px #0003)' }}
          />
        );
      })}
      {/* Labels for red-highlighted black keys (place near the bottom of the black key) */}
      {blackKeys.map(({ note, x }) => {
        const isRed = mainNotes.has(note);
        if (!isRed) return null;
        const base = getBaseNote(note);
        const cx = x * WHITE_KEY_WIDTH + WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2;
        return (
          <g key={note + '-label-group'}>
            {/* Background pill to improve contrast on red-highlighted black keys */}
            <rect
              x={cx + BLACK_KEY_WIDTH / 2 - 7}
              y={BLACK_KEY_HEIGHT - 11}
              width={14}
              height={9}
              rx={4}
              ry={4}
              fill="#000"
              opacity={0.35}
            />
            <text
              x={cx + BLACK_KEY_WIDTH / 2}
              y={BLACK_KEY_HEIGHT - 4}
              textAnchor="middle"
              fontSize={8}
              fontWeight="bold"
              fill="#fff"
              stroke="#111"
              strokeWidth={0.5}
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {base}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default KeyboardViewSVG;

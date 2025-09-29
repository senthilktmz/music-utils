import React, { useState, useRef, useEffect } from "react";
import IntervalPattern from "./IntervalPattern";
import PianoKeyboard from "./PianoKeyboard";
import MiniKeyboardExtensions from "./MiniKeyboardExtensions";
import KeyboardViewSVG from "./KeyboardViewSVG";
import { SCALES_PATTERNS_ARRAY } from "./patterns/Scales";
import { MAIN_KEYBOARD_PATTERN } from "./patterns/MainKeyboard";
import {RAGAS_PATTERNS_ARRAY} from "./patterns/Ragas";

const ROOT_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

interface CarnaticScalesPatternProps {
  zoom?: number;
  patterns: any[];
  ragasPatterns: Record<string, string[]> | any[];
  addScratchPadItem?: (item: any) => void;
}

// Define the full chromatic interval sequence (1 octave)
const INTERVAL_SEQUENCE = [
  "1",  // 0
  "b2", // 1
  "2",  // 2
  "b3", // 3
  "3",  // 4
  "4",  // 5
  "b5", // 6
  "5",  // 7
  "b6", // 8
  "6",  // 9
  "b7", // 10
  "7"   // 11
];

// Helper: get all notes from start to end (inclusive)
const NOTE_SEQUENCE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const EXT_DEGREES = new Set(["b9", "9", "#9", "11", "#11", "b13", "13"]);
function getNoteRangeInclusive(start: string, end: string) {
  if (!start || !end) return [];
  const notes = [];
  let [startNote, startOct] = [start.slice(0, -1), parseInt(start.slice(-1))];
  let [endNote, endOct] = [end.slice(0, -1), parseInt(end.slice(-1))];
  let idx = NOTE_SEQUENCE.indexOf(startNote);
  let oct = startOct;
  while (!(oct > endOct || (oct === endOct && idx > NOTE_SEQUENCE.indexOf(endNote)))) {
    notes.push(NOTE_SEQUENCE[idx] + oct);
    if (NOTE_SEQUENCE[idx] + oct === end) break;
    idx++;
    if (idx === 12) { idx = 0; oct++; }
  }
  return notes;
}

// Generate chord patterns at runtime
function generateChordPattern([name, ...intervals]: string[]) {
  // Find the highest interval index in the canonical sequence
  const maxIndex = Math.max(...intervals.map(i => INTERVAL_SEQUENCE.indexOf(i)));
  return {
    name,
    pattern: INTERVAL_SEQUENCE.slice(0, maxIndex + 1).map((interval, idx) => {
      if (intervals.includes(interval)) {
        if (interval === "1") {
          return {
            label: "↓ 1",
            color: "lightblue",
            type: "scale_interval_member",
            fontColor: "darkgreen",
            fontType: "bold"
          };
        }
        return { label: interval, color: "lightblue", type: "scale_interval" };
      }
      return { label: "", color: "white", type: "scale_interval_blank" };
    })
  };
}

const CHORDS_PATTERNS = RAGAS_PATTERNS_ARRAY.map(generateChordPattern);

const CarnaticScalesPattern: React.FC<CarnaticScalesPatternProps> = ({ zoom = 100, patterns, ragasPatterns, addScratchPadItem }) => {
  const KEY_WIDTH = 40 * (zoom / 100);
  const KEY_HEIGHT = 40 * (zoom / 100);
  const MINI_KEY_WIDTH = 280 * (zoom / 100);
  const MINI_KEY_HEIGHT = 80 * (zoom / 100);
  const KEYBOARD_LENGTH = MAIN_KEYBOARD_PATTERN.length;

  const [selectedPattern, setSelectedPattern] = useState<string>(CHORDS_PATTERNS[0].name);
  const [rootIndex, setRootIndex] = useState<number | null>(null); // index in ROOT_NOTES
  const [sliderOffsetX, setSliderOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalSequenceJson, setIntervalSequenceJson] = useState<string>("");
  const [keyboardViewJson, setKeyboardViewJson] = useState<string>("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const currentPattern = CHORDS_PATTERNS.find((p) => p.name === selectedPattern);

  // Helper: get frequency for note with octave (e.g. D#4, F#4, A4)
  function getFrequency(noteWithOctave: string) {
    // MIDI note number calculation
    const NOTE_TO_MIDI: Record<string, number> = {
      'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
    };
    const match = noteWithOctave.match(/^([A-G]#?)(\d)$/);
    if (!match) return 261.63; // default to middle C
    const [, note, octaveStr] = match;
    const octave = parseInt(octaveStr, 10);
    const midi = (octave + 1) * 12 + NOTE_TO_MIDI[note];
    // Formula for frequency from MIDI note number
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  const playScale = async () => {
    if (isPlaying) return;
    const notes = getPatternNotes();
    setIsPlaying(true);
    for (let note of notes) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.08);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      gain.connect(ctx.destination);
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = getFrequency(note);
      osc.connect(gain);
      osc.start();
      await new Promise(res => setTimeout(res, 500));
      osc.stop();
      ctx.close();
    }
    setIsPlaying(false);
  };

  const stopChord = () => {
    if (audioContextRef.current) {
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop(); } catch (e) {}
      });
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    oscillatorsRef.current = [];
    setIsPlaying(false);
  };

  // Find the first occurrence of the root note in MAIN_KEYBOARD_PATTERN
  const alignSliderToRoot = (idx: number) => {
    const note = ROOT_NOTES[idx];
    const firstIdx = MAIN_KEYBOARD_PATTERN.findIndex(k => k.label === note);
    if (firstIdx !== -1) {
      setSliderOffsetX(firstIdx * KEY_WIDTH);
    } else {
      setSliderOffsetX(0);
    }
  };

  // When a root button is clicked
  const handleRootButtonClick = (idx: number) => {
    setRootIndex(idx);
    alignSliderToRoot(idx);
  };

  // When the slider drag ends, update rootIndex and sliderOffsetX
  const handleSliderChange = (newRootIdx: number) => {
    const bKeyIndex = MAIN_KEYBOARD_PATTERN.findIndex(k => k.label === "B");
    const clampedIdx = newRootIdx > bKeyIndex ? bKeyIndex : newRootIdx % 12;
    setRootIndex(clampedIdx);
    const note = ROOT_NOTES[clampedIdx];
    const firstIdx = MAIN_KEYBOARD_PATTERN.findIndex(k => k.label === note);
    setSliderOffsetX(firstIdx * KEY_WIDTH);
  };

  // Map chord degrees to notes, placing 9/11/13 in the next octave and avoiding duplicate highlights
  const getPatternNotes = () => {
    if (!currentPattern || rootIndex === null) return [];
    const baseOctave = 4;
    const nextOctave = baseOctave + 1;
    const degreeToSemitone: Record<string, number> = {
      "1": 0, "b2": 1, "2": 2, "#2": 3, "b3": 3, "3": 4, "4": 5, "#4": 6, "b5": 6, "5": 7, "#5": 8, "b6": 8, "6": 9, "bb7": 9, "b7": 10, "7": 11,
      "b9": 1, "9": 2, "#9": 3, "11": 5, "#11": 6, "b13": 8, "13": 9
    };
    const notesWithDegrees = (SCALES_PATTERNS_ARRAY.find(([name]) => name === selectedPattern) || []).slice(1) as string[];
    const seenNotes = new Set<string>();
    return notesWithDegrees.map((degree) => {
      let semitone = degreeToSemitone[degree];
      if (semitone === undefined) return null;
      let noteIdx = (rootIndex + semitone) % 12;
      let note = ROOT_NOTES[noteIdx];
      let octave = baseOctave;
      // If degree is 9, 11, 13 or their alterations, use next octave
      if (["b9", "9", "#9", "11", "#11", "b13", "13"].includes(degree)) {
        octave = nextOctave;
      }
      const noteWithOctave = note + octave;
      if (!seenNotes.has(noteWithOctave)) {
        seenNotes.add(noteWithOctave);
        return noteWithOctave;
      }
      return null;
    }).filter((n): n is string => n !== null);
  };

  // Add chord to scratch pad, including the sequence of notes (as frequencies)
  const handleAddToScratchPad = () => {
    if (!currentPattern || rootIndex === null) return;
    const NOTE_FREQS: { [note: string]: number } = {
      'C': 523.25, 'C#': 554.37, 'D': 587.33, 'D#': 622.25, 'E': 659.25, 'F': 698.46,
      'F#': 739.99, 'G': 783.99, 'G#': 830.61, 'A': 880.00, 'A#': 932.33, 'B': 987.77,
    };
    const notes = getPatternNotes();
    const noteFrequencies = notes.map(n => NOTE_FREQS[n.slice(0, -1)] || 523.25);
    const chordInfo = {
      root: rootIndex !== null ? ROOT_NOTES[rootIndex] : undefined,
      type: currentPattern.name,
      notes,
      noteFrequencies,
      timestamp: Date.now()
    };
    if (typeof addScratchPadItem === 'function') {
      addScratchPadItem(chordInfo);
    }
  };

  // Helper to get all notes between two note strings (e.g., G3 to B3)
  function getNoteRange(start: string, end: string) {
    const notes = [];
    let [startNote, startOct] = [start.slice(0, -1), parseInt(start.slice(-1))];
    let [endNote, endOct] = [end.slice(0, -1), parseInt(end.slice(-1))];
    let idx = NOTE_SEQUENCE.indexOf(startNote);
    let oct = startOct;
    while (!(oct > endOct || (oct === endOct && idx > NOTE_SEQUENCE.indexOf(endNote)))) {
      notes.push(NOTE_SEQUENCE[idx] + oct);
      idx++;
      if (idx === 12) { idx = 0; oct++; }
    }
    return notes;
  }

  // --- KeyboardView and IntervalSequence: always update when rootIndex or selectedPattern changes
  useEffect(() => {
    if (rootIndex === null || !selectedPattern) return;
    const pattern = SCALES_PATTERNS_ARRAY.find(([name]) => name === selectedPattern);
    if (pattern) {
      const intervalObj = {
        IntervalType: "CHORD_TYPE",
        degree_sequence: pattern.slice(1),
        ROOT_KEY: ROOT_NOTES[rootIndex],
        octave: 4
      };
      setIntervalSequenceJson(JSON.stringify(intervalObj, null, 2));
      // Patch: Always start key_sequence from ROOT_KEY4 and end at highest chord note
      const rootKey = intervalObj.ROOT_KEY;
      if (!rootKey) return;
      const rootIdx = ROOT_NOTES.indexOf(rootKey);
      if (rootIdx === -1) return;
      const degreeToSemitone: Record<string, number> = {
        "1": 0, "b2": 1, "2": 2, "#2": 3, "b3": 3, "3": 4, "4": 5, "#4": 6, "b5": 6, "5": 7, "#5": 8, "b6": 8, "6": 9, "bb7": 9, "b7": 10, "7": 11,
        "b9": 1+12, "9": 2+12, "#9": 3+12, "11": 5+12, "#11": 6+12, "b13": 8+12, "13": 9+12
      };
      const chordNotes = intervalObj.degree_sequence.map((deg: string) => {
        let semitone = degreeToSemitone[deg];
        if (semitone === undefined) return null;
        let noteIdx = rootIdx + semitone;
        let note = ROOT_NOTES[noteIdx % 12];
        let octave = 4 + Math.floor((rootIdx + semitone) / 12);
        return note + octave;
      }).filter((n): n is string => n !== null);
      // Guard: if no valid notes were found, skip building sequences to avoid undefined access
      if (chordNotes.length === 0) {
        return;
      }
      // Find the highest chord note (by pitch)
      const getPitchIdx = (n: string) => {
        const o = parseInt(n.slice(-1));
        const i = NOTE_SEQUENCE.indexOf(n.slice(0, -1));
        return o * 12 + i;
      };
      const sortedChordNotes = [...chordNotes].sort((a, b) => getPitchIdx(a) - getPitchIdx(b));
      const highestChordNote = sortedChordNotes[sortedChordNotes.length - 1];
      const rootNoteWithOctave = rootKey + "4";
      const key_sequence = getNoteRangeInclusive(rootNoteWithOctave, highestChordNote).map(n =>
          chordNotes.includes(n) ? n : "0" + n
      );
      // Calculate backward_padding (up to but not including rootNoteWithOctave)
      const backward_padding = getNoteRange("G3", rootNoteWithOctave);
      if (backward_padding[backward_padding.length - 1] === rootNoteWithOctave) backward_padding.pop();
      // Calculate forward_padding (after highestChordNote, up to and including B6)
      let note2 = highestChordNote.slice(0, -1);
      let oct2 = parseInt(highestChordNote.slice(-1));
      let idx2 = NOTE_SEQUENCE.indexOf(note2);
      idx2 = (idx2 + 1) % 12;
      if (idx2 === 0) oct2++;
      const forwardStart = NOTE_SEQUENCE[idx2] + oct2;
      // Patch: always pad up to B6 (one octave above typical)
      const forward_padding = getNoteRange(forwardStart, "B6");
      const keyboardViewObj = {
        IntvSequence: intervalObj,
        key_sequence,
        show_backward_padding: ["G", 3],
        show_forward_padding: ["B", 5],
        backward_padding,
        forward_padding
      };
      setKeyboardViewJson(JSON.stringify(keyboardViewObj, null, 2));
    }
  }, [rootIndex, selectedPattern]);

  // PATCH: Dynamically generate pattern for slider to cover all degrees (including 9, 11, 13)
  const sliderPattern = (() => {
    const degreeToSemitone: Record<string, number> = {
      "1": 0, "b2": 1, "2": 2, "#2": 3, "b3": 3, "3": 4, "4": 5, "#4": 6, "b5": 6, "5": 7, "#5": 8, "b6": 8, "6": 9, "bb7": 9, "b7": 10, "7": 11,
      "b9": 13, "9": 14, "#9": 15, "11": 17, "#11": 18, "b13": 20, "13": 21
    };
    const degrees = currentPattern ? (SCALES_PATTERNS_ARRAY.find(([name]) => name === selectedPattern) || []).slice(1) as string[] : [];
    const maxSemitone = Math.max(...degrees.map(d => degreeToSemitone[d]));
    const pattern = [];
    for (let i = 0; i <= maxSemitone; i++) {
      const degree = Object.keys(degreeToSemitone).find(key => degreeToSemitone[key] === i);
      if (degree && degrees.includes(degree)) {
        pattern.push({
          label: degree,
          color: "lightblue",
          type: "scale_interval_member",
          fontColor: degree === "1" ? "darkgreen" : undefined,
          fontType: degree === "1" ? "bold" : undefined
        });
      } else {
        pattern.push({ label: "", color: "white", type: "scale_interval_blank" });
      }
    }
    return pattern;
  })();

  return (
      <div>
        {/* Root key selector row and chord selection dropdown on same line */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, margin: '16px 0', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {ROOT_NOTES.map((note, idx) => (
                <button
                    key={note}
                    style={{
                      padding: '6px 16px',
                      background: rootIndex === idx ? '#1976d2' : '#f0f0f0',
                      color: rootIndex === idx ? '#fff' : '#222',
                      border: '1px solid #aaa',
                      borderRadius: 4,
                      fontWeight: rootIndex === idx ? 'bold' : 'normal',
                      fontSize: 16,
                      cursor: 'pointer',
                      minWidth: 32
                    }}
                    onClick={() => handleRootButtonClick(idx)}
                >
                  {note}
                </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label htmlFor="pattern-select" style={{ fontWeight: 'bold' }}>Chord:</label>
            <select
                id="pattern-select"
                value={selectedPattern}
                onChange={(e) => setSelectedPattern(e.target.value)}
                style={{ fontSize: 16, padding: '4px 8px' }}
            >
              {CHORDS_PATTERNS.map((p) => (
                  <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Root key, Notes, MiniKeyboard, and Play/Stop buttons on same line */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, marginBottom: 32, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, minWidth: 160 }}>
            <div style={{ fontWeight: 'bold', fontSize: 18 }}>
              Root key: {rootIndex !== null ? ROOT_NOTES[rootIndex] : "Select a root key"}
            </div>
            {keyboardViewJson && (() => {
              try {
                const kv = JSON.parse(keyboardViewJson);
                const displayNotes = kv.key_sequence.filter((n: string) => !n.startsWith('0')).join(' - ');
                return (
                    <div style={{ fontSize: 16 }}>
                      Notes: {displayNotes}
                    </div>
                );
              } catch {
                return null;
              }
            })()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {keyboardViewJson && (() => {
              try {
                const kv = JSON.parse(keyboardViewJson);
                return (
                    <KeyboardViewSVG
                        backwardPadding={kv.backward_padding}
                        keySequence={kv.key_sequence}
                        forwardPadding={kv.forward_padding}
                    />
                );
              } catch {
                return null;
              }
            })()}
            <button
                onClick={handleAddToScratchPad}
                title="Add chord to Scratch Pad"
                style={{
                  border: 'none',
                  background: '#1976d2',
                  color: 'white',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px #0002',
                  marginLeft: 8
                }}
            >
              <span style={{ fontWeight: 'bold', fontSize: 18, lineHeight: 1 }}>+</span>
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 16 }}>
            <button onClick={playScale} disabled={isPlaying} style={{ marginBottom: 8, padding: '8px 24px', fontSize: 16, background: isPlaying ? '#bbb' : '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: isPlaying ? 'not-allowed' : 'pointer' }}>
              ▶ Play
            </button>
            <button onClick={stopChord} disabled={!isPlaying} style={{ padding: '8px 24px', fontSize: 16, background: !isPlaying ? '#bbb' : '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, cursor: !isPlaying ? 'not-allowed' : 'pointer' }}>
              ■ Stop
            </button>
          </div>
        </div>
        {/* Show JSON of keys about to be played as a chord */}
        {(() => {
          // Only show if a chord is selected
          if (!selectedPattern || rootIndex === null) return null;
          // Find the notes to be played (i.e., the notes in key_sequence that are not prefixed with '0')
          try {
            const kv = keyboardViewJson ? JSON.parse(keyboardViewJson) : null;
            if (!kv) return null;
            const playedKeys = kv.key_sequence.filter((n: string) => !n.startsWith('0'));
            return (
                // <pre style={{ background: '#f4f4f4', color: '#222', fontSize: 13, padding: 12, borderRadius: 8, margin: '16px 0', maxWidth: 600, overflowX: 'auto' }}>
                //   {JSON.stringify({ playedKeys }, null, 2)}
                // </pre>
                null
            );
          } catch {
            return null;
          }
        })()}
        {/* Show the full keyboardView JSON for debugging */}
        {/* {keyboardViewJson && (
        <pre style={{ background: '#f4f4f4', color: '#222', fontSize: 13, padding: 12, borderRadius: 8, margin: '16px 0', maxWidth: 600, overflowX: 'auto' }}>{keyboardViewJson}</pre>
      )} */}
        {currentPattern && (
            <>
              <div style={{ height: 32 }} />
              <div style={{ textAlign: 'center', marginBottom: 8, color: '#555' }}>
                Tip: Drag or slide the pattern bar below to left or right to explore different chord positions.
              </div>
              <IntervalPattern
                  pattern={sliderPattern}
                  keyWidth={KEY_WIDTH}
                  keyHeight={KEY_HEIGHT}
                  keyboardWidth={KEY_WIDTH * KEYBOARD_LENGTH}
                  totalKeys={KEYBOARD_LENGTH}
                  slidable={true}
                  onRootChange={handleSliderChange}
                  offsetX={sliderOffsetX}
              />
            </>
        )}
        <div style={{ marginTop: 8 }}>
          <PianoKeyboard keyWidth={KEY_WIDTH} keyHeight={KEY_HEIGHT * 3} />
        </div>
      </div>
  );
};

export default CarnaticScalesPattern;

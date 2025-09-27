import React, { useState, useRef } from "react";
import IntervalPattern from "./IntervalPattern";
import PianoKeyboard from "./PianoKeyboard";
import MiniKeyboardExtensions from "./MiniKeyboardExtensions";
import KeyboardViewSVG from "./KeyboardViewSVG";
import { CHORDS_PATTERNS_ARRAY } from "./patterns/Chords";
import { MAIN_KEYBOARD_PATTERN } from "./patterns/MainKeyboard";

const ROOT_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

interface ChordsPatternProps {
  zoom?: number;
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

const CHORDS_PATTERNS = CHORDS_PATTERNS_ARRAY.map(generateChordPattern);

const ChordsPattern: React.FC<ChordsPatternProps> = ({ zoom = 100, addScratchPadItem }) => {
  const KEY_WIDTH = 40 * (zoom / 100);
  const KEY_HEIGHT = 40 * (zoom / 100);
  const MINI_KEY_WIDTH = 280 * (zoom / 100);
  const MINI_KEY_HEIGHT = 80 * (zoom / 100);
  const KEYBOARD_LENGTH = MAIN_KEYBOARD_PATTERN.length;

  const [selectedPattern, setSelectedPattern] = useState<string>(CHORDS_PATTERNS[0].name);
  const [rootIndex, setRootIndex] = useState(0); // index in ROOT_NOTES
  const [sliderOffsetX, setSliderOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalSequenceJson, setIntervalSequenceJson] = useState<string>("");
  const [keyboardViewJson, setKeyboardViewJson] = useState<string>("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const currentPattern = CHORDS_PATTERNS.find((p) => p.name === selectedPattern);

  // Helper: Map note names to frequencies for the 5th octave (C5 = 523.25 Hz)
  const noteToFrequency = (note: string) => {
    const NOTE_FREQS: { [note: string]: number } = {
      'C': 523.25, 'C#': 554.37, 'D': 587.33, 'D#': 622.25, 'E': 659.25, 'F': 698.46,
      'F#': 739.99, 'G': 783.99, 'G#': 830.61, 'A': 880.00, 'A#': 932.33, 'B': 987.77,
    };
    return NOTE_FREQS[note] || 523.25;
  };

  const playChord = () => {
    if (isPlaying) return;
    const notes = getPatternNotes();
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.08); // soft attack
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.92); // sustain
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1); // gentle release
    gain.connect(ctx.destination);
    const oscillators: OscillatorNode[] = notes.map(note => {
      const osc = ctx.createOscillator();
      osc.type = 'sine'; // Sweetest basic waveform
      osc.frequency.value = noteToFrequency(note);
      osc.connect(gain);
      return osc;
    });
    oscillators.forEach(osc => osc.start());
    oscillatorsRef.current = oscillators;
    setIsPlaying(true);
    setTimeout(() => {
      stopChord();
    }, 1000);
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
  const alignSliderToRoot = (rootIdx: number) => {
    const note = ROOT_NOTES[rootIdx];
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
    setIsDragging(false);
  };

  // When the slider is dragged, update only rootIndex and set isDragging true
  const handleSliderChange = (newRootIdx: number) => {
    setRootIndex(newRootIdx % 12);
    setIsDragging(true);
  };

  // Map chord degrees to notes, placing 9/11/13 in the next octave and avoiding duplicate highlights
  const getPatternNotes = () => {
    if (!currentPattern) return [];
    const baseOctave = 4;
    const nextOctave = baseOctave + 1;
    const degreeToSemitone: Record<string, number> = {
      "1": 0, "b2": 1, "2": 2, "#2": 3, "b3": 3, "3": 4, "4": 5, "#4": 6, "b5": 6, "5": 7, "#5": 8, "b6": 8, "6": 9, "bb7": 9, "b7": 10, "7": 11,
      "b9": 1, "9": 2, "#9": 3, "11": 5, "#11": 6, "b13": 8, "13": 9
    };
    const notesWithDegrees = (CHORDS_PATTERNS_ARRAY.find(([name]) => name === selectedPattern) || []).slice(1) as string[];
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
    if (!currentPattern) return;
    const NOTE_FREQS: { [note: string]: number } = {
      'C': 523.25, 'C#': 554.37, 'D': 587.33, 'D#': 622.25, 'E': 659.25, 'F': 698.46,
      'F#': 739.99, 'G': 783.99, 'G#': 830.61, 'A': 880.00, 'A#': 932.33, 'B': 987.77,
    };
    const notes = getPatternNotes();
    const noteFrequencies = notes.map(n => NOTE_FREQS[n.slice(0, -1)] || 523.25);
    const chordInfo = {
      root: ROOT_NOTES[rootIndex],
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
    const NOTE_SEQUENCE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
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

  // When a chord dropdown is selected, create IntervalSequence and KeyboardView and show as JSON
  const handlePatternSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPattern(e.target.value);
    // Build IntervalSequence object
    const pattern = CHORDS_PATTERNS_ARRAY.find(([name]) => name === e.target.value);
    if (pattern) {
      const intervalObj = {
        IntervalType: "CHORD_TYPE",
        degree_sequence: pattern.slice(1),
        ROOT_KEY: ROOT_NOTES[rootIndex],
        octave: 4
      };
      setIntervalSequenceJson(JSON.stringify(intervalObj, null, 2));

      // --- KeyboardView ---
      // Map degree_sequence to key_sequence (e.g., C4, E4, G4)
      const degreeToSemitone: Record<string, number> = {
        "1": 0, "b2": 1, "2": 2, "#2": 3, "b3": 3, "3": 4, "4": 5, "#4": 6, "b5": 6, "5": 7, "#5": 8, "b6": 8, "6": 9, "bb7": 9, "b7": 10, "7": 11,
        "b9": 1, "9": 2, "#9": 3, "11": 5, "#11": 6, "b13": 8, "13": 9
      };
      const rootIdx = ROOT_NOTES.indexOf(intervalObj.ROOT_KEY);
      // First, get the set of actual chord notes (e.g., ["C4", "E4", "G4"])
      const chordNotesSet = new Set(
        intervalObj.degree_sequence.map((deg: string) => {
          let semitone = degreeToSemitone[deg];
          if (semitone === undefined) return null;
          let noteIdx = (rootIdx + semitone) % 12;
          let note = ROOT_NOTES[noteIdx];
          let octave = 4;
          if (["b9", "9", "#9", "11", "#11", "b13", "13"].includes(deg)) octave = 5;
          return note + octave;
        }).filter((n): n is string => n !== null)
      );
      // Now build key_sequence from C4 to G4
      const NOTE_SEQUENCE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
      let key_sequence: string[] = [];
      let startIdx = NOTE_SEQUENCE.indexOf("C");
      let endIdx = NOTE_SEQUENCE.indexOf("G");
      let oct = 4;
      for (let idx = startIdx; !(oct > 4 && idx > endIdx); idx++) {
        if (idx === 12) { idx = 0; oct++; }
        const note = NOTE_SEQUENCE[idx] + oct;
        if (chordNotesSet.has(note)) {
          key_sequence.push(note);
        } else {
          key_sequence.push("0" + note);
        }
        if (oct === 4 && idx === endIdx) break;
      }
      // Calculate backward_padding (up to but not including first key_sequence note)
      const firstSeqNote = key_sequence.find(k => !k.startsWith('0')) || key_sequence[0];
      const backward_padding = getNoteRange("G3", firstSeqNote.slice(0, -1) + firstSeqNote.slice(-1));
      if (backward_padding[backward_padding.length - 1] === firstSeqNote) backward_padding.pop();
      // Calculate forward_padding (after last key_sequence note, up to and including show_forward_padding)
      const lastSeqNote = [...key_sequence].reverse().find(k => !k.startsWith('0')) || key_sequence[key_sequence.length - 1];
      // Find the next note after lastSeqNote
      let note2 = lastSeqNote.slice(0, -1);
      let oct2 = parseInt(lastSeqNote.slice(-1));
      let idx2 = NOTE_SEQUENCE.indexOf(note2);
      idx2 = (idx2 + 1) % 12;
      if (idx2 === 0) oct2++;
      const forwardStart = NOTE_SEQUENCE[idx2] + oct2;
      const forward_padding = getNoteRange(forwardStart, "B5");
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
  };

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
            onChange={handlePatternSelect}
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
            Root key: {ROOT_NOTES[rootIndex]}
          </div>
          <div style={{ margin: '8px 0', fontSize: 16 }}>
            Notes: {getPatternNotes().join(' - ')}
          </div>
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
          <button onClick={playChord} disabled={isPlaying} style={{ marginBottom: 8, padding: '8px 24px', fontSize: 16, background: isPlaying ? '#bbb' : '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: isPlaying ? 'not-allowed' : 'pointer' }}>
            ▶ Play
          </button>
          <button onClick={stopChord} disabled={!isPlaying} style={{ padding: '8px 24px', fontSize: 16, background: !isPlaying ? '#bbb' : '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, cursor: !isPlaying ? 'not-allowed' : 'pointer' }}>
            ■ Stop
          </button>
        </div>
      </div>
      {currentPattern && (
        <>
          <div style={{ height: 32 }} />
          <div style={{ textAlign: 'center', marginBottom: 8, color: '#555' }}>
            Tip: Drag or slide the pattern bar below to left or right to explore different chord positions.
          </div>
          <IntervalPattern
            pattern={currentPattern.pattern}
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

export default ChordsPattern;

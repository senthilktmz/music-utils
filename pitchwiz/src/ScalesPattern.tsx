import React, { useState, useRef } from "react";
import IntervalPattern from "./IntervalPattern";
import PianoKeyboard from "./PianoKeyboard";
import MiniKeyboard from "./MiniKeyboard";
import { SCALES_PATTERNS_ARRAY } from "./patterns/Scales";
import { INTERVAL_SEQUENCE, generateScalePattern } from "./patterns/patternUtils";
import { MAIN_KEYBOARD_PATTERN } from "./patterns/MainKeyboard";

const ROOT_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

interface ScalesPatternProps {
  zoom?: number;
}

const SCALES_PATTERNS = SCALES_PATTERNS_ARRAY.map(generateScalePattern);

const ScalesPattern: React.FC<ScalesPatternProps> = ({ zoom = 100 }) => {
  // Scale key widths and heights by zoom percent
  const KEY_WIDTH = 40 * (zoom / 100);
  const KEY_HEIGHT = 40 * (zoom / 100);
  const MINI_KEY_WIDTH = 280 * (zoom / 100);
  const MINI_KEY_HEIGHT = 80 * (zoom / 100);
  const KEYBOARD_LENGTH = MAIN_KEYBOARD_PATTERN.length;

  const [selectedPattern, setSelectedPattern] = useState<string>(SCALES_PATTERNS[0].name);
  const [rootIndex, setRootIndex] = useState(0); // index in ROOT_NOTES
  const [sliderOffsetX, setSliderOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const isStoppedRef = React.useRef(false);

  const currentPattern = SCALES_PATTERNS.find((p: any) => p.name === selectedPattern);

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

  const getPatternNotes = () => {
    if (!currentPattern) return [];
    return currentPattern.pattern
      .map((rect, i) => rect.type !== 'scale_interval_blank' ? i : null)
      .filter(i => i !== null)
      .map((i) => {
        const idx = (rootIndex + (i as number)) % 12;
        return ROOT_NOTES[idx];
      });
  };

  // Only pass sliderOffsetX to the slider when not dragging
  const sliderOffsetProp = isDragging ? undefined : sliderOffsetX;

  // Helper: Map note sequence to ascending frequencies starting from C4
  const getNoteFrequenciesForScale = (notes: string[]) => {
    const NOTE_TO_SEMITONE: Record<string, number> = { 'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11 };
    let octave: number = 4;
    let prevSemitone: number | null = null;
    return notes.map((note) => {
      const semitone = NOTE_TO_SEMITONE[note as keyof typeof NOTE_TO_SEMITONE];
      if (prevSemitone !== null && semitone <= prevSemitone) octave++;
      prevSemitone = semitone;
      const midiNumber = 12 * (octave + 1) + semitone - 12; // C4 = 60
      return 440 * Math.pow(2, (midiNumber - 69) / 12);
    });
  };

  const playScale = async () => {
    if (isPlaying) return;
    const notes = getPatternNotes();
    const freqs = getNoteFrequenciesForScale(notes);
    setIsPlaying(true);
    isStoppedRef.current = false;
    for (let i = 0; i < freqs.length; i++) {
      if (isStoppedRef.current) break;
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.08);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.32);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      gain.connect(ctx.destination);
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freqs[i];
      osc.connect(gain);
      osc.start();
      oscillatorsRef.current = [osc];
      await new Promise(res => setTimeout(res, 500));
      osc.stop();
      ctx.close();
      audioContextRef.current = null;
    }
    setIsPlaying(false);
  };

  const stopScale = () => {
    isStoppedRef.current = true;
    setIsPlaying(false);
    if (audioContextRef.current) {
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop(); } catch (e) {}
      });
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    oscillatorsRef.current = [];
  };

  return (
    <div>
      {/* Root key selector row and scale selection dropdown on same line */}
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
          <label htmlFor="pattern-select" style={{ fontWeight: 'bold' }}>Scale:</label>
          <select
            id="pattern-select"
            value={selectedPattern}
            onChange={(e) => setSelectedPattern(e.target.value)}
            style={{ fontSize: 16, padding: '4px 8px' }}
          >
            {SCALES_PATTERNS.map((p: any) => (
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
        <MiniKeyboard notes={getPatternNotes()} root={ROOT_NOTES[rootIndex]} width={MINI_KEY_WIDTH} height={MINI_KEY_HEIGHT} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 16 }}>
          <button onClick={playScale} disabled={isPlaying} style={{ marginBottom: 8, padding: '8px 24px', fontSize: 16, background: isPlaying ? '#bbb' : '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: isPlaying ? 'not-allowed' : 'pointer' }}>
            ▶ Play
          </button>
          <button onClick={stopScale} disabled={!isPlaying} style={{ padding: '8px 24px', fontSize: 16, background: !isPlaying ? '#bbb' : '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, cursor: !isPlaying ? 'not-allowed' : 'pointer' }}>
            ■ Stop
          </button>
        </div>
      </div>
      {currentPattern && (
        <>
          <div style={{ height: 32 }} />
          <div style={{ textAlign: 'center', marginBottom: 8, color: '#555' }}>
            Tip: Drag or slide the pattern bar below to left or right to explore different scale positions.
          </div>
          <IntervalPattern
            pattern={currentPattern.pattern}
            keyWidth={KEY_WIDTH}
            keyHeight={KEY_HEIGHT}
            keyboardWidth={KEY_WIDTH * KEYBOARD_LENGTH}
            totalKeys={KEYBOARD_LENGTH}
            slidable={true}
            onRootChange={handleSliderChange}
            offsetX={sliderOffsetProp}
          />
        </>
      )}
      <div style={{ marginTop: 8 }}>
        <PianoKeyboard keyWidth={KEY_WIDTH} keyHeight={KEY_HEIGHT * 3} />
      </div>
    </div>
  );
};

export default ScalesPattern;

import React, { useState } from "react";
import IntervalPattern from "./IntervalPattern";
import PianoKeyboard from "./PianoKeyboard";
import MiniKeyboard from "./MiniKeyboard";
import { SCALES_PATTERNS } from "./patterns/Scales";
import { MAIN_KEYBOARD_PATTERN } from "./patterns/MainKeyboard";

const KEY_WIDTH = 40;
const KEYBOARD_LENGTH = MAIN_KEYBOARD_PATTERN.length;
const ROOT_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const ScalesPattern: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<string>(SCALES_PATTERNS[0].name);
  const [rootIndex, setRootIndex] = useState(0); // index in ROOT_NOTES
  const [sliderOffsetX, setSliderOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const currentPattern = SCALES_PATTERNS.find((p) => p.name === selectedPattern);

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

  return (
    <div>
      {/* Root key selector row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '16px 0' }}>
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
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, justifyContent: 'center', marginBottom: 32 }}>
        <div style={{ flex: 1, maxWidth: 340 }}>
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <label htmlFor="pattern-select" style={{ marginRight: 8, fontWeight: 'bold' }}>Select Pattern:</label>
            <select
              id="pattern-select"
              value={selectedPattern}
              onChange={(e) => setSelectedPattern(e.target.value)}
              style={{ fontSize: 16, padding: '4px 8px' }}
            >
              {SCALES_PATTERNS.map((p) => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
            Root key: {ROOT_NOTES[rootIndex]}
          </div>
          <div style={{ textAlign: 'center', margin: '8px 0', fontSize: 16 }}>
            Notes: {getPatternNotes().join(' - ')}
          </div>
        </div>
        <MiniKeyboard notes={getPatternNotes()} root={ROOT_NOTES[rootIndex]} />
      </div>
      {currentPattern && (
        <>
          <div style={{ height: 32 }} />
          <IntervalPattern
            pattern={currentPattern.pattern}
            keyWidth={KEY_WIDTH}
            keyHeight={40}
            keyboardWidth={KEY_WIDTH * KEYBOARD_LENGTH}
            totalKeys={KEYBOARD_LENGTH}
            slidable={true}
            onRootChange={handleSliderChange}
            offsetX={sliderOffsetProp}
          />
        </>
      )}
      <div style={{ marginTop: 8 }}>
        <PianoKeyboard />
      </div>
    </div>
  );
};

export default ScalesPattern;

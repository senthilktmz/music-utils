import React, { useState } from "react";
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

  return (
    <div>
      {/* Root key selector row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '16px 0' }}>
        <select
          value={selectedPattern}
          onChange={e => setSelectedPattern(e.target.value)}
        >
          {SCALES_PATTERNS.map((p: any) => (
            <option key={p.name} value={p.name}>{p.name}</option>
          ))}
        </select>
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
              {SCALES_PATTERNS.map((p: any) => (
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
        <MiniKeyboard notes={getPatternNotes()} root={ROOT_NOTES[rootIndex]} width={MINI_KEY_WIDTH} height={MINI_KEY_HEIGHT} />
      </div>
      {currentPattern && (
        <>
          <div style={{ height: 32 }} />
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

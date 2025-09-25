import React, { useState } from "react";
import IntervalPattern from "./IntervalPattern";
import PianoKeyboard from "./PianoKeyboard";
import MiniKeyboard from "./MiniKeyboard";
import { SCALES_PATTERNS } from "./patterns/Scales";
import { MAIN_KEYBOARD_PATTERN } from "./patterns/MainKeyboard";

const ScalesPattern: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<string>(SCALES_PATTERNS[0].name);
  const [rootIndex, setRootIndex] = useState(0);
  const currentPattern = SCALES_PATTERNS.find((p) => p.name === selectedPattern);

  const getPatternNotes = () => {
    if (!currentPattern) return [];
    // Only include notes for non-blank pattern members
    return currentPattern.pattern
      .map((rect, i) => rect.type !== 'scale_interval_blank' ? i : null)
      .filter(i => i !== null)
      .map((i) => {
        const idx = (rootIndex + (i as number)) % MAIN_KEYBOARD_PATTERN.length;
        return MAIN_KEYBOARD_PATTERN[idx].label;
      });
  };

  return (
    <div>
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
            Root key: {MAIN_KEYBOARD_PATTERN[rootIndex]?.label}
          </div>
          <div style={{ textAlign: 'center', margin: '8px 0', fontSize: 16 }}>
            Notes: {getPatternNotes().join(' - ')}
          </div>
        </div>
        <MiniKeyboard notes={getPatternNotes()} root={MAIN_KEYBOARD_PATTERN[rootIndex]?.label} />
      </div>
      {currentPattern && (
        <>
          <div style={{ height: 32 }} />
          <IntervalPattern
            pattern={currentPattern.pattern}
            keyWidth={40}
            keyHeight={40}
            keyboardWidth={40 * 36}
            totalKeys={36}
            slidable={true}
            onRootChange={setRootIndex}
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

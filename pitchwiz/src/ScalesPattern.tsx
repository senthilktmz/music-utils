import React, { useState } from "react";
import IntervalPattern from "./IntervalPattern";
import PianoKeyboard from "./PianoKeyboard";
import { SCALES_PATTERNS } from "./patterns/Scales";
import { MAIN_KEYBOARD_PATTERN } from "./patterns/MainKeyboard";

const ScalesPattern: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<string>(SCALES_PATTERNS[0].name);
  const currentPattern = SCALES_PATTERNS.find((p) => p.name === selectedPattern);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="pattern-select" style={{ marginRight: 8 }}>Select Pattern:</label>
        <select
          id="pattern-select"
          value={selectedPattern}
          onChange={(e) => setSelectedPattern(e.target.value)}
        >
          {SCALES_PATTERNS.map((p) => (
            <option key={p.name} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>
      {currentPattern && (
        <IntervalPattern
          pattern={currentPattern.pattern}
          keyWidth={40}
          keyHeight={40}
          keyboardWidth={40 * 36}
          totalKeys={36}
          slidable={true}
        />
      )}
      <div style={{ marginTop: 8 }}>
        <PianoKeyboard />
      </div>
    </div>
  );
};

export default ScalesPattern;

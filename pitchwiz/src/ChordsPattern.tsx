import React, { useState } from "react";
import IntervalPattern from "./IntervalPattern";
import PianoKeyboard from "./PianoKeyboard";
import { CHORDS_PATTERNS } from "./DefineChordPatterns";

const ChordsPattern: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<string>(CHORDS_PATTERNS[0].name);
  const currentPattern = CHORDS_PATTERNS.find((p) => p.name === selectedPattern);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="chord-pattern-select" style={{ marginRight: 8 }}>Select Chord Pattern:</label>
        <select
          id="chord-pattern-select"
          value={selectedPattern}
          onChange={(e) => setSelectedPattern(e.target.value)}
        >
          {CHORDS_PATTERNS.map((p) => (
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

export default ChordsPattern;

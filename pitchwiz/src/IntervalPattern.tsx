import React from "react";
import PianoPattern from "./PianoPattern";

const NOTE_SEQUENCE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

interface IntervalPatternProps {
  pattern: { label: string; color: string; type: string }[];
  keyWidth: number;
  keyHeight: number;
  keyboardWidth: number;
  totalKeys: number;
  slidable?: boolean;
  octaves?: number;
}

const IntervalPattern: React.FC<IntervalPatternProps> = ({ pattern, keyWidth, keyHeight, keyboardWidth, totalKeys, slidable = true, octaves = 2 }) => {
  // Instead of overlaying on a keyboard, just pass the pattern directly to PianoPattern
  return <PianoPattern pattern={pattern} keyWidth={keyWidth} keyHeight={keyHeight} slidable={slidable} />;
};

export default IntervalPattern;

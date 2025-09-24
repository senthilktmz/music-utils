import React from "react";
import PianoPattern from "./PianoPattern";
import { MAIN_KEYBOARD_PATTERN } from "./patterns/MainKeyboard";

interface PianoKeyboardProps {
  octaves?: number;
  keyWidth?: number;
  keyHeight?: number;
}

const PianoKeyboard: React.FC = () => {
  return <PianoPattern pattern={MAIN_KEYBOARD_PATTERN} keyWidth={40} keyHeight={120} slidable={false} />;
};

export default PianoKeyboard;

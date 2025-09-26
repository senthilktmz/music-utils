import React, { useState } from "react";
// import logo from "./logo.svg"; // Remove unused default logo
import "./App.css";
import MenuBar from "./MenuBar";
import PianoKeyboard from "./PianoKeyboard";
import IntervalPattern from "./IntervalPattern";
import ScalesMulti from "./ScalesMulti";
import ChordsMulti from "./ChordsMulti";
import Intervals from "./Intervals";
import { SCALES_PATTERNS_ARRAY } from "./patterns/Scales";
import { RAGAS_PATTERNS_ARRAY } from "./patterns/Ragas";
import { generateScalePattern } from "./patterns/patternUtils";

function App() {
  const [activeTab, setActiveTab] = useState("chords");

  let content;
  if (activeTab === "chords") content = <ChordsMulti />;
  else if (activeTab === "scales") content = <ScalesMulti patterns={SCALES_PATTERNS_ARRAY.map(generateScalePattern)} />;
  else if (activeTab === "carnatic_scales") content = <ScalesMulti patterns={RAGAS_PATTERNS_ARRAY.map(generateScalePattern)} />;
  else if (activeTab === "intervals") content = <Intervals />;

  return (
    <div className="App">
      <MenuBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ padding: '24px 0 0 0' }}>{content}</div>
      {/* Main content follows header */}
    </div>
  );
}

export default App;

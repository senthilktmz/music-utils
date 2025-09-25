import React, { useState } from "react";
// import logo from "./logo.svg"; // Remove unused default logo
import "./App.css";
import MenuBar from "./MenuBar";
import PianoKeyboard from "./PianoKeyboard";
import IntervalPattern from "./IntervalPattern";
import ScalesPattern from "./ScalesPattern";
import ChordsPattern from "./ChordsPattern";
import Intervals from "./Intervals";
import { SCALES_PATTERNS } from "./patterns/Scales";

function App() {
  const [activeTab, setActiveTab] = useState("intervals");

  let content;
  if (activeTab === "intervals") content = <Intervals />;
  else if (activeTab === "scales") content = <ScalesPattern />;
  else if (activeTab === "chords") content = <ChordsPattern />;

  return (
    <div className="App">
      <MenuBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ padding: '24px 0 0 0' }}>{content}</div>
      {/* Main content follows header */}
    </div>
  );
}

export default App;

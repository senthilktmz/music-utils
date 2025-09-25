import React, { useState } from "react";
import PianoKeyboard from "./PianoKeyboard";
import IntervalPattern from "./IntervalPattern";
import ScalesPattern from "./ScalesPattern";
import ChordsPattern from "./ChordsPattern";
import Intervals from "./Intervals";
import { SCALES_PATTERNS_ARRAY } from "./patterns/Scales";
import { generateScalePattern } from "./patterns/patternUtils";

const SCALES_PATTERNS = SCALES_PATTERNS_ARRAY.map(generateScalePattern);

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const [scalesPatternCount, setScalesPatternCount] = useState(1);
  const [chordsPatternCount, setChordsPatternCount] = useState(1);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", height: '56px' }}>
        <button
          style={{
            padding: "10px 24px",
            border: "none",
            borderBottom: activeTab === "intervals" ? "3px solid #007bff" : "none",
            background: "none",
            fontWeight: activeTab === "intervals" ? "bold" : "normal",
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("intervals")}
        >
          Intervals
        </button>
        <button
          style={{
            padding: "10px 24px",
            border: "none",
            borderBottom: activeTab === "scales" ? "3px solid #007bff" : "none",
            background: "none",
            fontWeight: activeTab === "scales" ? "bold" : "normal",
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("scales")}
        >
          Scales
        </button>
        <button
          style={{
            padding: "10px 24px",
            border: "none",
            borderBottom: activeTab === "chords" ? "3px solid #007bff" : "none",
            background: "none",
            fontWeight: activeTab === "chords" ? "bold" : "normal",
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("chords")}
        >
          Chords
        </button>
      </div>
      <div style={{ flex: 1 }}>
        {activeTab === "intervals" && (
          <div>
            <Intervals />
          </div>
        )}
        {activeTab === "scales" && (
          <div>
            {[...Array(scalesPatternCount)].map((_, idx) => (
              <div key={idx} style={{ marginBottom: 32 }}>
                <ScalesPattern />
                <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
                  <button
                    onClick={() => setScalesPatternCount(scalesPatternCount + 1)}
                    style={{
                      borderRadius: "50%",
                      width: 40,
                      height: 40,
                      fontSize: 24,
                      background: "#007bff",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                    }}
                    aria-label="Add Pattern"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === "chords" && (
          <div>
            {[...Array(chordsPatternCount)].map((_, idx) => (
              <div key={idx} style={{ marginBottom: 32 }}>
                <ChordsPattern />
                <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
                  <button
                    onClick={() => setChordsPatternCount(chordsPatternCount + 1)}
                    style={{
                      borderRadius: "50%",
                      width: 40,
                      height: 40,
                      fontSize: 24,
                      background: "#007bff",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                    }}
                    aria-label="Add Chord Pattern"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tabs;

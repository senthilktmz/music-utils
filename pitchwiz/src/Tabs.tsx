import React, { useState } from "react";
import PianoKeyboard from "./PianoKeyboard";
import IntervalPattern from "./IntervalPattern";
import ScalesPattern from "./ScalesPattern";
import ChordsPattern from "./ChordsPattern";
import { SCALES_PATTERNS } from "./patterns/Scales";

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("intervals");
  const [scalesPatternCount, setScalesPatternCount] = useState(1);

  return (
    <div>
      <div style={{ display: "flex", borderBottom: "2px solid #ccc", marginBottom: 16 }}>
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
      <div>
        {activeTab === "intervals" && (
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
          <div style={{ padding: 16 }}>
            <ChordsPattern />
          </div>
        )}
      </div>
    </div>
  );
};

export default Tabs;

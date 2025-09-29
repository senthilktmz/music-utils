import "./Intervals.css";
import React, { useState } from "react";

const intervalMatrix = [
  ["", "1", "♭2", "2", "♭3", "3", "4", "♭5", "5", "♭6", "6", "♭7", "7"],
  ["UNISON", "1", "", "", "", "", "", "", "", "", "", "", ""],
  ["MINOR 2ND", "1", "♭2", "", "", "", "", "", "", "", "", "", ""],
  ["MAJOR 2ND", "1", "♭2", "2", "", "", "", "", "", "", "", "", ""],
  ["MINOR 3RD", "1", "♭2", "2", "♭3", "", "", "", "", "", "", "", ""],
  ["MAJOR 3RD", "1", "♭2", "2", "♭3", "3", "", "", "", "", "", "", ""],
  ["PERFECT 4TH", "1", "♭2", "2", "♭3", "3", "4", "", "", "", "", "", ""],
  ["DIMINISHED 5TH", "1", "♭2", "2", "♭3", "3", "4", "♭5", "", "", "", "", ""],
  ["PERFECT 5TH", "1", "♭2", "2", "♭3", "3", "4", "♭5", "5", "", "", "", ""],
  ["MINOR 6TH", "1", "♭2", "2", "♭3", "3", "4", "♭5", "5", "♭6", "", "", ""],
  ["MAJOR 6TH", "1", "♭2", "2", "♭3", "3", "4", "♭5", "5", "♭6", "6", "", ""],
  ["MINOR 7TH", "1", "♭2", "2", "♭3", "3", "4", "♭5", "5", "♭6", "6", "♭7", ""],
  ["MAJOR 7TH", "1", "♭2", "2", "♭3", "3", "4", "♭5", "5", "♭6", "6", "♭7", "7"]
];

const intervalDescriptions = [
  ["UNISON", "0 STEPS"],
  ["MINOR 2ND", "½ STEP"],
  ["MAJOR 2ND", "1 WHOLE STEP"],
  ["MINOR 3RD", "1½ STEPS"],
  ["MAJOR 3RD", "2 WHOLE STEPS"],
  ["PERFECT 4TH", "2½ STEPS"],
  ["DIMINISHED 5TH", "3 WHOLE STEPS"],
  ["PERFECT 5TH", "3½ STEPS"],
  ["MINOR 6TH", "4 WHOLE STEPS"],
  ["MAJOR 6TH", "4½ STEPS"],
  ["MINOR 7TH", "5 WHOLE STEPS"],
  ["MAJOR 7TH", "5½ STEPS"]
];

const LEGEND_TYPES = [
  { label: "Unison", className: "unison" },
  { label: "Minor", className: "minor" },
  { label: "Major", className: "major" },
  { label: "Perfect", className: "perfect" },
  { label: "Diminished", className: "diminished" },
];

const ROW_TYPE = [
  "unison",   // 1
  "minor",    // 2
  "major",    // 3
  "minor",    // 4
  "major",    // 5
  "perfect",  // 6
  "diminished",// 7
  "perfect",  // 8
  "minor",    // 9
  "major",    // 10
  "minor",    // 11
  "major"     // 12
];

const getRowColor = (rowIdx: number) => {
  switch (rowIdx) {
    case 1: return "unison";
    case 2: return "minor";
    case 3: return "major";
    case 4: return "minor";
    case 5: return "major";
    case 6: return "perfect";
    case 7: return "diminished";
    case 8: return "perfect";
    case 9: return "minor";
    case 10: return "major";
    case 11: return "minor";
    case 12: return "major";
    default: return "";
  }
};

const Intervals: React.FC = () => {
  const [activeTypes, setActiveTypes] = useState<string[]>([]);

  const toggleType = (type: string) => {
    setActiveTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const showAll = activeTypes.length === 0;

  return (
    <div className="intervals-container">
      <h2>Musical Intervals Reference</h2>
      <table className="intervals-table">
        <thead>
          <tr>
            <th>Interval</th>
            <th>Description</th>
            {intervalMatrix[0].slice(1).map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {intervalMatrix.slice(1).map((row, rowIdx) => {
            const rowType = ROW_TYPE[rowIdx];
            if (!showAll && !activeTypes.includes(rowType)) return null;
            const intervalCells = row.slice(1);
            const firstIdx = intervalCells.findIndex(cell => cell !== "");
            const lastIdx = intervalCells.length - 1 - [...intervalCells].reverse().findIndex(cell => cell !== "");
            return (
              <tr key={rowIdx} className={getRowColor(rowIdx + 1)}>
                <td>{row[0]}</td>
                <td>{intervalDescriptions[rowIdx][1]}</td>
                {intervalCells.map((cell, colIdx) => {
                  if (!cell) return <td key={colIdx}></td>;
                  if (colIdx === firstIdx || colIdx === lastIdx) {
                    return <td key={colIdx}><b>{cell}</b></td>;
                  }
                  return <td key={colIdx} style={{ color: '#bbb' }}>{cell}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="intervals-legend">
        {LEGEND_TYPES.map((legend, idx) => (
          <button
            key={legend.className}
            className={`legend-btn ${legend.className}${activeTypes.includes(legend.className) ? ' active' : ''}`}
            onClick={() => toggleType(legend.className)}
          >
            {legend.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Intervals;

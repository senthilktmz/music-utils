import React, { useState } from "react";
import ScalesPattern from "./ScalesPattern";

// Use highly contrasting colors
const ROW_COLORS = ["#ffe082", "#90caf9", "#ffab91", "#a5d6a7"]; // yellow, blue, orange, green

const ScalesMulti: React.FC = () => {
  const [instances, setInstances] = useState<number[]>([0]);
  const [nextId, setNextId] = useState(1);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const handleAdd = () => {
    setInstances((prev) => [...prev, nextId]);
    setNextId((id) => id + 1);
  };

  const handleSelect = (idx: number) => setSelectedIdx(idx);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        {instances.map((id, idx) => (
          <div
            key={id}
            style={{
              background: ROW_COLORS[idx % ROW_COLORS.length],
              borderRadius: 10,
              padding: 12,
              border: idx === selectedIdx ? '4px solid #222' : '2px solid #bbb',
              boxShadow: idx === selectedIdx ? '0 0 12px #2224' : undefined,
              cursor: 'pointer',
              transition: 'border 0.2s, box-shadow 0.2s'
            }}
            onClick={() => handleSelect(idx)}
          >
            <ScalesPattern />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '36px 0 24px 0', justifyContent: 'center' }}>
        <button
          aria-label="Add scale view"
          onClick={handleAdd}
          style={{
            border: 'none',
            background: '#1976d2',
            color: 'white',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #0002',
          }}
        >
          <span style={{ fontSize: 24, fontWeight: "bold" }}>+</span>
        </button>
        <span style={{ fontWeight: 'bold', fontSize: 18 }}>Scales</span>
      </div>
    </div>
  );
};

export default ScalesMulti;

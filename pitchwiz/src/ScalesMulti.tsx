import React, { useState, useEffect } from "react";
import ScalesPattern from "./ScalesPattern";

// Use highly contrasting colors
const ROW_COLORS = ["#ffe082", "#90caf9", "#ffab91", "#a5d6a7"]; // yellow, blue, orange, green
const KEY_WIDTH = 40;
const KEYBOARD_LENGTH = 36; // matches MAIN_KEYBOARD_PATTERN.length
const HORIZONTAL_MARGIN = 24; // px, matches marginLeft/marginRight

const ScalesMulti: React.FC = () => {
  const [instances, setInstances] = useState<number[]>([0]);
  const [nextId, setNextId] = useState(1);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [zoom, setZoom] = useState(60); // percent
  const [maxZoom, setMaxZoom] = useState(120);

  // Dynamically calculate maxZoom so keyboard never overflows window
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth - 2 * HORIZONTAL_MARGIN - 48; // allow some margin and scrollbar/extra
      const max = Math.floor((windowWidth / (KEY_WIDTH * KEYBOARD_LENGTH)) * 100);
      setMaxZoom(Math.max(30, Math.min(120, max)));
      // Clamp zoom if above new max
      setZoom(z => Math.min(z, Math.max(30, Math.min(120, max))));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAdd = () => {
    setInstances((prev) => [...prev, nextId]);
    setNextId((id) => id + 1);
  };

  const handleSelect = (idx: number) => setSelectedIdx(idx);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <label style={{ fontWeight: 'bold' }}>Zoom:</label>
        <input
          type="range"
          min={30}
          max={maxZoom}
          step={1}
          value={zoom}
          onChange={e => setZoom(Math.min(Number(e.target.value), maxZoom))}
          style={{ width: 120 }}
        />
        <span>{zoom}%</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36, marginLeft: 24, marginRight: 24 }}>
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
            <ScalesPattern zoom={zoom} />
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

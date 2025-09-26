import React, { useState, useEffect } from "react";
import ChordsPattern from "./ChordsPattern";

const ROW_COLORS = ["#ffe082", "#90caf9", "#ffab91", "#a5d6a7"];
const KEY_WIDTH = 40;
const KEYBOARD_LENGTH = 36;
const HORIZONTAL_MARGIN = 24;

const TrashIcon = () => (
  <span style={{ fontWeight: "bold", fontSize: 22, color: "#b71c1c", pointerEvents: "none" }}>&#128465;</span>
);

interface Instance { id: number; }

const ChordsMulti: React.FC<{ addScratchPadItem: (item: any) => void }> = ({ addScratchPadItem }) => {
  const [instances, setInstances] = useState<Instance[]>([{ id: 0 }]);
  const [nextId, setNextId] = useState(1);
  const [selectedId, setSelectedId] = useState(0);
  const [zoom, setZoom] = useState(60); // percent
  const [maxZoom, setMaxZoom] = useState(120);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth - 2 * HORIZONTAL_MARGIN - 48;
      const max = Math.floor((windowWidth / (KEY_WIDTH * KEYBOARD_LENGTH)) * 100);
      const clampedMax = Math.max(30, Math.min(120, max));
      setMaxZoom(clampedMax);
      setZoom(clampedMax); // Set zoom to maxZoom by default
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAdd = () => {
    setInstances((prev) => [...prev, { id: nextId }]);
    setNextId((id) => id + 1);
  };

  const handleSelect = (id: number) => setSelectedId(id);
  const handleRemove = (id: number) => {
    setInstances((prev) => {
      const filtered = prev.filter(x => x.id !== id);
      setSelectedId((prevId) => {
        if (filtered.length === 0) return 0;
        if (prevId === id) return filtered[0].id;
        return prevId;
      });
      return filtered;
    });
  };

  return (
    <div>
      {/* Zoom selection hidden as per user request */}
      {/* <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
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
      </div> */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36, marginLeft: 24, marginRight: 24 }}>
        {instances.map((instance) => (
          <div
            key={instance.id}
            style={{
              background: ROW_COLORS[instance.id % ROW_COLORS.length],
              borderRadius: 10,
              padding: 12,
              border: instance.id === selectedId ? '4px solid #222' : '2px solid #bbb',
              boxShadow: instance.id === selectedId ? '0 0 12px #2224' : undefined,
              cursor: 'pointer',
              transition: 'border 0.2s, box-shadow 0.2s',
              position: 'relative'
            }}
            onClick={() => handleSelect(instance.id)}
          >
            <button
              onClick={e => { e.stopPropagation(); handleRemove(instance.id); }}
              style={{
                position: 'absolute', top: 8, right: 8, zIndex: 2,
                background: '#e53935', color: 'white', border: 'none',
                borderRadius: '50%', width: 22, height: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, cursor: 'pointer',
                boxShadow: '0 2px 8px #0002',
                padding: 0
              }}
              aria-label="Remove instance"
              tabIndex={0}
            >
              <span style={{ fontSize: 16, fontWeight: "bold", lineHeight: 1 }}>&#10005;</span>
            </button>
            <ChordsPattern zoom={zoom} addScratchPadItem={addScratchPadItem} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '36px 0 24px 0', justifyContent: 'center' }}>
        <button
          aria-label="Add chord view"
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
        <span style={{ fontWeight: 'bold', fontSize: 18 }}>Chords</span>
      </div>
    </div>
  );
};

export default ChordsMulti;

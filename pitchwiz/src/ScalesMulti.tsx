import React, { useState, useEffect } from "react";
import ScalesPattern from "./ScalesPattern";

const ROW_COLORS = ["#ffe082", "#90caf9", "#ffab91", "#a5d6a7"];
const KEY_WIDTH = 40;
const KEYBOARD_LENGTH = 36;
const HORIZONTAL_MARGIN = 24;

const TrashIcon = () => (
  <span style={{ fontWeight: "bold", fontSize: 22, color: "#b71c1c", pointerEvents: "none" }}>&#128465;</span>
);

interface Instance { id: number; }

interface ScalesMultiProps {
  patterns: any[];
  scalesPatternType: string;
  ragasPatterns: Record<string, string[]> | any[];
}

const ScalesMulti: React.FC<ScalesMultiProps> = ({ patterns, scalesPatternType, ragasPatterns }) => {
  const [instances, setInstances] = useState<Instance[]>([{ id: 0 }]);
  const [nextId, setNextId] = useState(1);
  const [selectedId, setSelectedId] = useState(0);
  const [zoom, setZoom] = useState(60); // percent
  const [maxZoom, setMaxZoom] = useState(120);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth - 2 * HORIZONTAL_MARGIN - 24;
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
    setInstances((prev) => prev.filter(x => x.id !== id));
    setSelectedId((prevId) => prevId === id ? 0 : prevId);
  };

  return (
    <div>
      {instances.map(({ id }) => (
        <div key={id} style={{ marginBottom: 32, border: selectedId === id ? '2px solid #1976d2' : '2px solid #eee', borderRadius: 8, background: selectedId === id ? '#e3f2fd' : '#fff', boxShadow: selectedId === id ? '0 2px 8px #90caf9' : '0 2px 8px #eee', padding: 14, position: 'relative' }}>
          <button
            onClick={() => handleRemove(id)}
            style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: 'pointer' }}
            title="Remove this instance"
          >
            <span style={{ fontSize: 16, fontWeight: "bold", lineHeight: 1 }}>&#10005;</span>
          </button>
          <ScalesPattern zoom={zoom} patterns={patterns} scalesPatternType={scalesPatternType} ragasPatterns={ragasPatterns} />
        </div>
      ))}
      <button
        onClick={handleAdd}
        style={{ marginTop: 8, background: '#1976d2', color: 'white', border: 'none', borderRadius: '50%', width: 48, height: 48, fontSize: 32, cursor: 'pointer', boxShadow: '0 2px 8px #90caf9', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
        title="Add another instance"
      >
        +
      </button>
    </div>
  );
};

export default ScalesMulti;

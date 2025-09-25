import React, { useState } from "react";
import ChordsPattern from "./ChordsPattern";

const ChordsMulti: React.FC = () => {
  const [instances, setInstances] = useState<number[]>([0]);
  const [nextId, setNextId] = useState(1);

  const handleAdd = () => {
    setInstances((prev) => [...prev, nextId]);
    setNextId((id) => id + 1);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        {instances.map((id) => (
          <ChordsPattern key={id} />
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

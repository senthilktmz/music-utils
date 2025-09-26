import React from "react";

interface ScratchPadProps {
  items: Array<{ root: string; type: string; notes: string[]; timestamp: number }>;
}

const ScratchPad: React.FC<ScratchPadProps> = ({ items }) => (
  <div style={{ padding: 40 }}>
    <h2 style={{ textAlign: 'center', color: '#444' }}>Scratch Pad</h2>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
        gap: 18,
        marginTop: 32,
        justifyItems: 'center',
        alignItems: 'center',
      }}
    >
      {items.map((item, idx) => (
        <div
          key={item.timestamp + '-' + idx}
          style={{
            width: 80,
            height: 80,
            background: '#f5f8fa',
            border: '2px solid #1976d2',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: 16,
            color: '#1976d2',
            boxShadow: '0 2px 8px #0001',
            cursor: 'pointer',
            userSelect: 'none',
            textAlign: 'center',
            overflow: 'hidden',
            whiteSpace: 'pre-line',
          }}
          title={`${item.root} ${item.type}\nNotes: ${item.notes.join(' - ')}`}
        >
          {item.root} {item.type}
        </div>
      ))}
    </div>
  </div>
);

export default ScratchPad;

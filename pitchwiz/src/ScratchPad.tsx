import React from "react";
import MiniKeyboard from "./MiniKeyboard";

interface ScratchPadProps {
  items: Array<{ root: string; type: string; notes: string[]; noteFrequencies: number[]; timestamp: number }>;
  removeItem: (timestamp: number) => void;
}

const ScratchPad: React.FC<ScratchPadProps> = ({ items, removeItem }) => {
  const playChord = (noteFrequencies: number[]) => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.08);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.92);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    gain.connect(ctx.destination);
    const oscillators = noteFrequencies.map(f => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      osc.connect(gain);
      return osc;
    });
    oscillators.forEach(osc => osc.start());
    setTimeout(() => {
      oscillators.forEach(osc => { try { osc.stop(); } catch (e) {} });
      ctx.close();
    }, 1000);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2 style={{ textAlign: 'center', color: '#444' }}>Scratch Pad</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '12px',
          marginTop: 32,
          justifyItems: 'center',
          alignItems: 'center',
        }}
      >
        {items.map((item, idx) => (
          <div
            key={item.timestamp + '-' + idx}
            style={{
              width: 120,
              height: 78,
              background: '#f5f8fa',
              border: '2px solid #1976d2',
              borderRadius: 12,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px #0001',
              cursor: 'pointer',
              userSelect: 'none',
              position: 'relative',
              margin: 'auto',
              paddingTop: 2,
              overflow: 'visible'
            }}
            onClick={() => playChord(item.noteFrequencies)}
          >
            {item.notes && item.root ? (
              <MiniKeyboard notes={item.notes} root={item.root} width={100} height={32} />
            ) : null}
            <div style={{ fontSize: 12, color: '#1976d2', fontWeight: 500, marginTop: 2, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100 }}>
              {item.type.split('/')[0].trim()}
            </div>
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: '#e53935',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 3
              }}
              title="Remove from Scratch Pad"
              onClick={e => { e.stopPropagation(); removeItem(item.timestamp); }}
            >
              -
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScratchPad;

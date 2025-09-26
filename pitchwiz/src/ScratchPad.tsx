import React from "react";

interface ScratchPadProps {
  items: Array<{ root: string; type: string; notes: string[]; timestamp: number; noteFrequencies: number[] }>;
}

const ScratchPad: React.FC<ScratchPadProps> = ({ items }) => {
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
              fontSize: 14,
              color: '#1976d2',
              boxShadow: '0 2px 8px #0001',
              cursor: 'pointer',
              userSelect: 'none',
              textAlign: 'center',
              overflow: 'hidden',
              whiteSpace: 'pre-line',
              position: 'relative'
            }}
            onClick={() => playChord(item.noteFrequencies)}
          >
            {`${item.root} ${item.type.split('/')[0].trim()}`}
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: '#1976d2',
                color: '#fff',
                fontWeight: 700,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 2
              }}
              title={`Root: ${item.root}\nType: ${item.type}\nNotes: ${item.notes.join(' - ')}`}
              onClick={e => { e.stopPropagation(); alert(`Root: ${item.root}\nType: ${item.type}\nNotes: ${item.notes.join(' - ')}`); }}
            >
              i
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScratchPad;

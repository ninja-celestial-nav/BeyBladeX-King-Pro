import { useState, useEffect } from 'react';
import { Minus, Plus, Monitor, XCircle, RotateCcw } from 'lucide-react';
import useInventoryStore from '../store/useInventoryStore';
import { getPartById } from '../data/partsDatabase';
import { getPartImage } from '../data/partImages';
import { playClick } from '../utils/audio';

export default function ScoreboardPage() {
  const { currentDeck } = useInventoryStore();
  const [scoreP1, setScoreP1] = useState(0);
  const [scoreP2, setScoreP2] = useState(0);
  const [deckP1, setDeckP1] = useState(null);
  
  useEffect(() => {
    // Load current deck as Player 1's deck for display
    const d = Object.values(currentDeck).filter(s => s.blade && s.ratchet && s.bit);
    if(d.length > 0) setDeckP1(d);
  }, [currentDeck]);

  const addScore = (player, pts) => {
    playClick();
    if (player === 1) setScoreP1(s => Math.min(s + pts, 7));
    if (player === 2) setScoreP2(s => Math.min(s + pts, 7));
  };
  
  const reset = () => {
    setScoreP1(0);
    setScoreP2(0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log("Error attempting to enable fullscreen:", err.message);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>📺 賽事大螢幕 SCOREBOARD</h1>
          <p>全螢幕計分板模式</p>
        </div>
        <button className="btn btn-accent" onClick={toggleFullscreen}>
          <Monitor size={18} /> 全螢幕切換
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: 20, marginTop: 20 }}>
        <PlayerScore name="PLAYER 1" score={scoreP1} add={pts => addScore(1, pts)} sub={() => setScoreP1(Math.max(scoreP1 - 1, 0))} color="#ff416c" deck={deckP1} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 60 }}>
          <div style={{ fontSize: 48, fontWeight: 900, fontFamily: 'Orbitron', color: 'var(--text-muted)' }}>VS</div>
          <button className="btn btn-ghost" onClick={reset} style={{ marginTop: 20 }}><RotateCcw size={20} /></button>
        </div>
        <PlayerScore name="PLAYER 2" score={scoreP2} add={pts => addScore(2, pts)} sub={() => setScoreP2(Math.max(scoreP2 - 1, 0))} color="#64b5f6" />
      </div>
    </div>
  );
}

function PlayerScore({ name, score, add, sub, color, deck }) {
  return (
    <div style={{ flex: 1, background: 'var(--bg-card)', borderRadius: 20, padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', border: `2px solid ${color}44`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: color }}></div>
      <h2 style={{ fontSize: 24, margin: '0 0 20px 0', color: 'var(--text-primary)', fontFamily: 'Orbitron', letterSpacing: 2 }}>{name}</h2>
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 160, fontWeight: 900, fontFamily: 'Orbitron', color, lineHeight: 1, textShadow: `0 0 40px ${color}66` }}>
          {score}
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', marginBottom: 20 }}>
        <button className="btn" onClick={() => add(1)} style={{ background: `${color}22`, color, border: `1px solid ${color}66`, padding: '15px' }}>
          SPIN / OVER<br/><strong style={{ fontSize: 20 }}>+1</strong>
        </button>
        <button className="btn" onClick={() => add(2)} style={{ background: `${color}22`, color, border: `1px solid ${color}66`, padding: '15px' }}>
          BURST<br/><strong style={{ fontSize: 20 }}>+2</strong>
        </button>
        <button className="btn" onClick={() => add(3)} style={{ background: `${color}44`, color, border: `1px solid ${color}`, padding: '15px', gridColumn: 'span 2' }}>
          XTREME FINISH<br/><strong style={{ fontSize: 20 }}>+3</strong>
        </button>
      </div>

      <button className="btn btn-ghost" onClick={sub} style={{ color: 'var(--text-muted)' }}><Minus size={18} /> 扣除一分</button>

      {/* Deck Preview */}
      {deck && deck.length > 0 && (
        <div style={{ display: 'flex', gap: 10, marginTop: 20, width: '100%', justifyContent: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: 20 }}>
          {deck.map((slot, i) => {
            const b = getPartById(slot.blade);
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={getPartImage(b.id)} alt={b.name} style={{ width: 40, height: 40, objectFit: 'contain', background: 'var(--bg-glass)', borderRadius: 8 }} onError={(e) => e.target.style.display='none'} />
                <div style={{ fontSize: 10, marginTop: 4, color: 'var(--text-secondary)' }}>{b.name}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}

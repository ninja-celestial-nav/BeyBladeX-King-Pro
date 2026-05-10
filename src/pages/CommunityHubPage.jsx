import { useState, useEffect } from 'react';
import { Users, Copy, Download, Share2, Check } from 'lucide-react';
import { getPartById } from '../data/partsDatabase';
import { getPartImage } from '../data/partImages';
import { playClick } from '../utils/audio';
import useInventoryStore from '../store/useInventoryStore';

const META_DECKS = [
  {
    name: '2026 世界賽冠軍配置',
    author: 'World Champ',
    deck: {
      slot1: { blade: 'wizard-rod', ratchet: 'r-9-60', bit: 'b-ball', role: '先鋒' },
      slot2: { blade: 'phoenix-wing', ratchet: 'r-5-60', bit: 'b-hexa', role: '中堅' },
      slot3: { blade: 'cobalt-dragoon', ratchet: 'r-1-60', bit: 'b-cyclone', role: '大將' }
    }
  },
  {
    name: '極致攻擊陣型',
    author: 'AggroMaster',
    deck: {
      slot1: { blade: 'shark-edge', ratchet: 'r-3-60', bit: 'b-low-flat', role: '先鋒' },
      slot2: { blade: 'dran-buster-ux', ratchet: 'r-1-60', bit: 'b-flat', role: '中堅' },
      slot3: { blade: 'tyranno-beat', ratchet: 'r-4-60', bit: 'b-quake', role: '大將' }
    }
  }
];

export default function CommunityHubPage() {
  const { currentDeck } = useInventoryStore();
  const [sharedDeck, setSharedDeck] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const deckCode = params.get('deck');
    if (deckCode) {
      try {
        const decoded = JSON.parse(atob(deckCode));
        if (decoded.slot1 && decoded.slot2 && decoded.slot3) {
          setSharedDeck(decoded);
        }
      } catch (e) {
        console.error('無效的牌組代碼', e);
      }
    }
  }, []);

  const copyLink = (deckObj) => {
    playClick();
    const code = btoa(JSON.stringify(deckObj));
    const url = `${window.location.origin}/?deck=${code}#community`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const importDeck = (deckObj) => {
    playClick();
    useInventoryStore.setState({ currentDeck: deckObj });
    alert('已成功匯入至你的牌組構築區！請前往牌組頁面查看。');
  };

  return (
    <div>
      <div className="page-header">
        <h1>🌐 社群大廳 COMMUNITY</h1>
        <p>探索 META 牌組與匯入玩家分享的配置</p>
      </div>

      {sharedDeck && (
        <div style={{ marginBottom: 40 }}>
          <div style={{ background: 'var(--accent-gold)', color: '#000', padding: '4px 12px', display: 'inline-block', borderRadius: '12px 12px 0 0', fontWeight: 700, fontSize: 13 }}>
            收到分享牌組！
          </div>
          <DeckCard deck={sharedDeck} name="玩家分享的牌組" onImport={() => importDeck(sharedDeck)} />
        </div>
      )}

      <h2 style={{ fontSize: 18, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Users size={20} color="var(--accent-cyan)" /> 熱門 META 牌組
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {META_DECKS.map((m, i) => (
          <DeckCard key={i} deck={m.deck} name={m.name} author={m.author} 
            onImport={() => importDeck(m.deck)} 
            onCopy={() => copyLink(m.deck)} 
            copied={copied} />
        ))}
      </div>
      
      <div style={{ marginTop: 40, padding: 20, background: 'var(--bg-card)', borderRadius: 16, textAlign: 'center' }}>
        <h3>想要分享你自己的牌組嗎？</h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, marginBottom: 16 }}>
          前往「牌組構築」頁面，點擊「分享」按鈕即可產生專屬 QR Code 與分享連結！
        </p>
        <button className="btn btn-gold" onClick={() => copyLink(currentDeck)}>
          <Share2 size={16} /> 複製我當前的牌組連結
        </button>
      </div>
    </div>
  );
}

function DeckCard({ deck, name, author, onImport, onCopy, copied }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: 16, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0' }}>{name}</h3>
          {author && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>by {author}</div>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {onCopy && (
            <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={onCopy}>
              {copied ? <Check size={14} color="var(--accent-gold)" /> : <Copy size={14} />}
            </button>
          )}
          <button className="btn btn-accent" style={{ padding: '6px 12px', fontSize: 12 }} onClick={onImport}>
            <Download size={14} /> 匯入我的牌組
          </button>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {['slot1', 'slot2', 'slot3'].map((key) => {
          const s = deck[key];
          const b = getPartById(s.blade);
          const r = getPartById(s.ratchet);
          const t = getPartById(s.bit);
          if (!b || !r || !t) return null;
          
          return (
            <div key={key} style={{ flex: 1, minWidth: 100, background: 'var(--bg-glass)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>{s.role}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
                <img src={getPartImage(b.id)} style={{ width: 30, height: 30, objectFit: 'contain' }} />
                <img src={getPartImage(r.id)} style={{ width: 30, height: 30, objectFit: 'contain' }} />
                <img src={getPartImage(t.id)} style={{ width: 30, height: 30, objectFit: 'contain' }} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 700 }}>{b.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{r.name} {t.abbr}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

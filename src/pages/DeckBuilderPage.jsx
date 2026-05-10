import { useMemo, useRef, useState } from 'react';
import { RotateCcw, Save, CheckCircle, AlertTriangle, Camera, Dices, QrCode, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';
import useInventoryStore from '../store/useInventoryStore';
import { BLADES, RATCHETS, BITS, getPartById, TIER_COLORS } from '../data/partsDatabase';
import { getLaunchAdvice, getSingleComboAnalysis } from '../utils/deckEngine';
import PowerBar from '../components/PowerBar';
import { playClick, playClank } from '../utils/audio';

const ROLES = ['先鋒', '中堅', '大將'];
const ROLE_ICONS = { '先鋒': '🔰', '中堅': '🔄', '大將': '👑' };
const ROLE_CLASS = { '先鋒': 'slot-vanguard', '中堅': 'slot-adaptable', '大將': 'slot-closer' };

export default function DeckBuilderPage() {
  const { inventory, currentDeck, setSlotPart, setSlotRole, clearSlot, clearDeck, saveDeck, isDeckValid, getUsedParts, savedDecks, loadDeck, deleteSavedDeck } = useInventoryStore();

  const validation = isDeckValid();
  const ownedBlades = useMemo(() => BLADES.filter(b => (inventory[b.id] || 0) > 0), [inventory]);
  const ownedRatchets = useMemo(() => RATCHETS.filter(r => (inventory[r.id] || 0) > 0), [inventory]);
  const ownedBits = useMemo(() => BITS.filter(b => (inventory[b.id] || 0) > 0), [inventory]);

  const handleSave = () => {
    playClick();
    const name = prompt('為這套牌組命名：');
    if (name) saveDeck(name);
  };

  const deckRef = useRef(null);
  const [showQR, setShowQR] = useState(false);

  const randomizeDeck = () => {
    playClank();
    if (ownedBlades.length < 3 || ownedRatchets.length < 3 || ownedBits.length < 3) return alert('庫存不足，無法隨機配置！');
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
    const bs = shuffle(ownedBlades).slice(0, 3);
    const rs = shuffle(ownedRatchets).slice(0, 3);
    const ts = shuffle(ownedBits).slice(0, 3);
    ['slot1', 'slot2', 'slot3'].forEach((s, i) => {
      setSlotPart(s, 'blade', bs[i].id);
      setSlotPart(s, 'ratchet', rs[i].id);
      setSlotPart(s, 'bit', ts[i].id);
    });
  };

  const exportImage = async () => {
    if (!deckRef.current) return;
    try {
      const canvas = await html2canvas(deckRef.current, { backgroundColor: '#11131a', scale: 2 });
      const link = document.createElement('a');
      link.download = 'BX-Deck-Export.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      alert('匯出圖片失敗');
    }
  };

  const deckCode = btoa(JSON.stringify(currentDeck));
  const shareUrl = `${window.location.origin}/community?deck=${deckCode}`;

  return (
    <div>
      <div className="page-header">
        <h1>🔧 牌組構築 DECK BUILDER</h1>
        <p>從武器庫中配置你的 3-on-3 賽事陣容</p>
      </div>

      {validation.isComplete && (
        <div className={`validation-banner ${validation.isValid ? 'valid' : 'invalid'}`}>
          {validation.isValid ? <><CheckCircle size={18} /> ✅ WBO 合法！所有零件完全不同，可以上場！</>
            : <><AlertTriangle size={18} /> ⚠️ 違規！有零件被重複使用，請修正</>}
        </div>
      )}

      <div className="action-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <button className="btn btn-ghost" onClick={clearDeck}><RotateCcw size={16} /> 重置</button>
        <button className="btn btn-ghost" onClick={randomizeDeck}><Dices size={16} /> 隨機盲盒</button>
        {validation.isValid && (
          <>
            <button className="btn btn-accent" onClick={exportImage}><Camera size={16} /> 戰報匯出</button>
            <button className="btn btn-accent" onClick={() => setShowQR(true)}><QrCode size={16} /> 分享</button>
            <button className="btn btn-gold" onClick={handleSave}><Save size={16} /> 儲存</button>
          </>
        )}
      </div>

      <div className="deck-slots" ref={deckRef} style={{ padding: '10px 0', background: 'var(--bg-main)' }}>
        {['slot1', 'slot2', 'slot3'].map((slotKey, idx) => {
          const slot = currentDeck[slotKey];
          const usedParts = getUsedParts(slotKey);
          const blade = slot.blade ? getPartById(slot.blade) : null;
          const ratchet = slot.ratchet ? getPartById(slot.ratchet) : null;
          const bit = slot.bit ? getPartById(slot.bit) : null;

          return (
            <div className={`bey-slot ${ROLE_CLASS[slot.role]}`} key={slotKey}>
              <h3>
                {ROLE_ICONS[slot.role]} {slot.role}
                <select value={slot.role} onChange={e => setSlotRole(slotKey, e.target.value)}
                  style={{ marginLeft: 'auto', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-glass)', borderRadius: 6, padding: '4px 8px', fontSize: 11, cursor: 'pointer' }}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </h3>

              <label style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>之刃 Blade</label>
              <select className="slot-select" value={slot.blade || ''} onChange={e => { playClank(); setSlotPart(slotKey, 'blade', e.target.value || null); }}>
                <option value="">-- 選擇之刃 --</option>
                {ownedBlades.map(b => (
                  <option key={b.id} value={b.id} disabled={usedParts.has(b.id)} style={usedParts.has(b.id) ? {color:'#666'} : {}}>
                    {b.name} {b.nameJP||''} [{b.tier}] {b.spin === '左旋' ? '⬅️' : ''} {usedParts.has(b.id) ? '⚠️已使用' : ''}
                  </option>
                ))}
              </select>

              <label style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>棘輪 Ratchet</label>
              <select className="slot-select" value={slot.ratchet || ''} onChange={e => { playClank(); setSlotPart(slotKey, 'ratchet', e.target.value || null); }}>
                <option value="">-- 選擇棘輪 --</option>
                {ownedRatchets.map(r => (
                  <option key={r.id} value={r.id} disabled={usedParts.has(r.id)} style={usedParts.has(r.id) ? {color:'#666'} : {}}>
                    {r.name} {r.nameCN||''} [{r.tier}] {usedParts.has(r.id) ? '⚠️已使用' : ''}
                  </option>
                ))}
              </select>

              <label style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>軸心 Bit</label>
              <select className="slot-select" value={slot.bit || ''} onChange={e => { playClank(); setSlotPart(slotKey, 'bit', e.target.value || null); }}>
                <option value="">-- 選擇軸心 --</option>
                {ownedBits.map(b => (
                  <option key={b.id} value={b.id} disabled={usedParts.has(b.id)} style={usedParts.has(b.id) ? {color:'#666'} : {}}>
                    {b.name} {b.nameCN||''} ({b.abbr}) [{b.tier}] {usedParts.has(b.id) ? '⚠️已使用' : ''}
                  </option>
                ))}
              </select>

              {(blade || ratchet || bit) && (
                <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--bg-glass)', borderRadius: 10, fontSize: 13 }}>
                  <div style={{ fontWeight: 700, fontFamily: 'Orbitron', fontSize: 14, marginBottom: 4 }}>
                    {blade?.name || '?'} {ratchet?.name || '?'} {bit?.abbr || '?'}
                  </div>
                  {blade && <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{blade.type} • {blade.spin} • {blade.system}</div>}
                  {blade && ratchet && bit && (
                    <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                      <div>⚖️ <span style={{ color: 'var(--accent-cyan)' }}>{((blade.weight || 0) + (ratchet.weight || 0) + (bit.weight || 0)).toFixed(1)}g</span></div>
                      <div>🎯 <span style={{ color: 'var(--accent-gold)' }}>{blade.cg || '平衡'}</span></div>
                    </div>
                  )}
                  {blade && ratchet && bit && (() => {
                    const ca = getSingleComboAnalysis({ blade: slot.blade, ratchet: slot.ratchet, bit: slot.bit });
                    return ca ? (
                      <div style={{ marginTop: 8, display: 'grid', gap: 3 }}>
                        <PowerBar label="攻擊" value={ca.attack} color="#ff416c" />
                        <PowerBar label="防禦" value={ca.defense} color="#64b5f6" />
                        <PowerBar label="持久" value={ca.stamina} color="#81c784" />
                        <PowerBar label="爆發" value={ca.burst} color="#ffa94d" />
                      </div>
                    ) : null;
                  })()}
                  {blade && ratchet && bit && (() => {
                    const la = getLaunchAdvice({ blade: slot.blade, ratchet: slot.ratchet, bit: slot.bit });
                    return la ? (
                      <div style={{ marginTop: 8, padding: '8px 10px', background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.12)', borderRadius: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-gold)', marginBottom: 4 }}>{la.emoji} {la.technique}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {la.power}<br/>{la.angle}<br/>{la.timing}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>{la.detail}</div>
                        {la.steps && la.steps.length > 0 && (
                          <div style={{ marginTop: 6, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 6 }}>
                            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: 3 }}>📋 執行步驟：</div>
                            {la.steps.map((s, si) => (
                              <div key={si} style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.5, padding: '2px 0' }}>{s}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : null;
                  })()}
                  <button className="btn btn-danger" style={{ marginTop: 8, padding: '4px 12px', fontSize: 11 }} onClick={() => clearSlot(slotKey)}>清除</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {ownedBlades.length < 3 && (
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <p>武器庫中零件不足！請先到武器庫頁面新增至少 3 個之刃、3 個棘輪、3 個軸心。</p>
        </div>
      )}

      {savedDecks.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontFamily: 'Orbitron', fontSize: 18, marginBottom: 16, color: 'var(--accent-gold)' }}>💾 已儲存牌組</h2>
          {savedDecks.map((d, i) => (
            <div className="rec-card" key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{d.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {Object.values(d.deck).map(s => {
                    const b = s.blade ? getPartById(s.blade) : null;
                    return b?.name || '?';
                  }).join(' / ')}
                </div>
              </div>
              <button className="btn btn-accent" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => loadDeck(i)}>載入</button>
              <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => deleteSavedDeck(i)}>刪除</button>
            </div>
          ))}
        </div>
      )}

      {showQR && (
        <div className="modal-overlay" onClick={() => setShowQR(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 360, textAlign: 'center' }}>
            <button className="btn btn-ghost" style={{ position: 'absolute', top: 10, right: 10, padding: 4 }} onClick={() => setShowQR(false)}><X size={20} /></button>
            <h2 style={{ marginBottom: 20 }}>📱 掃碼分享牌組</h2>
            <div style={{ background: '#fff', padding: 20, borderRadius: 16, display: 'inline-block', marginBottom: 20 }}>
              <QRCodeCanvas value={shareUrl} size={200} level="H" />
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>給朋友掃描此 QR Code，或複製以下連結：</p>
            <input type="text" readOnly value={shareUrl} style={{ width: '100%', padding: '8px 12px', fontSize: 11, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', borderRadius: 8, color: 'var(--text-muted)' }} onClick={e => e.target.select()} />
          </div>
        </div>
      )}
    </div>
  );
}

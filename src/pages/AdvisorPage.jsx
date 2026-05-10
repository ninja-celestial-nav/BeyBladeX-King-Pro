import { useState, useMemo } from 'react';
import { Sparkles, ArrowRight, Zap, Shield } from 'lucide-react';
import useInventoryStore from '../store/useInventoryStore';
import { generateRecommendations, getMatchupAnalysis, getLaunchAdvice, getSingleComboAnalysis } from '../utils/deckEngine';
import { getPartById, BLADES, RATCHETS, BITS, TIER_COLORS } from '../data/partsDatabase';
import PowerBar from '../components/PowerBar';

const ROLE_ICONS = { '先鋒': '🔰', '中堅': '🔄', '大將': '👑' };

function RadarChart({ data }) {
  const cx = 100, cy = 100, r = 70;
  const labels = [
    { key: 'attack', label: '攻擊', angle: -90 },
    { key: 'defense', label: '防禦', angle: 0 },
    { key: 'stamina', label: '持久', angle: 90 },
    { key: 'counter', label: '反制', angle: 180 },
  ];
  const toXY = (angle, radius) => ({
    x: cx + radius * Math.cos((angle * Math.PI) / 180),
    y: cy + radius * Math.sin((angle * Math.PI) / 180),
  });
  const points = labels.map(l => { const val = (data[l.key] || 0) / 100; return toXY(l.angle, r * val); });
  const polyPoints = points.map(p => `${p.x},${p.y}`).join(' ');
  return (
    <svg viewBox="0 0 200 200" style={{ width: 160, height: 160 }}>
      {[0.25, 0.5, 0.75, 1].map(s => (
        <polygon key={s} points={labels.map(l => toXY(l.angle, r * s)).map(p => `${p.x},${p.y}`).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {labels.map(l => {
        const ep = toXY(l.angle, r + 20);
        return <text key={l.key} x={ep.x} y={ep.y} textAnchor="middle" dominantBaseline="middle"
          fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="Outfit">{l.label}</text>;
      })}
      <polygon points={polyPoints} fill="rgba(102, 126, 234, 0.25)" stroke="#667eea" strokeWidth="2" />
      {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#667eea" stroke="#fff" strokeWidth="1" />)}
    </svg>
  );
}

export default function AdvisorPage() {
  const { inventory, applyRecommendation } = useInventoryStore();
  const [recs, setRecs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCounter, setShowCounter] = useState(false);
  const [oppBlade, setOppBlade] = useState('');
  const [oppBit, setOppBit] = useState('');

  const totalParts = Object.values(inventory).reduce((a, b) => a + b, 0);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      const results = generateRecommendations(inventory, 3);
      setRecs(results);
      setLoading(false);
    }, 500);
  };

  // 對手反制建議 (#3)
  const counterAdvice = useMemo(() => {
    if (!oppBlade) return null;
    const blade = getPartById(oppBlade);
    if (!blade) return null;
    const suggestions = [];
    if (blade.type === '攻擊') {
      suggestions.push('🛡️ 使用防禦型刃（Knight Shield、Wizard Rod）搭配 Hexa/Bound Spike 軸心抵擋');
      suggestions.push('⏱️ 高棘輪（9-60、1-60）增加重心穩定性防止 KO');
      if (blade.spin === '右旋') suggestions.push('↪️ 使用左旋刃（Cobalt/Meteor Dragoon）產生同旋搶轉');
    }
    if (blade.type === '持久') {
      suggestions.push('⚔️ 使用強攻擊刃（Shark Scale、Hover Wyvern）搭配 Low Rush 在早期 KO');
      suggestions.push('🔻 低棘輪（4-50）壓低重心進行上掀攻擊');
    }
    if (blade.type === '防禦') {
      suggestions.push('⏱️ 使用持久型配置（Wizard Rod + Free Ball）拖到持久戰獲勝');
      suggestions.push('↪️ 左旋刃可以搶轉消耗對手旋轉力');
    }
    if (blade.spin === '左旋') {
      suggestions.push('⚠️ 對手是左旋！右旋攻擊刃的衝擊力會加倍，但自己也容易被 Burst');
      suggestions.push('🔒 考慮使用高棘輪 + Hexa 提高 Burst 防禦');
    }
    return { blade, suggestions };
  }, [oppBlade]);

  return (
    <div>
      <div className="page-header">
        <h1>🧠 AI 配置建議 ADVISOR</h1>
        <p>基於你的武器庫，自動計算最強 3-on-3 牌組</p>
      </div>

      {totalParts === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🧠</div>
          <p>武器庫是空的！請先到武器庫頁面新增零件，AI 才能幫你配裝。</p>
        </div>
      ) : (
        <>
          <div className="action-bar">
            <button className="btn btn-gold" onClick={handleGenerate} disabled={loading}>
              <Sparkles size={16} /> {loading ? '計算中...' : '🚀 一鍵生成最強牌組'}
            </button>
            <button className="btn btn-ghost" onClick={() => setShowCounter(v => !v)}>
              <Shield size={16} /> {showCounter ? '隱藏反制' : '⚔️ 對手反制'}
            </button>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={14} /> {totalParts} 個零件可用
            </div>
          </div>

          {/* 對手策略分析 (#3) */}
          {showCounter && (
            <div style={{ marginBottom: 20, padding: 16, background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-red)', marginBottom: 12 }}>⚔️ 對手反制分析</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <select className="slot-select" style={{ flex: 1 }} value={oppBlade} onChange={e => setOppBlade(e.target.value)}>
                  <option value="">-- 選擇對手之刃 --</option>
                  {BLADES.map(b => <option key={b.id} value={b.id}>{b.name} {b.nameJP} [{b.tier}]</option>)}
                </select>
              </div>
              {counterAdvice && (
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    對手使用 <strong style={{ color: 'var(--text-primary)' }}>{counterAdvice.blade.name}</strong>
                    （{counterAdvice.blade.type} / {counterAdvice.blade.spin}）
                  </div>
                  {counterAdvice.suggestions.map((s, i) => (
                    <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '4px 0', lineHeight: 1.5 }}>{s}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ fontSize: 48, animation: 'spin-slow 1s linear infinite', display: 'inline-block' }}>🌀</div>
              <p style={{ marginTop: 16, color: 'var(--text-secondary)' }}>正在計算所有合法組合的戰力值...</p>
            </div>
          )}

          {recs && !loading && recs.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">😅</div>
              <p>零件不足以組成合法的 3-on-3 牌組（需要至少 3 個不同的之刃、棘輪、軸心）</p>
            </div>
          )}

          {recs && !loading && recs.map((rec, idx) => {
            const matchup = getMatchupAnalysis(rec.combos);
            return (
              <div className="rec-card" key={idx}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 16 }}>
                  <div>
                    <div className="rec-rank">#{idx + 1}</div>
                    <div className="rec-score">戰力 {Math.round(rec.totalScore)}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    {rec.combos.map((c, ci) => {
                      const blade = getPartById(c.blade);
                      const ratchet = getPartById(c.ratchet);
                      const bit = getPartById(c.bit);
                      const ca = getSingleComboAnalysis(c);
                      return (
                        <div key={ci} style={{ marginBottom: 14, padding: '12px 14px', background: 'var(--bg-glass)', borderRadius: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 16 }}>{ROLE_ICONS[c.role]}</span>
                            <span style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: 13 }}>
                              {blade?.name} {ratchet?.name} {bit?.abbr}
                            </span>
                            <span className="tier-badge" style={{
                              background: `${TIER_COLORS[blade?.tier]}22`,
                              color: TIER_COLORS[blade?.tier],
                              border: `1px solid ${TIER_COLORS[blade?.tier]}44`,
                              fontSize: 9
                            }}>{blade?.tier}</span>
                            <span style={{ fontSize: 11, color: 'var(--text-secondary)', marginLeft: 'auto' }}>{c.role}</span>
                          </div>
                          {/* 每顆戰力條 (#5) */}
                          {ca && (
                            <div style={{ marginTop: 6, marginBottom: 6, display: 'grid', gap: 2 }}>
                              <PowerBar label="攻擊" value={ca.attack} color="#ff416c" />
                              <PowerBar label="防禦" value={ca.defense} color="#64b5f6" />
                              <PowerBar label="持久" value={ca.stamina} color="#81c784" />
                              <PowerBar label="爆發" value={ca.burst} color="#ffa94d" />
                            </div>
                          )}
                          {c.synergy && (
                            <div style={{ fontSize: 11, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                              <Sparkles size={12} /> 協同加成: {c.synergy.note} (+{c.synergy.bonus * 2})
                            </div>
                          )}
                          {(() => { const la = getLaunchAdvice(c); return la ? (
                            <div style={{ marginTop: 8, padding: '10px 12px', background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.12)', borderRadius: 8 }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-gold)', marginBottom: 6 }}>{la.emoji} 發射建議：{la.technique}</div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', fontSize: 11, color: 'var(--text-secondary)' }}>
                                <span>{la.power}</span><span>{la.angle}</span>
                                <span style={{ gridColumn: '1/-1' }}>{la.timing}</span>
                              </div>
                              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 6 }}>{la.detail}</div>
                              {la.steps && la.steps.length > 0 && (
                                <div style={{ marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8 }}>
                                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: 4 }}>📋 執行步驟：</div>
                                  {la.steps.map((s, si) => (
                                    <div key={si} style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6, padding: '3px 0' }}>{s}</div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : null; })()}
                        </div>
                      );
                    })}
                  </div>
                  <RadarChart data={matchup} />
                </div>
                <button className="btn btn-accent" onClick={() => applyRecommendation(rec.combos)}>
                  <ArrowRight size={16} /> 套用到牌組構築器
                </button>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

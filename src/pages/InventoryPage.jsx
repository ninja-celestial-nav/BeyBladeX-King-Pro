import { useState, useRef, useMemo } from 'react';
import { Search, Plus, Star, Download, Upload, Camera } from 'lucide-react';
import useInventoryStore from '../store/useInventoryStore';
import { getAllParts, getPartById, TIER_COLORS, TYPE_ICONS } from '../data/partsDatabase';
import PhotoScanner from '../components/PhotoScanner';

const TABS = [
  { id: 'blades', label: '⚔️ 之刃', types: ['blade'] },
  { id: 'ratchets', label: '⚙️ 棘輪', types: ['ratchet'] },
  { id: 'bits', label: '🔩 軸心', types: ['bit'] },
  { id: 'cx', label: '🔷 CX系統', types: ['lockChip', 'mainBlade', 'assistBlade'] },
];

export default function InventoryPage() {
  const { inventory, addPart, updateQuantity, removePart, favorites, toggleFavorite, exportData, importData } = useInventoryStore();
  const [tab, setTab] = useState('blades');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [importMsg, setImportMsg] = useState(null);
  const importRef = useRef();

  const allParts = useMemo(() => getAllParts(), []);
  const ownedParts = useMemo(() =>
    allParts.filter(p => (inventory[p.id] || 0) > 0).map(p => ({ ...p, qty: inventory[p.id] })),
    [allParts, inventory]
  );

  const currentTab = TABS.find(t => t.id === tab);
  const filtered = ownedParts
    .filter(p => currentTab.types.includes(p.partType))
    .filter(p => !search || [p.name, p.nameJP, p.nameCN, p.code, p.abbr].some(v => v && v.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      const aFav = favorites.includes(a.id) ? 0 : 1;
      const bFav = favorites.includes(b.id) ? 0 : 1;
      return aFav - bFav;
    });

  const stats = {
    total: Object.values(inventory).reduce((a, b) => a + b, 0),
    types: Object.keys(inventory).length,
    blades: allParts.filter(p => p.partType === 'blade' && inventory[p.id] > 0).length,
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = importData(ev.target.result);
      setImportMsg(result);
      setTimeout(() => setImportMsg(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div>
      <div className="page-header">
        <h1>🏠 武器庫 ARSENAL</h1>
        <p>管理你的 Beyblade X 零件收藏</p>
      </div>

      <div className="stats-row">
        <div className="stat-chip"><div><div className="stat-value">{stats.total}</div><div className="stat-label">總零件數</div></div></div>
        <div className="stat-chip"><div><div className="stat-value">{stats.types}</div><div className="stat-label">種類</div></div></div>
        <div className="stat-chip"><div><div className="stat-value">{stats.blades}</div><div className="stat-label">之刃</div></div></div>
      </div>

      {importMsg && (
        <div className={`validation-banner ${importMsg.success ? 'valid' : 'invalid'}`} style={{ marginBottom: 12 }}>
          {importMsg.success ? '✅' : '❌'} {importMsg.msg}
        </div>
      )}

      <div className="action-bar">
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} /> 手動新增</button>
        <button className="btn btn-accent" onClick={() => setShowScanner(true)}><Camera size={16} /> AI 辨識</button>
        <button className="btn btn-ghost" onClick={exportData}><Download size={16} /> 匯出</button>
        <button className="btn btn-ghost" onClick={() => importRef.current?.click()}><Upload size={16} /> 匯入</button>
        <input ref={importRef} type="file" accept=".json" hidden onChange={handleImport} />
      </div>

      <div className="tabs">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input placeholder="搜尋零件名稱 (中/英文/代號)..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <p>此分類尚無零件，點擊「手動新增」或「AI 辨識」開始建庫！</p>
        </div>
      ) : (
        <div className="parts-grid">
          {filtered.map(p => (
            <div className="part-card" key={p.id}>
              <button onClick={(e) => { e.stopPropagation(); toggleFavorite(p.id); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 18 }}
                title={favorites.includes(p.id) ? '取消收藏' : '收藏'}>
                <Star size={18} fill={favorites.includes(p.id) ? 'var(--accent-gold)' : 'none'}
                  color={favorites.includes(p.id) ? 'var(--accent-gold)' : 'var(--text-muted)'} />
              </button>
              <span style={{ fontSize: '20px' }}>{TYPE_ICONS[p.type] || '⚙️'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="part-name">{p.name} <span style={{ color: 'var(--accent-cyan)', fontWeight: 400 }}>{p.nameJP || p.nameCN || ''}</span></div>
                <div className="part-sub">{p.code || p.system || ''} {p.spin ? `• ${p.spin}` : ''} {p.abbr ? `(${p.abbr})` : ''}</div>
              </div>
              <span className="tier-badge" style={{
                background: `${TIER_COLORS[p.tier]}22`,
                color: TIER_COLORS[p.tier],
                border: `1px solid ${TIER_COLORS[p.tier]}44`,
              }}>{p.tier}</span>
              <div className="part-qty">
                <button onClick={() => updateQuantity(p.id, p.qty - 1)}>−</button>
                <span>{p.qty}</span>
                <button onClick={() => updateQuantity(p.id, p.qty + 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && <AddPartModal onClose={() => setShowAdd(false)} onAdd={(id) => { addPart(id); }} />}
      {showScanner && <PhotoScanner onClose={() => setShowScanner(false)} />}
    </div>
  );
}

function AddPartModal({ onClose, onAdd }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const allParts = useMemo(() => getAllParts(), []);

  const results = allParts
    .filter(p => filterType === 'all' || p.partType === filterType)
    .filter(p => !search || [p.name, p.nameJP, p.nameCN, p.code, p.abbr].some(v => v && v.toLowerCase().includes(search.toLowerCase())))
    .slice(0, 50);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>➕ 新增零件到武器庫</h2>
        <div className="search-bar"><Search size={18} className="search-icon" />
          <input placeholder="搜尋零件 (中/英文)..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
          {[{ id: 'all', label: '全部' }, { id: 'blade', label: '之刃' }, { id: 'ratchet', label: '棘輪' }, { id: 'bit', label: '軸心' }, { id: 'lockChip', label: '鎖定晶片' }, { id: 'mainBlade', label: '主刃' }, { id: 'assistBlade', label: '輔助刃' }].map(f => (
            <button key={f.id} className={`tab-btn ${filterType === f.id ? 'active' : ''}`}
              style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setFilterType(f.id)}>{f.label}</button>
          ))}
        </div>
        <div style={{ maxHeight: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {results.map(p => (
            <div className="part-card" key={p.id} onClick={() => onAdd(p.id)} style={{ cursor: 'pointer' }}>
              <span style={{ fontSize: 18 }}>{TYPE_ICONS[p.type] || '⚙️'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="part-name">{p.name} <span style={{ color: 'var(--accent-cyan)', fontWeight: 400, fontSize: 12 }}>{p.nameJP || p.nameCN || ''}</span></div>
                <div className="part-sub">{p.code || ''} {p.partType === 'blade' ? `• ${p.system} • ${p.spin || ''}` : ''} {p.abbr ? `(${p.abbr})` : ''}</div>
              </div>
              <span className="tier-badge" style={{
                background: `${TIER_COLORS[p.tier]}22`, color: TIER_COLORS[p.tier], border: `1px solid ${TIER_COLORS[p.tier]}44`,
              }}>{p.tier}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

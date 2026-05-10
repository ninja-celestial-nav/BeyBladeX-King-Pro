import { useState, useMemo } from 'react';
import { Search, ExternalLink, Heart } from 'lucide-react';
import useInventoryStore from '../store/useInventoryStore';
import { getAllParts, TIER_COLORS, TYPE_ICONS, DB_LAST_UPDATED } from '../data/partsDatabase';
import { getPartImage } from '../data/partImages';
import { useDebounce } from '../hooks/useDebounce';

const FILTER_TYPES = [
  { id: 'all', label: '全部' },
  { id: 'blade', label: '⚔️ 之刃' },
  { id: 'ratchet', label: '⚙️ 棘輪' },
  { id: 'bit', label: '🔩 軸心' },
  { id: 'lockChip', label: '🔷 鎖定晶片' },
  { id: 'mainBlade', label: '🗡️ 主刃' },
  { id: 'assistBlade', label: '🛡️ 輔助刃' },
  { id: 'favorite', label: '❤️ 願望清單' },
];
const TIER_FILTERS = ['全部', 'T0', 'T0.5', 'T1', 'T2', 'T3'];

function getWikiUrl(part) {
  const wn = part.name.replace(/'/g, '').replace(/\s+/g, '');
  return `https://beyblade.fandom.com/wiki/${wn}`;
}

function PartImage({ part, size = 64 }) {
  const [err, setErr] = useState(false);
  const src = getPartImage(part.id);
  if (!src || err) {
    return (
      <div style={{ width: size, height: size, borderRadius: 10, background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5, flexShrink: 0 }}>
        {TYPE_ICONS[part.type] || '⚙️'}
      </div>
    );
  }
  return (
    <img src={src} alt={part.name} onError={() => setErr(true)}
      style={{ width: size, height: size, objectFit: 'contain', borderRadius: 10, background: 'rgba(255,255,255,0.03)', flexShrink: 0 }} />
  );
}

export default function EncyclopediaPage() {
  const { isFavorite, toggleFavorite, favorites } = useInventoryStore();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterTier, setFilterTier] = useState('全部');
  const [selected, setSelected] = useState(null);
  const allParts = useMemo(() => getAllParts(), []);
  const debouncedSearch = useDebounce(search, 150);

  const filtered = allParts
    .filter(p => filterType === 'all' || (filterType === 'favorite' ? favorites.includes(p.id) : p.partType === filterType))
    .filter(p => filterTier === '全部' || p.tier === filterTier)
    .filter(p => !debouncedSearch || [p.name, p.nameJP, p.nameCN, p.code, p.abbr]
      .some(v => v && v.toLowerCase().includes(debouncedSearch.toLowerCase())));

  return (
    <div>
      <div className="page-header">
        <h1>📖 零件圖鑑 ENCYCLOPEDIA</h1>
        <p>全 {allParts.length} 種零件圖鑑 <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>資料更新：{DB_LAST_UPDATED}</span></p>
      </div>

      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input placeholder="搜尋零件名稱 (中/英文/代號)..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {FILTER_TYPES.map(f => (
          <button key={f.id} className={`tab-btn ${filterType === f.id ? 'active' : ''}`}
            style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setFilterType(f.id)}>{f.label}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap' }}>
        {TIER_FILTERS.map(t => (
          <button key={t} className={`tab-btn ${filterTier === t ? 'active' : ''}`}
            style={{ padding: '4px 10px', fontSize: 11, color: t !== '全部' ? TIER_COLORS[t] : undefined }}
            onClick={() => setFilterTier(t)}>{t}</button>
        ))}
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>顯示 {filtered.length} / {allParts.length} 種零件</div>

      <div className="parts-grid">
        {filtered.map(p => (
          <div className="part-card" key={p.id} onClick={() => setSelected(p)} style={{ cursor: 'pointer' }}>
            <PartImage part={p} size={48} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="part-name">
                {p.name}
                {isFavorite(p.id) && <Heart size={14} fill="var(--accent-gold)" color="var(--accent-gold)" style={{ marginLeft: 6, display: 'inline-block' }} />}
              </div>
              <div className="part-sub">
                {p.nameCN || p.nameJP || ''} {p.code ? `• ${p.code}` : ''} {p.abbr ? `(${p.abbr})` : ''}
              </div>
            </div>
            <span className="tier-badge" style={{
              background: `${TIER_COLORS[p.tier]}22`, color: TIER_COLORS[p.tier],
              border: `1px solid ${TIER_COLORS[p.tier]}44`,
            }}>{p.tier}</span>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            {/* 大圖 + 標題 */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
              <PartImage part={selected} size={120} />
              <div>
                <h2 style={{ margin: 0, marginBottom: 4 }}>{selected.name}</h2>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 6 }}>{selected.nameCN || selected.nameJP || ''}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className="tier-badge" style={{
                    background: `${TIER_COLORS[selected.tier]}22`, color: TIER_COLORS[selected.tier],
                    border: `1px solid ${TIER_COLORS[selected.tier]}44`, fontSize: 14, padding: '4px 14px',
                  }}>{selected.tier}</span>
                  <button className="btn btn-ghost" onClick={() => toggleFavorite(selected.id)} style={{ padding: '6px' }}>
                    <Heart size={20} fill={isFavorite(selected.id) ? 'var(--accent-gold)' : 'none'} color={isFavorite(selected.id) ? 'var(--accent-gold)' : 'var(--text-secondary)'} />
                  </button>
                </div>
              </div>
            </div>

            {/* Wiki 連結 */}
            <a href={getWikiUrl(selected)} target="_blank" rel="noopener noreferrer"
              className="btn btn-accent" style={{ padding: '8px 16px', fontSize: 13, textDecoration: 'none', marginBottom: 16, display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
              <ExternalLink size={16} /> 📷 查看 Wiki 完整圖庫
            </a>

            {/* 詳細資料 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', marginBottom: 16 }}>
              <Detail label="中文名稱" value={selected.nameCN || selected.nameJP || '—'} />
              <Detail label="產品代號" value={selected.code || '—'} />
              <Detail label="系統世代" value={selected.system || selected.partType} />
              <Detail label="戰鬥類型" value={selected.type || '—'} />
              <Detail label="旋轉方向" value={selected.spin || '—'} />
              <Detail label="競技等級" value={selected.tier} color={TIER_COLORS[selected.tier]} />
              {selected.abbr && <Detail label="縮寫代碼" value={selected.abbr} />}
              {selected.weight && <Detail label="實測重量" value={`${selected.weight}g`} />}
              {selected.cg && <Detail label="重心分佈" value={selected.cg} />}
              {selected.height != null && <Detail label="軸心高度" value={`${selected.height}mm`} />}
              {selected.protrusions != null && <Detail label="棘輪齒數" value={selected.protrusions} />}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '8px 0', borderTop: '1px solid var(--border-glass)' }}>
              零件分類：{selected.partType} | ID：{selected.id}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: color || 'var(--text-primary)' }}>{value}</div>
    </div>
  );
}

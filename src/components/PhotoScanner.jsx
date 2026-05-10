import { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Loader } from 'lucide-react';
import useInventoryStore from '../store/useInventoryStore';
import { getAllParts } from '../data/partsDatabase';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const USE_PROXY = !GEMINI_API_KEY; // 如果沒有前端 key，使用 serverless proxy
const GEMINI_URL = USE_PROXY
  ? '/api/scan'
  : `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `你是 Beyblade X 戰鬥陀螺零件辨識專家。請辨識照片中所有可見的 Beyblade X 零件。

請用以下 JSON 格式回傳（僅回傳 JSON，不要其他文字）：
{
  "parts": [
    { "name": "零件英文名稱", "type": "blade/ratchet/bit/assistBlade", "confidence": "high/medium/low" }
  ]
}

已知的零件名稱包括：
- 之刃(blade): Wizard Rod, Shark Scale, Cobalt Dragoon, Meteor Dragoon, Hover Wyvern, Dran Buster, Hell's Hammer, Aero Pegasus, Knight Mail, Silver Wolf, Phoenix Rudder, Leon Crest, Dran Sword, Hell's Scythe, etc.
- 棘輪(ratchet): 格式為 X-YY，例如 9-60, 1-60, 4-50, 3-60, 7-60, 1-70 等
- 軸心(bit): Low Rush, Hexa, Elevate, Level, Free Ball, Rush, Kick, Ball, Glide, Unite, Accel, Flat, Needle, etc.
- 輔助刃(assistBlade): Wheel, Heavy, Erase, Slash, Massive, etc.

務必仔細觀察零件的形狀、顏色、刻印文字來辨識。如果不確定，將 confidence 設為 low。`;

export default function PhotoScanner({ onClose }) {
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef();
  const { bulkAddParts } = useInventoryStore();
  const allParts = getAllParts();

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
      setImageData(e.target.result.split(',')[1]); // base64
      setResults(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const matchPartId = (name, type) => {
    const lower = name.toLowerCase().trim();
    // Try exact match
    let match = allParts.find(p => p.name.toLowerCase() === lower);
    if (match) return match.id;
    // Try partial
    match = allParts.find(p => p.name.toLowerCase().includes(lower) || lower.includes(p.name.toLowerCase()));
    if (match) return match.id;
    // Ratchet special: "9-60" format
    if (type === 'ratchet') {
      match = allParts.find(p => p.name === name.trim());
      if (match) return match.id;
    }
    return null;
  };

  const handleScan = async () => {
    if (!imageData) return;
    setScanning(true);
    setError(null);

    try {
      const resp = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: SYSTEM_PROMPT },
              { inlineData: { mimeType: 'image/jpeg', data: imageData } },
            ]
          }]
        })
      });

      if (!resp.ok) throw new Error(`API Error: ${resp.status}`);
      const data = await resp.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('無法解析回應');

      const parsed = JSON.parse(jsonMatch[0]);
      const enriched = (parsed.parts || []).map(p => ({
        ...p,
        matchedId: matchPartId(p.name, p.type),
        selected: true,
      }));
      setResults(enriched);
    } catch (e) {
      if (e.message.includes('429')) setError('API 請求次數超過限制，請稍後再試');
      else if (e.message.includes('403')) setError('API Key 無效或已過期，請檢查設定');
      else if (e.message.includes('Failed to fetch') || e.message.includes('NetworkError')) setError('網路連線失敗，請檢查網路後重試');
      else if (e.message.includes('無法解析')) setError('AI 無法辨識此照片中的零件，請嘗試更清晰的照片');
      else setError(e.message);
    } finally {
      setScanning(false);
    }
  };

  const toggleResult = (idx) => {
    setResults(prev => prev.map((r, i) => i === idx ? { ...r, selected: !r.selected } : r));
  };

  const handleConfirm = () => {
    if (!results) return;
    const ids = results.filter(r => r.selected && r.matchedId).map(r => r.matchedId);
    if (ids.length > 0) bulkAddParts(ids);
    onClose();
  };

  const confColor = { high: 'var(--accent-green)', medium: 'var(--accent-gold)', low: 'var(--accent-red)' };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 650 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2>📷 AI 零件辨識</h2>
          <button className="btn btn-ghost" onClick={onClose}><X size={18} /></button>
        </div>

        {!image ? (
          <div className="photo-zone" onClick={() => fileRef.current?.click()}>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden onChange={e => handleFile(e.target.files[0])} />
            <Camera size={48} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
            <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>點擊拍照或選擇照片</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>支援 JPG / PNG，建議光線充足、零件排列清晰</p>
          </div>
        ) : (
          <>
            <div className={`photo-zone ${scanning ? 'scanning' : ''}`} style={{ padding: 16 }}>
              <img src={image} alt="uploaded" />
              {!scanning && !results && (
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button className="btn btn-gold" onClick={handleScan}>
                    <Loader size={16} /> 開始 AI 辨識
                  </button>
                  <button className="btn btn-ghost" onClick={() => { setImage(null); setImageData(null); }}>
                    重新選擇
                  </button>
                </div>
              )}
              {scanning && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 32, animation: 'spin-slow 1s linear infinite', display: 'inline-block' }}>🌀</div>
                  <p style={{ color: 'var(--accent-gold)', marginTop: 8 }}>Gemini Vision 辨識中...</p>
                </div>
              )}
            </div>

            {error && (
              <div className="validation-banner invalid" style={{ marginTop: 12 }}>
                ⚠️ {error}
              </div>
            )}

            {results && (
              <div style={{ marginTop: 16 }}>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                  辨識到 {results.length} 個零件，勾選要加入武器庫的項目：
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
                  {results.map((r, i) => (
                    <div key={i} className="part-card"
                      style={{ opacity: r.selected ? 1 : 0.4, cursor: 'pointer' }}
                      onClick={() => toggleResult(i)}>
                      <input type="checkbox" checked={r.selected} readOnly style={{ accentColor: 'var(--accent-cyan)' }} />
                      <div>
                        <div className="part-name">{r.name}</div>
                        <div className="part-sub">
                          {r.type} • {r.matchedId ? '✅ 已配對' : '❌ 未知零件'}
                        </div>
                      </div>
                      <span style={{ fontSize: 11, color: confColor[r.confidence], fontWeight: 600, marginLeft: 'auto' }}>
                        {r.confidence === 'high' ? '高確信' : r.confidence === 'medium' ? '中確信' : '低確信'}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button className="btn btn-primary" onClick={handleConfirm}>
                    <Check size={16} /> 確認加入武器庫 ({results.filter(r => r.selected && r.matchedId).length} 個)
                  </button>
                  <button className="btn btn-ghost" onClick={() => { setImage(null); setImageData(null); setResults(null); }}>
                    重新掃描
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

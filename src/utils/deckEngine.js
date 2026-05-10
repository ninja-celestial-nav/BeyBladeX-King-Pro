import { BLADES, RATCHETS, BITS, getPartById } from '../data/partsDatabase';

const TIER_SCORE = { 'T0': 10, 'T0.5': 8, 'T1': 6, 'T2': 3, 'T3': 1 };

// 協同加成表
const SYNERGY_BONUSES = [
  { blade: 'shark-scale', ratchet: 'r-4-50', bit: 'b-low-rush', bonus: 5, note: '極限上掀KO' },
  { blade: 'shark-scale', ratchet: 'r-1-70', bit: 'b-low-rush', bonus: 4, note: '高攻擊射程' },
  { blade: 'shark-scale', ratchet: 'r-1-60', bit: 'b-low-rush', bonus: 4, note: '低重心掃射' },
  { blade: 'shark-scale', ratchet: 'r-3-60', bit: 'b-rush', bonus: 3, note: '標準攻擊' },
  { blade: 'wizard-rod', ratchet: 'r-1-60', bit: 'b-hexa', bonus: 5, note: 'Meta基準防禦' },
  { blade: 'wizard-rod', ratchet: 'r-9-60', bit: 'b-hexa', bonus: 4, note: '高抗爆防禦' },
  { blade: 'wizard-rod', ratchet: 'r-9-60', bit: 'b-ball', bonus: 3, note: '純持久' },
  { blade: 'wizard-rod', ratchet: 'r-3-60', bit: 'b-free-ball', bonus: 3, note: '自由球持久' },
  { blade: 'cobalt-dragoon', ratchet: 'r-5-60', bit: 'b-elevate', bonus: 5, note: '最強左旋同化' },
  { blade: 'cobalt-dragoon', ratchet: 'r-2-60', bit: 'b-elevate', bonus: 4, note: '輕量左旋同化' },
  { blade: 'cobalt-dragoon', ratchet: 'r-9-60', bit: 'b-level', bonus: 3, note: '攻擊型左旋' },
  { blade: 'meteor-dragoon', ratchet: 'r-7-60', bit: 'b-level', bonus: 5, note: '最佳磨合左旋' },
  { blade: 'meteor-dragoon', ratchet: 'r-9-60', bit: 'b-level', bonus: 4, note: '高穩定左旋' },
  { blade: 'meteor-dragoon', ratchet: 'r-5-60', bit: 'b-level', bonus: 3, note: '輕量左旋' },
  { blade: 'hover-wyvern', ratchet: 'r-9-60', bit: 'b-kick', bonus: 4, note: '洋芋片踢擊' },
  { blade: 'hover-wyvern', ratchet: 'r-1-60', bit: 'b-low-rush', bonus: 3, note: '狙擊型' },
  { blade: 'aero-pegasus', ratchet: 'r-3-60', bit: 'b-ball', bonus: 3, note: '泛用平衡' },
  { blade: 'aero-pegasus', ratchet: 'r-9-60', bit: 'b-hexa', bonus: 3, note: '防禦飛馬' },
];

function getComboScore(bladeId, ratchetId, bitId) {
  const blade = getPartById(bladeId);
  const ratchet = getPartById(ratchetId);
  const bit = getPartById(bitId);
  if (!blade || !ratchet || !bit) return { score: 0, synergy: null };

  let score = (TIER_SCORE[blade.tier] || 0) * 2 + (TIER_SCORE[ratchet.tier] || 0) + (TIER_SCORE[bit.tier] || 0) * 1.5;
  let synergy = null;

  for (const s of SYNERGY_BONUSES) {
    if (s.blade === bladeId && s.ratchet === ratchetId && s.bit === bitId) {
      score += s.bonus * 2;
      synergy = s;
      break;
    }
    if (s.blade === bladeId && s.bit === bitId) {
      score += s.bonus;
      synergy = s;
    }
    if (s.blade === bladeId && s.ratchet === ratchetId) {
      score += s.bonus * 0.5;
      if (!synergy) synergy = s;
    }
  }
  return { score, synergy };
}

function getCoverageScore(combos) {
  const types = new Set();
  const spins = new Set();
  combos.forEach(c => {
    const blade = getPartById(c.blade);
    if (blade) {
      types.add(blade.type);
      spins.add(blade.spin);
    }
  });
  let coverage = 0;
  if (types.has('攻擊')) coverage += 3;
  if (types.has('持久') || types.has('防禦')) coverage += 3;
  if (spins.has('左旋')) coverage += 4;
  if (types.size >= 3) coverage += 2;
  return coverage;
}

function assignRoles(combos) {
  return combos.map(c => {
    const blade = getPartById(c.blade);
    if (!blade) return { ...c, role: '先鋒' };
    if (blade.type === '攻擊' && blade.spin === '右旋') return { ...c, role: '先鋒' };
    if (blade.spin === '左旋') return { ...c, role: '中堅' };
    return { ...c, role: '大將' };
  });
}

export function generateRecommendations(inventory, topN = 3) {
  const ownedBlades = BLADES.filter(b => inventory[b.id] > 0);
  const ownedRatchets = RATCHETS.filter(r => inventory[r.id] > 0);
  const ownedBits = BITS.filter(b => inventory[b.id] > 0);

  if (ownedBlades.length < 3 || ownedRatchets.length < 3 || ownedBits.length < 3) {
    return [];
  }

  // Generate all valid single combos
  const singleCombos = [];
  for (const bl of ownedBlades) {
    for (const ra of ownedRatchets) {
      for (const bi of ownedBits) {
        const { score, synergy } = getComboScore(bl.id, ra.id, bi.id);
        singleCombos.push({ blade: bl.id, ratchet: ra.id, bit: bi.id, score, synergy });
      }
    }
  }
  singleCombos.sort((a, b) => b.score - a.score);

  // Greedy: try top combos and build valid 3-bey decks
  const results = [];
  const topCombos = singleCombos.slice(0, Math.min(80, singleCombos.length));

  for (let i = 0; i < topCombos.length && results.length < topN * 3; i++) {
    const c1 = topCombos[i];
    for (let j = i + 1; j < topCombos.length && results.length < topN * 3; j++) {
      const c2 = topCombos[j];
      if (c2.blade === c1.blade || c2.ratchet === c1.ratchet || c2.bit === c1.bit) continue;
      // Check inventory counts
      const usedParts = {};
      [c1, c2].forEach(c => { [c.blade, c.ratchet, c.bit].forEach(p => { usedParts[p] = (usedParts[p] || 0) + 1; }); });
      let valid = true;
      for (const [pid, cnt] of Object.entries(usedParts)) {
        if ((inventory[pid] || 0) < cnt) { valid = false; break; }
      }
      if (!valid) continue;

      for (let k = j + 1; k < topCombos.length; k++) {
        const c3 = topCombos[k];
        if ([c1, c2].some(c => c3.blade === c.blade || c3.ratchet === c.ratchet || c3.bit === c.bit)) continue;
        const allUsed = { ...usedParts };
        [c3.blade, c3.ratchet, c3.bit].forEach(p => { allUsed[p] = (allUsed[p] || 0) + 1; });
        let allValid = true;
        for (const [pid, cnt] of Object.entries(allUsed)) {
          if ((inventory[pid] || 0) < cnt) { allValid = false; break; }
        }
        if (!allValid) continue;

        const trio = [c1, c2, c3];
        const deckScore = trio.reduce((s, c) => s + c.score, 0) + getCoverageScore(trio);
        results.push({ combos: assignRoles(trio), totalScore: deckScore });
        break;
      }
    }
  }

  results.sort((a, b) => b.totalScore - a.totalScore);
  // Deduplicate by blade set
  const seen = new Set();
  const unique = [];
  for (const r of results) {
    const key = r.combos.map(c => c.blade).sort().join('|');
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(r);
    }
    if (unique.length >= topN) break;
  }
  return unique;
}

export function getMatchupAnalysis(combos) {
  let attack = 0, defense = 0, stamina = 0, counter = 0;
  combos.forEach(c => {
    const blade = getPartById(c.blade);
    const bit = getPartById(c.bit);
    if (!blade) return;
    if (blade.type === '攻擊') attack += 3;
    if (blade.type === '防禦') defense += 3;
    if (blade.type === '持久') { stamina += 3; defense += 1; }
    if (blade.type === '平衡') { attack += 1; stamina += 1; defense += 1; }
    if (blade.spin === '左旋') counter += 4;
    if (bit) {
      if (['T0', 'T0.5'].includes(bit.tier)) {
        if (bit.type === '攻擊') attack += 2;
        if (bit.type === '防禦') defense += 2;
        if (bit.type === '持久') stamina += 2;
      }
    }
  });
  const max = Math.max(attack, defense, stamina, counter, 1);
  return {
    attack: Math.round((attack / max) * 100),
    defense: Math.round((defense / max) * 100),
    stamina: Math.round((stamina / max) * 100),
    counter: Math.round((counter / max) * 100),
  };
}

/** 單一配置的戰力分析（每顆陀螺獨立評分） */
export function getSingleComboAnalysis(combo) {
  const blade = getPartById(combo.blade);
  const ratchet = getPartById(combo.ratchet);
  const bit = getPartById(combo.bit);
  if (!blade || !ratchet || !bit) return null;

  const tierVal = { 'T0': 95, 'T0.5': 82, 'T1': 65, 'T2': 45, 'T3': 25 };
  let atk = 10, def = 10, sta = 10, burst = 10;

  // 刃型基礎
  if (blade.type === '攻擊') { atk += 50; burst += 30; def += 5; sta += 5; }
  if (blade.type === '防禦') { def += 50; sta += 20; atk += 5; burst += 10; }
  if (blade.type === '持久') { sta += 50; def += 15; atk += 5; burst += 5; }
  if (blade.type === '平衡') { atk += 25; def += 20; sta += 20; burst += 15; }

  // 刃 Tier 加成
  const bladeTier = (tierVal[blade.tier] || 40) / 100;
  atk = Math.round(atk * (0.6 + bladeTier * 0.4));
  def = Math.round(def * (0.6 + bladeTier * 0.4));
  sta = Math.round(sta * (0.6 + bladeTier * 0.4));

  // 棘輪高度影響
  if (ratchet.height <= 50) { atk += 10; burst += 10; }
  else if (ratchet.height >= 70) { sta += 8; def += 5; }
  // 棘輪 Tier
  const rTier = (tierVal[ratchet.tier] || 40) / 100;
  atk += Math.round(5 * rTier); def += Math.round(5 * rTier); sta += Math.round(5 * rTier);

  // 軸心類型
  const atkBits = ['b-low-rush','b-rush','b-gear-rush','b-kick','b-trans-kick','b-rubber-accel','b-gear-flat','b-flat','b-low-flat','b-accel'];
  const defBits = ['b-hexa','b-bound-spike','b-spike'];
  const staBits = ['b-ball','b-free-ball','b-glide','b-unite','b-high-taper','b-metal-needle','b-needle','b-orb','b-taper','b-dot','b-point'];
  if (atkBits.includes(bit.id)) { atk += 15; burst += 20; }
  else if (defBits.includes(bit.id)) { def += 20; sta += 8; }
  else if (staBits.includes(bit.id)) { sta += 20; def += 5; }
  else { atk += 8; sta += 8; def += 5; burst += 5; }

  // 左旋 burst 優勢
  if (blade.spin === '左旋') { burst += 15; sta += 5; }

  // 協同加成
  const syn = SYNERGY_BONUSES.find(s => s.blade === combo.blade && s.bit === combo.bit);
  if (syn) { atk += syn.bonus * 2; sta += syn.bonus; burst += syn.bonus; }

  const cap = v => Math.min(100, Math.max(0, v));
  return { attack: cap(atk), defense: cap(def), stamina: cap(sta), burst: cap(burst) };
}

export function getComboDescription(combo) {
  const blade = getPartById(combo.blade);
  const ratchet = getPartById(combo.ratchet);
  const bit = getPartById(combo.bit);
  if (!blade || !ratchet || !bit) return '';
  return `${blade.name} ${ratchet.name} ${bit.name}`;
}
// 發射方式建議系統
export function getLaunchAdvice(combo) {
  const blade = getPartById(combo.blade);
  const ratchet = getPartById(combo.ratchet);
  const bit = getPartById(combo.bit);
  if (!blade || !ratchet || !bit) return null;

  const atkBits = ['b-low-rush','b-rush','b-kick','b-trans-kick','b-rubber-accel','b-gear-flat','b-flat','b-low-flat','b-accel','b-gear-rush'];
  const staBits = ['b-ball','b-free-ball','b-glide','b-unite','b-high-taper','b-metal-needle','b-needle','b-orb','b-taper','b-dot','b-point'];
  const defBits = ['b-hexa','b-bound-spike','b-spike'];
  const balBits = ['b-elevate','b-level'];
  const isAtk = atkBits.includes(bit.id), isSta = staBits.includes(bit.id);
  const isDef = defBits.includes(bit.id), isBal = balBits.includes(bit.id);
  const isL = blade.spin === '左旋';
  const lowH = ratchet.height <= 55, hiH = ratchet.height >= 75;

  let r = { power:'', angle:'', timing:'', technique:'', detail:'', emoji:'', steps:[] };

  if (isAtk && ['b-low-rush','b-rush','b-gear-rush'].includes(bit.id)) {
    Object.assign(r, { power:'💪 全力 (90-100%)', angle:'📐 水平平射 (0°)', timing:'⏱️ 倒數同時發射，搶先觸發 X-Dash', technique:'滿力平射 (Full Power Flat Shot)', emoji:'🔥', detail:'全力拉繩觸發 Xtreme Dash，追求首次接觸 KO。',
      steps:['① 握持：發射器握把朝下，手臂自然伸直，發射器與場地面完全平行（0°角）','② 拉繩準備：拉繩拉到底端，非慣用手穩穩托住發射器本體，防止發射瞬間晃動','③ 瞄準：發射口對準場地中心偏外側約 2-3cm（讓陀螺沿弧線掃過中心）','④ 發射：倒數「1」時瞬間全力拉繩！手腕同時快速向內翻轉（像擰毛巾），額外增加 10-15% 初速','⑤ 跟進：發射後立刻收回手臂，不要干擾陀螺初始軌道']});
  } else if (isAtk && ['b-kick','b-trans-kick'].includes(bit.id)) {
    Object.assign(r, { power:'💪 強力 (80-90%)', angle:'📐 微傾斜射 (5-10°)', timing:'⏱️ 略慢於對手 0.5 秒', technique:'延遲踢射 (Delayed Kick Shot)', emoji:'🦶', detail:'微傾發射讓陀螺先穩定再觸發踢擊軌道。',
      steps:['① 握持：發射器微微向場地中心傾斜 5-10°（略微朝下）','② 等待：聽到對手發射聲後，默數 0.5 秒再拉繩（讓對手先落地）','③ 發射：80-90% 力道拉繩（不要全力），保持傾斜角度不變','④ 落地後陀螺先繞場 1-2 圈穩定，接著 Kick 軸心觸發不規則彈跳軌道撞向對手','⑤ 注意：全力平射會導致 Kick 亂飛甚至自爆出場']});
  } else if (isAtk && bit.id === 'b-rubber-accel') {
    Object.assign(r, { power:'💪 強力 (85-95%)', angle:'📐 水平平射 (0°)', timing:'⏱️ 與對手同步發射', technique:'橡膠加速射 (Rubber Accel Shot)', emoji:'⚡', detail:'橡膠抓地力帶來爆發加速。',
      steps:['① 握持：發射器完全水平','② 發射：85-95% 力道拉繩（保留 5-10% 控制力）','③ 落地後前 0.5 秒因橡膠摩擦暫時減速，然後突然爆發加速——這是 Rubber Accel 精髓','④ 禁忌：不要 100% 全力！過大初速讓橡膠軸心彈跳，反而失去抓地力']});
  } else if (isAtk) {
    Object.assign(r, { power:'💪 強力 (80-90%)', angle:'📐 水平平射 (0°)', timing:'⏱️ 標準時機', technique:'標準攻擊射 (Standard Attack Shot)', emoji:'⚔️', detail:'水平全力發射，發揮最大移動速度。',
      steps:['① 握持：發射器與場地面平行，手臂放鬆但穩定','② 瞄準：發射口朝向場地中心','③ 發射：均勻有力拉繩（80-90%），手腕保持固定不晃動','④ 要點：追求「穩定的強力」，軌道穩定比絕對速度更重要']});
  } else if (isDef) {
    const isHex = bit.id === 'b-hexa';
    Object.assign(r, { power:'🤚 中等 (50-65%)', angle:'📐 傾斜發射 (15-25°)', timing:'⏱️ 略早於對手發射，搶佔中心', technique:'傾斜定位射 (Tilt Position Shot)', emoji:'🛡️', detail:'中等力道傾斜發射，在中心建立防禦陣地。',
      steps: isHex ? ['① 握持：發射器朝場地中心傾斜 15-20°（想像時鐘 1 點方向）','② 力道控制：只用 50-65%！Hexa 需要穩定不需要速度，這是最關鍵的一步','③ 發射：平穩拉繩，想像「推」而不是「扯」，手臂全程穩定','④ 落地：陀螺以傾斜角落地 → 微晃 → Hexa 六角面立刻產生制動力 → 0.5秒內穩定在中心','⑤ 搶先：比對手早 0.3-0.5 秒發射，陀螺已穩定在中心等對手撞上來','⑥ 常見錯誤：力道太大讓 Hexa 無法制動，陀螺到處亂跑']
        : ['① 握持：發射器傾斜 15-25°','② 發射：中等力道穩定拉繩，目標讓陀螺落在場地正中心','③ 策略：防禦型勝利方式是「讓對手來撞你」，位置比速度重要','④ 心態：不要急，穩穩發射，讓尖刺/防禦軸心吸收衝擊反彈對手']});
  } else if (isSta && bit.id === 'b-free-ball') {
    Object.assign(r, { power:'🤚 中等偏弱 (40-55%)', angle:'📐 垂直下壓 (30-45°)', timing:'⏱️ 可略晚發射', technique:'柔力下壓射 (Soft Drop Shot)', emoji:'🎱', detail:'Free Ball 低速時最穩，大角度下壓讓陀螺穩定落入中心。',
      steps:['① 握持：發射器大角度傾斜 30-45°（幾乎朝下射），Free Ball 專用極端角度','② 力道：只用 40-55%！所有技巧中力道最小。Free Ball 自由滾動機構在低速最穩','③ 發射：輕柔但確實地拉繩，想像「讓陀螺溫柔降落」','④ 落地後：Free Ball 像不倒翁自動找到最穩定的旋轉軸心','⑤ 絕對禁忌：全力發射 Free Ball 是最常見新手錯誤！高速 Free Ball 完全失控','⑥ 進階：落點放在場地中心偏低處，利用場地弧面自然滑向最低點']});
  } else if (isSta) {
    Object.assign(r, { power:'🤚 中等 (45-60%)', angle:'📐 傾斜發射 (10-20°)', timing:'⏱️ 標準時機', technique:'穩定持久射 (Stable Stamina Shot)', emoji:'🔄', detail:'核心是「穩」不是「猛」，中等力道確保最長旋轉。',
      steps:['① 握持：發射器傾斜 10-20°，手臂放鬆','② 呼吸：發射前深呼吸一次穩定心神（持久戰關鍵是穩定性）','③ 發射：45-60% 均勻力道拉繩，全程手腕完全不動','④ 要訣：想像「遞出」陀螺而非「甩出」。越穩定 = 越少能量浪費 = 越長旋轉時間','⑤ 常見錯誤：手腕左右晃動產生「章動」（歪斜旋轉），大幅減少持久時間']});
  } else if (isBal && bit.id === 'b-elevate') {
    Object.assign(r, { power:isL?'💪 中強 (65-80%)':'💪 強力 (75-85%)', angle:'📐 微傾斜射 (5-15°)', timing:'⏱️ 與對手同步或略晚', technique:isL?'左旋升降射 (L-Spin Elevate Shot)':'升降攻擊射 (Elevate Attack Shot)', emoji:'↕️', detail:'Elevate 彎曲齒輪產生升降軌道。',
      steps: isL ? ['① 握持：左旋發射器裝填完成，傾斜 5-10°','② 力道：65-80% 中強力道。同化戰術不需最大速度，需要持續接觸頻率','③ 發射：穩定拉繩，注意左旋拉繩方向與右旋相反（向左拉）','④ 落地後以中速繞場，Elevate 升降軌道讓陀螺不斷上下跳動接觸對手','⑤ 同化原理：左旋碰右旋時「吸收」對手旋轉力。前期你會減速，但對手減速更快','⑥ 勝利條件：比誰最後還在轉。持續接觸，左旋 Elevate 幾乎必勝持久戰']
        : ['① 握持：發射器傾斜 5-15°','② 發射：75-85% 力道拉繩','③ Elevate 齒輪面在高速時產生高度變化，對手難以預測碰撞點','④ 對手是防禦型時，加大力道到 90% 利用高度變化突破防禦']});
  } else if (isBal && bit.id === 'b-level') {
    Object.assign(r, { power:isL?'💪 中強 (60-75%)':'💪 強力 (70-85%)', angle:'📐 斜射 (10-20°)', timing:isL?'⏱️ 略晚 0.5-1 秒，後發制人':'⏱️ 標準時機', technique:isL?'左旋變速射 (L-Spin Variable Shot)':'雙模式射 (Dual Mode Shot)', emoji:'🔀', detail:'Level 雙模式：前期 X-Dash 攻擊，後期自動切換持久。',
      steps: isL ? ['① 握持：左旋發射器傾斜 10-20°','② 時機：故意比對手晚 0.5-1 秒發射！讓對手先消耗','③ 發射：60-75% 力道，不要太猛','④ 前半場：Level 平坦面觸發中速移動，主動接觸對手吸收旋轉力','⑤ 後半場：速度降低後 Level 自動從「攻擊」切換「持久」模式，左旋優勢全面發揮','⑥ 精髓：「前攻後守」——前半消耗對手，後半用持久力取勝。這就是保留力道 60-75% 的原因']
        : ['① 握持：發射器傾斜 10-20°','② 發射：70-85% 力道拉繩','③ 前期 Level 平面產生移動力觸發 X-Dash','④ 後期速度降低自動切換持久模式','⑤ 斜射讓兩模式轉換更順暢']});
  }

  if (isL && !isBal) { r.technique = '左旋 ' + r.technique; r.steps.push('⬅️ 左旋提醒：拉繩方向相反。建議先空拉 3-5 次找感覺再正式發射'); }
  if (lowH && isAtk) r.steps.push('📏 低棘輪加成：重心極低，從對手下方攻擊產生上掀力，KO 效率最高的物理優勢');
  if (hiH) r.steps.push('📏 高棘輪注意：重心偏高容易頭重腳輕，發射時特別注意保持水平');
  return r;
}

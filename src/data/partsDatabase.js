// Beyblade X 完整零件資料庫 — 2026 Meta
export const DB_LAST_UPDATED = '2026-05-10';
export const PART_TYPES = {
  BLADE: 'blade',
  RATCHET: 'ratchet',
  BIT: 'bit',
  LOCK_CHIP: 'lockChip',
  MAIN_BLADE: 'mainBlade',
  ASSIST_BLADE: 'assistBlade',
};

export const SYSTEMS = { BX: 'BX', UX: 'UX', CX: 'CX' };
export const BLADE_TYPES = { ATTACK: '攻擊', DEFENSE: '防禦', STAMINA: '持久', BALANCE: '平衡' };
export const SPIN_DIR = { RIGHT: '右旋', LEFT: '左旋' };
export const TIERS = ['T0', 'T0.5', 'T1', 'T2', 'T3'];

export const BLADES = [
  // UX T0
  { id: 'wizard-rod', name: 'Wizard Rod', nameJP: '杖之魔術師', system: 'UX', type: '持久', spin: '右旋', tier: 'T0', code: 'UX-03' },
  { id: 'shark-scale', name: 'Shark Scale', nameJP: '鯊之鱗', system: 'UX', type: '攻擊', spin: '右旋', tier: 'T0', code: 'UX-15' },
  { id: 'cobalt-dragoon', name: 'Cobalt Dragoon', nameJP: '鈷藍龍騎', system: 'UX', type: '攻擊', spin: '左旋', tier: 'T0', code: 'UX-10' },
  { id: 'meteor-dragoon', name: 'Meteor Dragoon', nameJP: '流星龍騎', system: 'UX', type: '攻擊', spin: '左旋', tier: 'T0', code: 'UX-17' },
  // UX T0.5
  { id: 'hover-wyvern', name: 'Hover Wyvern', nameJP: '懸浮飛龍', system: 'UX', type: '攻擊', spin: '右旋', tier: 'T0.5', code: 'UX-20' },
  // UX T1
  { id: 'dran-buster-ux', name: 'Dran Buster', nameJP: '龍破', system: 'UX', type: '攻擊', spin: '右旋', tier: 'T1', code: 'UX-01' },
  { id: 'hells-hammer-ux', name: "Hell's Hammer", nameJP: '地獄之錘', system: 'UX', type: '攻擊', spin: '右旋', tier: 'T1', code: 'UX-02' },
  { id: 'impact-drake', name: 'Impact Drake', nameJP: '衝擊龍', system: 'UX', type: '攻擊', spin: '右旋', tier: 'T1', code: 'UX-11' },
  { id: 'aero-pegasus', name: 'Aero Pegasus', nameJP: '飛馬', system: 'UX', type: '平衡', spin: '右旋', tier: 'T1', code: 'UX-14' },
  { id: 'bullet-griffon', name: 'Bullet Griffon', nameJP: '子彈獅鷲', system: 'UX', type: '攻擊', spin: '右旋', tier: 'T1', code: 'UX-19' },
  // UX T2
  { id: 'silver-wolf', name: 'Silver Wolf', nameJP: '銀狼', system: 'UX', type: '平衡', spin: '右旋', tier: 'T2', code: 'UX-04' },
  { id: 'shinobi-shadow', name: 'Shinobi Shadow', nameJP: '忍者影', system: 'UX', type: '攻擊', spin: '右旋', tier: 'T2', code: 'UX-05' },
  { id: 'phoenix-rudder', name: 'Phoenix Rudder', nameJP: '鳳凰舵', system: 'UX', type: '持久', spin: '右旋', tier: 'T2', code: 'UX-06' },
  { id: 'leon-crest', name: 'Leon Crest', nameJP: '獅紋章', system: 'UX', type: '平衡', spin: '右旋', tier: 'T2', code: 'UX-07' },
  { id: 'knight-mail', name: 'Knight Mail', nameJP: '騎士鎧', system: 'UX', type: '防禦', spin: '右旋', tier: 'T2', code: 'UX-08' },
  { id: 'samurai-saber', name: 'Samurai Saber', nameJP: '武士刀', system: 'UX', type: '攻擊', spin: '右旋', tier: 'T2', code: 'UX-09' },
  { id: 'ghost-circle', name: 'Ghost Circle', nameJP: '幽靈圓環', system: 'UX', type: '持久', spin: '右旋', tier: 'T2', code: 'UX-12' },
  { id: 'golem-rock', name: 'Golem Rock', nameJP: '岩石巨人', system: 'UX', type: '防禦', spin: '右旋', tier: 'T2', code: 'UX-13' },
  { id: 'scorpio-spear', name: 'Scorpio Spear', nameJP: '天蠍矛', system: 'UX', type: '攻擊', spin: '右旋', tier: 'T2', code: 'UX-15' },
  { id: 'clock-mirage', name: 'Clock Mirage', nameJP: '時鐘幻影', system: 'UX', type: '持久', spin: '右旋', tier: 'T2', code: 'UX-16' },
  { id: 'mummy-curse', name: 'Mummy Curse', nameJP: '木乃伊詛咒', system: 'UX', type: '平衡', spin: '右旋', tier: 'T2', code: 'UX-18' },
  // BX
  { id: 'dran-sword', name: 'Dran Sword', nameJP: '龍劍', system: 'BX', type: '攻擊', spin: '右旋', tier: 'T3', code: 'BX-01' },
  { id: 'hells-scythe', name: "Hell's Scythe", nameJP: '地獄鐮刀', system: 'BX', type: '平衡', spin: '右旋', tier: 'T2', code: 'BX-02' },
  { id: 'knight-shield', name: 'Knight Shield', nameJP: '騎士盾', system: 'BX', type: '防禦', spin: '右旋', tier: 'T3', code: 'BX-04' },
  { id: 'wizard-arrow', name: 'Wizard Arrow', nameJP: '魔箭', system: 'BX', type: '持久', spin: '右旋', tier: 'T2', code: 'BX-05' },
  { id: 'viper-tail', name: 'Viper Tail', nameJP: '蛇尾', system: 'BX', type: '持久', spin: '右旋', tier: 'T3', code: 'BX-06' },
  { id: 'leon-claw', name: 'Leon Claw', nameJP: '獅爪', system: 'BX', type: '平衡', spin: '右旋', tier: 'T3', code: 'BX-07' },
  { id: 'phoenix-wing', name: 'Phoenix Wing', nameJP: '鳳翼', system: 'BX', type: '攻擊', spin: '右旋', tier: 'T2', code: 'BX-08' },
  { id: 'shark-edge', name: 'Shark Edge', nameJP: '鯊刃', system: 'BX', type: '攻擊', spin: '右旋', tier: 'T2', code: 'BX-09' },
  { id: 'tyranno-beat', name: 'Tyranno Beat', nameJP: '暴龍擊', system: 'BX', type: '攻擊', spin: '右旋', tier: 'T2', code: 'BX-10' },
  { id: 'hells-chain', name: "Hell's Chain", nameJP: '地獄鏈', system: 'BX', type: '防禦', spin: '右旋', tier: 'T2', code: 'BX-11' },
  { id: 'wyvern-gale', name: 'Wyvern Gale', nameJP: '飛龍風', system: 'BX', type: '持久', spin: '右旋', tier: 'T2', code: 'BX-12' },
  { id: 'cobalt-drake', name: 'Cobalt Drake', nameJP: '鈷藍龍', system: 'BX', type: '攻擊', spin: '右旋', tier: 'T2', code: 'BX-13' },
  { id: 'unicorn-sting', name: 'Unicorn Sting', nameJP: '獨角獸刺', system: 'BX', type: '平衡', spin: '右旋', tier: 'T3', code: 'BX-14' },
  { id: 'sphinx-cowl', name: 'Sphinx Cowl', nameJP: '獅身人面', system: 'BX', type: '防禦', spin: '右旋', tier: 'T3', code: 'BX-15' },
];

export const RATCHETS = [
  { id: 'r-0-60', name: '0-60', nameCN: '0齒-60', code: 'R 0-60', protrusions: 0, height: 60, tier: 'T2' },
  { id: 'r-0-70', name: '0-70', nameCN: '0齒-70', code: 'R 0-70', protrusions: 0, height: 70, tier: 'T2' },
  { id: 'r-0-80', name: '0-80', nameCN: '0齒-80', code: 'R 0-80', protrusions: 0, height: 80, tier: 'T2' },
  { id: 'r-1-50', name: '1-50', nameCN: '1齒-50', code: 'R 1-50', protrusions: 1, height: 50, tier: 'T2' },
  { id: 'r-1-60', name: '1-60', nameCN: '1齒-60', code: 'R 1-60', protrusions: 1, height: 60, tier: 'T0' },
  { id: 'r-1-70', name: '1-70', nameCN: '1齒-70', code: 'R 1-70', protrusions: 1, height: 70, tier: 'T0' },
  { id: 'r-1-80', name: '1-80', nameCN: '1齒-80', code: 'R 1-80', protrusions: 1, height: 80, tier: 'T2' },
  { id: 'r-2-60', name: '2-60', nameCN: '2齒-60', code: 'R 2-60', protrusions: 2, height: 60, tier: 'T1' },
  { id: 'r-2-70', name: '2-70', nameCN: '2齒-70', code: 'R 2-70', protrusions: 2, height: 70, tier: 'T2' },
  { id: 'r-2-80', name: '2-80', nameCN: '2齒-80', code: 'R 2-80', protrusions: 2, height: 80, tier: 'T2' },
  { id: 'r-3-60', name: '3-60', nameCN: '3齒-60', code: 'R 3-60', protrusions: 3, height: 60, tier: 'T0.5' },
  { id: 'r-3-70', name: '3-70', nameCN: '3齒-70', code: 'R 3-70', protrusions: 3, height: 70, tier: 'T2' },
  { id: 'r-3-80', name: '3-80', nameCN: '3齒-80', code: 'R 3-80', protrusions: 3, height: 80, tier: 'T2' },
  { id: 'r-3-85', name: '3-85', nameCN: '3齒-85', code: 'R 3-85 (O型)', protrusions: 3, height: 85, tier: 'T2' },
  { id: 'r-4-50', name: '4-50', nameCN: '4齒-50', code: 'R 4-50', protrusions: 4, height: 50, tier: 'T0' },
  { id: 'r-4-55', name: '4-55', nameCN: '4齒-55', code: 'R 4-55 (O型)', protrusions: 4, height: 55, tier: 'T2' },
  { id: 'r-4-60', name: '4-60', nameCN: '4齒-60', code: 'R 4-60', protrusions: 4, height: 60, tier: 'T1' },
  { id: 'r-4-70', name: '4-70', nameCN: '4齒-70', code: 'R 4-70', protrusions: 4, height: 70, tier: 'T2' },
  { id: 'r-4-80', name: '4-80', nameCN: '4齒-80', code: 'R 4-80', protrusions: 4, height: 80, tier: 'T2' },
  { id: 'r-5-60', name: '5-60', nameCN: '5齒-60', code: 'R 5-60', protrusions: 5, height: 60, tier: 'T0.5' },
  { id: 'r-5-70', name: '5-70', nameCN: '5齒-70', code: 'R 5-70', protrusions: 5, height: 70, tier: 'T2' },
  { id: 'r-5-80', name: '5-80', nameCN: '5齒-80', code: 'R 5-80', protrusions: 5, height: 80, tier: 'T2' },
  { id: 'r-6-60', name: '6-60', nameCN: '6齒-60', code: 'R 6-60', protrusions: 6, height: 60, tier: 'T2' },
  { id: 'r-6-70', name: '6-70', nameCN: '6齒-70', code: 'R 6-70', protrusions: 6, height: 70, tier: 'T2' },
  { id: 'r-6-80', name: '6-80', nameCN: '6齒-80', code: 'R 6-80', protrusions: 6, height: 80, tier: 'T2' },
  { id: 'r-7-55', name: '7-55', nameCN: '7齒-55', code: 'R 7-55 (O型)', protrusions: 7, height: 55, tier: 'T2' },
  { id: 'r-7-60', name: '7-60', nameCN: '7齒-60', code: 'R 7-60', protrusions: 7, height: 60, tier: 'T0.5' },
  { id: 'r-7-70', name: '7-70', nameCN: '7齒-70', code: 'R 7-70', protrusions: 7, height: 70, tier: 'T1' },
  { id: 'r-7-80', name: '7-80', nameCN: '7齒-80', code: 'R 7-80', protrusions: 7, height: 80, tier: 'T2' },
  { id: 'r-8-70', name: '8-70', nameCN: '8齒-70', code: 'R 8-70', protrusions: 8, height: 70, tier: 'T2' },
  { id: 'r-9-60', name: '9-60', nameCN: '9齒-60', code: 'R 9-60', protrusions: 9, height: 60, tier: 'T0' },
  { id: 'r-9-65', name: '9-65', nameCN: '9齒-65', code: 'R 9-65 (O型)', protrusions: 9, height: 65, tier: 'T2' },
  { id: 'r-9-70', name: '9-70', nameCN: '9齒-70', code: 'R 9-70', protrusions: 9, height: 70, tier: 'T1' },
  { id: 'r-9-80', name: '9-80', nameCN: '9齒-80', code: 'R 9-80', protrusions: 9, height: 80, tier: 'T2' },
  { id: 'r-m-85', name: 'M-85', nameCN: '融合型-85', code: 'R M-85 (融合)', protrusions: 0, height: 85, tier: 'T2' },
];

export const BITS = [
  { id: 'b-low-rush', name: 'Low Rush', nameCN: '低衝刺', abbr: 'LR', code: 'Bit LR', type: '攻擊', tier: 'T0' },
  { id: 'b-hexa', name: 'Hexa', nameCN: '六角防壁', abbr: 'H', code: 'Bit H', type: '防禦', tier: 'T0' },
  { id: 'b-elevate', name: 'Elevate', nameCN: '升降曲軌', abbr: 'E', code: 'Bit E', type: '平衡', tier: 'T0' },
  { id: 'b-level', name: 'Level', nameCN: '水平曲速', abbr: 'L', code: 'Bit L', type: '平衡', tier: 'T0' },
  { id: 'b-free-ball', name: 'Free Ball', nameCN: '自由球', abbr: 'FB', code: 'Bit FB', type: '持久', tier: 'T0' },
  { id: 'b-rubber-accel', name: 'Rubber Accel', nameCN: '橡膠加速', abbr: 'RA', code: 'Bit RA', type: '攻擊', tier: 'T1' },
  { id: 'b-rush', name: 'Rush', nameCN: '衝刺', abbr: 'R', code: 'Bit R', type: '攻擊', tier: 'T1' },
  { id: 'b-kick', name: 'Kick', nameCN: '踢擊', abbr: 'K', code: 'Bit K', type: '攻擊', tier: 'T1' },
  { id: 'b-trans-kick', name: 'Trans Kick', nameCN: '透明踢擊', abbr: 'TK', code: 'Bit TK', type: '攻擊', tier: 'T1' },
  { id: 'b-glide', name: 'Glide', nameCN: '滑行', abbr: 'G', code: 'Bit G', type: '持久', tier: 'T1' },
  { id: 'b-unite', name: 'Unite', nameCN: '聯合', abbr: 'U', code: 'Bit U', type: '持久', tier: 'T1' },
  { id: 'b-high-taper', name: 'High Taper', nameCN: '高錐', abbr: 'HT', code: 'Bit HT', type: '持久', tier: 'T1' },
  { id: 'b-ball', name: 'Ball', nameCN: '球', abbr: 'B', code: 'Bit B', type: '持久', tier: 'T1' },
  { id: 'b-metal-needle', name: 'Metal Needle', nameCN: '金屬針', abbr: 'MN', code: 'Bit MN', type: '持久', tier: 'T1' },
  { id: 'b-gear-flat', name: 'Gear Flat', nameCN: '齒輪平底', abbr: 'GF', code: 'Bit GF', type: '攻擊', tier: 'T1' },
  { id: 'b-accel', name: 'Accel', nameCN: '加速', abbr: 'A', code: 'Bit A', type: '攻擊', tier: 'T2' },
  { id: 'b-disc-ball', name: 'Disc Ball', nameCN: '圓盤球', abbr: 'DB', code: 'Bit DB', type: '持久', tier: 'T2' },
  { id: 'b-gear-ball', name: 'Gear Ball', nameCN: '齒輪球', abbr: 'GB', code: 'Bit GB', type: '持久', tier: 'T2' },
  { id: 'b-bound-spike', name: 'Bound Spike', nameCN: '彈跳尖刺', abbr: 'BS', code: 'Bit BS', type: '防禦', tier: 'T2' },
  { id: 'b-cyclone', name: 'Cyclone', nameCN: '旋風', abbr: 'C', code: 'Bit C', type: '攻擊', tier: 'T2' },
  { id: 'b-dot', name: 'Dot', nameCN: '圓點', abbr: 'D', code: 'Bit D', type: '持久', tier: 'T2' },
  { id: 'b-flat', name: 'Flat', nameCN: '平底', abbr: 'F', code: 'Bit F', type: '攻擊', tier: 'T2' },
  { id: 'b-low-flat', name: 'Low Flat', nameCN: '低平底', abbr: 'LF', code: 'Bit LF', type: '攻擊', tier: 'T2' },
  { id: 'b-gear-rush', name: 'Gear Rush', nameCN: '齒輪衝刺', abbr: 'GR', code: 'Bit GR', type: '攻擊', tier: 'T2' },
  { id: 'b-needle', name: 'Needle', nameCN: '針', abbr: 'N', code: 'Bit N', type: '持久', tier: 'T2' },
  { id: 'b-high-needle', name: 'High Needle', nameCN: '高針', abbr: 'HN', code: 'Bit HN', type: '持久', tier: 'T2' },
  { id: 'b-gear-needle', name: 'Gear Needle', nameCN: '齒輪針', abbr: 'GN', code: 'Bit GN', type: '持久', tier: 'T2' },
  { id: 'b-under-needle', name: 'Under Needle', nameCN: '下針', abbr: 'UN', code: 'Bit UN', type: '持久', tier: 'T2' },
  { id: 'b-orb', name: 'Orb', nameCN: '球體', abbr: 'O', code: 'Bit O', type: '持久', tier: 'T2' },
  { id: 'b-low-orb', name: 'Low Orb', nameCN: '低球體', abbr: 'LO', code: 'Bit LO', type: '持久', tier: 'T2' },
  { id: 'b-point', name: 'Point', nameCN: '尖端', abbr: 'P', code: 'Bit P', type: '持久', tier: 'T2' },
  { id: 'b-gear-point', name: 'Gear Point', nameCN: '齒輪尖端', abbr: 'GP', code: 'Bit GP', type: '持久', tier: 'T2' },
  { id: 'b-trans-point', name: 'Trans Point', nameCN: '透明尖端', abbr: 'TP', code: 'Bit TP', type: '持久', tier: 'T2' },
  { id: 'b-spike', name: 'Spike', nameCN: '尖刺', abbr: 'S', code: 'Bit S', type: '防禦', tier: 'T2' },
  { id: 'b-taper', name: 'Taper', nameCN: '錐形', abbr: 'T', code: 'Bit T', type: '持久', tier: 'T2' },
  { id: 'b-wedge', name: 'Wedge', nameCN: '楔形', abbr: 'W', code: 'Bit W', type: '攻擊', tier: 'T2' },
  { id: 'b-jolt', name: 'Jolt', nameCN: '衝擊', abbr: 'J', code: 'Bit J', type: '攻擊', tier: 'T2' },
  { id: 'b-operate', name: 'Operate', nameCN: '操控', abbr: 'Op', code: 'Bit Op', type: '特殊', tier: 'T2' },
  { id: 'b-quake', name: 'Quake', nameCN: '震動', abbr: 'Q', code: 'Bit Q', type: '攻擊', tier: 'T2' },
  { id: 'b-zap', name: 'Zap', nameCN: '電擊', abbr: 'Z', code: 'Bit Z', type: '攻擊', tier: 'T2' },
];

export const CX_LOCK_CHIPS = [
  { id: 'lc-bahamut', name: 'Bahamut', nameCN: '巴哈姆特', code: 'LC-Ba', type: '攻擊', tier: 'T2' },
  { id: 'lc-cerberus', name: 'Cerberus', nameCN: '地獄犬', code: 'LC-Ce', type: '攻擊', tier: 'T2' },
  { id: 'lc-dran', name: 'Dran', nameCN: '龍', code: 'LC-Dr', type: '攻擊', tier: 'T2' },
  { id: 'lc-emperor', name: 'Emperor', nameCN: '帝王', code: 'LC-Em', type: '攻擊', tier: 'T2' },
  { id: 'lc-eva', name: 'Eva', nameCN: '伊娃', code: 'LC-Ev', type: '平衡', tier: 'T2' },
  { id: 'lc-fox', name: 'Fox', nameCN: '狐狸', code: 'LC-Fo', type: '持久', tier: 'T2' },
  { id: 'lc-hells', name: 'Hells', nameCN: '地獄', code: 'LC-He', type: '攻擊', tier: 'T2' },
  { id: 'lc-hornet', name: 'Hornet', nameCN: '黃蜂', code: 'LC-Ho', type: '攻擊', tier: 'T2' },
  { id: 'lc-knight', name: 'Knight', nameCN: '騎士', code: 'LC-Kn', type: '防禦', tier: 'T2' },
  { id: 'lc-kraken', name: 'Kraken', nameCN: '海妖', code: 'LC-Kr', type: '攻擊', tier: 'T2' },
  { id: 'lc-leon', name: 'Leon', nameCN: '獅子', code: 'LC-Le', type: '平衡', tier: 'T2' },
  { id: 'lc-pegasus', name: 'Pegasus', nameCN: '天馬', code: 'LC-Pe', type: '攻擊', tier: 'T1' },
  { id: 'lc-perseus', name: 'Perseus', nameCN: '柏修斯', code: 'LC-Ps', type: '攻擊', tier: 'T2' },
  { id: 'lc-phoenix', name: 'Phoenix', nameCN: '鳳凰', code: 'LC-Ph', type: '持久', tier: 'T2' },
  { id: 'lc-ragna', name: 'Ragna', nameCN: '諸神黃昏', code: 'LC-Ra', type: '攻擊', tier: 'T2' },
  { id: 'lc-rhino', name: 'Rhino', nameCN: '犀牛', code: 'LC-Rh', type: '防禦', tier: 'T2' },
  { id: 'lc-sol', name: 'Sol', nameCN: '太陽', code: 'LC-So', type: '持久', tier: 'T2' },
  { id: 'lc-stag', name: 'Stag', nameCN: '鍬形蟲', code: 'LC-St', type: '攻擊', tier: 'T2' },
  { id: 'lc-unicorn', name: 'Unicorn', nameCN: '獨角獸', code: 'LC-Un', type: '平衡', tier: 'T2' },
  { id: 'lc-valkyrie', name: 'Valkyrie', nameCN: '女武神', code: 'LC-Va', type: '攻擊', tier: 'T2' },
  { id: 'lc-whale', name: 'Whale', nameCN: '鯨魚', code: 'LC-Wh', type: '防禦', tier: 'T2' },
  { id: 'lc-wizard', name: 'Wizard', nameCN: '魔術師', code: 'LC-Wi', type: '持久', tier: 'T1' },
  { id: 'lc-wolf', name: 'Wolf', nameCN: '狼', code: 'LC-Wo', type: '攻擊', tier: 'T2' },
];

export const CX_MAIN_BLADES = [
  { id: 'mb-blast', name: 'Blast', nameCN: '爆裂', code: 'MB-Bl', type: '攻擊', tier: 'T0' },
  { id: 'mb-might', name: 'Might', nameCN: '威力', code: 'MB-Mi', type: '攻擊', tier: 'T1' },
  { id: 'mb-reaper', name: 'Reaper', nameCN: '死神', code: 'MB-Re', type: '攻擊', tier: 'T1' },
  { id: 'mb-antler', name: 'Antler', nameCN: '鹿角', code: 'MB-An', type: '防禦', tier: 'T2' },
  { id: 'mb-arc', name: 'Arc', nameCN: '弧', code: 'MB-Ar', type: '平衡', tier: 'T2' },
  { id: 'mb-brave', name: 'Brave', nameCN: '勇者', code: 'MB-Br', type: '攻擊', tier: 'T2' },
  { id: 'mb-brush', name: 'Brush', nameCN: '刷', code: 'MB-Bu', type: '持久', tier: 'T3' },
  { id: 'mb-dark', name: 'Dark', nameCN: '暗黑', code: 'MB-Da', type: '攻擊', tier: 'T2' },
  { id: 'mb-eclipse', name: 'Eclipse', nameCN: '月蝕', code: 'MB-Ec', type: '平衡', tier: 'T2' },
  { id: 'mb-fang', name: 'Fang', nameCN: '獠牙', code: 'MB-Fa', type: '攻擊', tier: 'T2' },
  { id: 'mb-flame', name: 'Flame', nameCN: '火焰', code: 'MB-Fl', type: '攻擊', tier: 'T2' },
  { id: 'mb-flare', name: 'Flare', nameCN: '閃焰', code: 'MB-Fr', type: '持久', tier: 'T2' },
  { id: 'mb-fort', name: 'Fort', nameCN: '要塞', code: 'MB-Fo', type: '防禦', tier: 'T2' },
  { id: 'mb-hunt', name: 'Hunt', nameCN: '狩獵', code: 'MB-Hu', type: '攻擊', tier: 'T2' },
  { id: 'mb-volt', name: 'Volt', nameCN: '伏特', code: 'MB-Vo', type: '攻擊', tier: 'T2' },
  { id: 'mb-wriggle', name: 'Wriggle', nameCN: '蠕動', code: 'MB-Wr', type: '持久', tier: 'T3' },
];

export const CX_ASSIST_BLADES = [
  { id: 'ab-wheel', name: 'Wheel', nameCN: '車輪', code: 'AB-Wh', tier: 'T0', type: '平衡' },
  { id: 'ab-heavy', name: 'Heavy', nameCN: '重裝', code: 'AB-Hv', tier: 'T0', type: '攻擊' },
  { id: 'ab-erase', name: 'Erase', nameCN: '消除', code: 'AB-Er', tier: 'T1', type: '防禦' },
  { id: 'ab-slash', name: 'Slash', nameCN: '斬擊', code: 'AB-Sl', tier: 'T1', type: '攻擊' },
  { id: 'ab-massive', name: 'Massive', nameCN: '巨大', code: 'AB-Ma', tier: 'T1', type: '防禦' },
  { id: 'ab-assault', name: 'Assault', nameCN: '突擊', code: 'AB-As', tier: 'T2', type: '攻擊' },
  { id: 'ab-bumper', name: 'Bumper', nameCN: '緩衝', code: 'AB-Bu', tier: 'T2', type: '防禦' },
  { id: 'ab-charge', name: 'Charge', nameCN: '衝鋒', code: 'AB-Ch', tier: 'T2', type: '攻擊' },
  { id: 'ab-dual', name: 'Dual', nameCN: '雙重', code: 'AB-Du', tier: 'T2', type: '平衡' },
  { id: 'ab-free', name: 'Free', nameCN: '自由', code: 'AB-Fr', tier: 'T2', type: '持久' },
  { id: 'ab-jaggy', name: 'Jaggy', nameCN: '鋸齒', code: 'AB-Ja', tier: 'T2', type: '攻擊' },
  { id: 'ab-knuckle', name: 'Knuckle', nameCN: '指節', code: 'AB-Kn', tier: 'T2', type: '攻擊' },
  { id: 'ab-odd', name: 'Odd', nameCN: '奇數', code: 'AB-Od', tier: 'T2', type: '特殊' },
  { id: 'ab-round', name: 'Round', nameCN: '圓形', code: 'AB-Ro', tier: 'T2', type: '持久' },
  { id: 'ab-turn', name: 'Turn', nameCN: '旋轉', code: 'AB-Tu', tier: 'T2', type: '平衡' },
  { id: 'ab-vertical', name: 'Vertical', nameCN: '垂直', code: 'AB-Ve', tier: 'T2', type: '攻擊' },
  { id: 'ab-zillion', name: 'Zillion', nameCN: '無數', code: 'AB-Zi', tier: 'T2', type: '攻擊' },
];

// === 模組級快取（避免每次呼叫重建陣列）===
let _allPartsCache = null;
let _partByIdMap = null;

export function getAllParts() {
  if (!_allPartsCache) {
    _allPartsCache = [
      ...BLADES.map(p => ({ ...p, partType: PART_TYPES.BLADE })),
      ...RATCHETS.map(p => ({ ...p, partType: PART_TYPES.RATCHET })),
      ...BITS.map(p => ({ ...p, partType: PART_TYPES.BIT })),
      ...CX_LOCK_CHIPS.map(p => ({ ...p, partType: PART_TYPES.LOCK_CHIP })),
      ...CX_MAIN_BLADES.map(p => ({ ...p, partType: PART_TYPES.MAIN_BLADE })),
      ...CX_ASSIST_BLADES.map(p => ({ ...p, partType: PART_TYPES.ASSIST_BLADE })),
    ];
  }
  return _allPartsCache;
}

export function getPartById(id) {
  if (!_partByIdMap) {
    _partByIdMap = {};
    getAllParts().forEach(p => { _partByIdMap[p.id] = p; });
  }
  return _partByIdMap[id] || null;
}

/** 取得零件顯示名稱（中英文） */
export function getPartDisplayName(p) {
  if (!p) return '?';
  const cn = p.nameJP || p.nameCN || '';
  return cn ? `${p.name} ${cn}` : p.name;
}

export const TIER_COLORS = {
  'T0': '#ff6b6b', 'T0.5': '#ffa94d', 'T1': '#ffd43b', 'T2': '#69db7c', 'T3': '#868e96',
};

export const TYPE_ICONS = {
  '攻擊': '⚔️', '防禦': '🛡️', '持久': '🔄', '平衡': '⚖️', '特殊': '✨',
};


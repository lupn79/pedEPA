window.EPA_DATA = (function(){
// 兒童職能治療 Ad-hoc EPA 即時評核 — 資料模型與商業邏輯
// 純資料 / 計算，無 UI。

// ── 信賴等級量尺（換算為 1–5 分，5 分為滿分）───────
const SCALE = [
  { code: '1a', val: 1,    lv: 'Lv.1', label: '不足以評量' },
  { code: '1b', val: 1.5,  lv: 'Lv.1', label: '僅能觀察，不能操作' },
  { code: '2a', val: 2,    lv: 'Lv.2', label: '教師在旁逐步共同操作' },
  { code: '2b', val: 2.5,  lv: 'Lv.2', label: '教師在旁必要時協助' },
  { code: '3a', val: 3,    lv: 'Lv.3', label: '教師事後逐項確認' },
  { code: '3b', val: 3.5,  lv: 'Lv.3', label: '教師事後重點確認' },
  { code: '3c', val: 3.75, lv: 'Lv.3', label: '必要時知會教師確認' },
  { code: '4',  val: 4,    lv: 'Lv.4', label: '獨立執行' },
  { code: '5',  val: 5,    lv: 'Lv.5', label: '可對其他資淺學員進行監督' },
];
const NA = { code: 'NA', val: null, lv: 'NA', label: '不適用／未評估' };

const valByCode = {};
SCALE.forEach(s => { valByCode[s.code] = s.val; });
const codeByVal = {};
SCALE.forEach(s => { codeByVal[s.val] = s.code; });

function labelForCode(code) {
  if (code === 'NA' || code == null) return NA.label;
  const s = SCALE.find(x => x.code === code);
  return s ? s.label : '';
}
function lvForCode(code) {
  if (code === 'NA' || code == null) return 'NA';
  const s = SCALE.find(x => x.code === code);
  return s ? s.lv : '';
}

// ── 個案診斷選項（兒童核心課程項目）──────────────
const DIAGNOSES = ['整體發展遲緩', '智力發展疾患', '自閉症光譜疾患', '注意力缺失／過動疾患', '學習障礙疾患', '發展性運動協調疾患', '感覺統合功能障礙', '唐氏症', '腦性麻痺', '早產兒', '感官障礙（視／聽障）', '燒燙傷', '癌症', '手外傷', '遺傳代謝疾患', '情緒障礙疾患', '罕見疾病', '其它'];

// EPA1 評估工具類別（評估面向）
const ASSESS_ITEMS = ['整體綜合發展', '生活作息及參與（含環境評估）', '日常生活功能或遊戲', '知覺動作能力或感覺統合', '綜合成效評估（COPM／GAS／COTE）'];

// ── 4 個 EPA 定義 ─────────────────────────────────
const EPAS = [
  {
    id: 'EPA1', no: 1, title: '執行職能治療評估', short: '評估',
    desc: '接獲轉介個案時，閱讀病歷紀錄及相關檢查報告，透過訪談蒐集病史；依個案之診斷與狀況，選擇適當之評量方法進行評量。',
    assessItems: true, minCtx: 3,
    items: [
      '進行個案身份辨識，確認醫師開具之診斷、照會或醫囑，準備進行職能治療評估。',
      '能有系統地獲取完整且正確的病史及相關資料（含閱讀病歷紀錄）。',
      '進行訪談並執行臨床觀察（建立職能側寫檔案 occupational profile）。',
      '能依照個案之診斷及狀況，選擇適當的評估工具。',
      '執行標準化／非標準化評估工具，包含施測步驟、指導語、計分與結果計算。',
      '評估過程能注意個案的隱私、舒適和安全，並遵守保密原則。',
      '依據個案狀況調整施測指令、評估程序或評估方法。',
      '向家屬／照顧者／個案說明評估結果、治療介入目標與計畫，並與其進行有效溝通與討論。',
    ],
  },
  {
    id: 'EPA2', no: 2, title: '執行職能治療介入', short: '介入',
    desc: '依評估及訪談結果進行專業推理，依個案能力設計並執行治療活動，以改善兒童之職能問題。',
    minCtx: 3,
    items: [
      '辨識個案，確認醫師開具之診斷、照會或醫囑，準備進行職能治療介入。',
      '依照評估及訪談結果進行專業推理並依個案能力設計治療活動以改善個案職能問題（應用參考架構、基礎理論或新實證療法）。',
      '執行治療介入前和個案與家屬溝通並獲得同意。',
      '執行治療介入之流程符合醫學倫理與職能治療常規。',
      '執行治療介入時能注意個案之安全及生理變化，若有狀況能迅速判斷並尋求團隊協助（如跌倒、癲癇發作等）。',
      '執行治療介入期間能同理及傾聽與晤談，適時提供意見或給予情緒支持。',
      '能維持照顧品質，並完成相關行政程序（例如報到入帳、追蹤排程、清消等）。',
    ],
  },
  {
    id: 'EPA3', no: 3, title: '提供衛教與諮詢', short: '衛教',
    desc: '針對門／住院個案，於篩檢、評估、治療或結案等情境提供職能治療衛教與諮商，與家庭共同發展可執行的職能策略。',
    minCtx: 1,
    items: [
      '衛教與諮商進行前，能維持良好醫病關係／治療性關係（自我介紹、寒暄互動並獲得同意，重視個資及隱私，尊重個案及其家屬）。',
      '以個案或家庭為中心模式進行晤談。',
      '接收訊息時，能傾聽、同理、觀察，理解對方觀點和感受，適時提供情感支持。',
      '表達訊息時，能以個案或家屬能理解的方式進行說明、持續確認對方的理解與釐清，使議題明確。',
      '能依據職能治療專業知識進行臨床推理及說明內容，與個案或家屬共同發展出職能策略（適合／具體／量化／明確可執行的居家活動）。',
      '視需要，可製作及提供個案或家屬衛教資訊或單張（例如以倒序方式教導穿上衣，讓孩子可完成 20%）。',
      '衛教與諮商結束前，視需求主動提供醫療／社會資源／教育相關資訊。',
    ],
  },
  {
    id: 'EPA4', no: 4, title: '撰寫職能治療紀錄', short: '紀錄',
    desc: '撰寫符合 CARE 原則之兒童職能治療紀錄，含主訴、職能表現、評估、介入過程、問題分析與以家庭為中心之計畫。',
    minCtx: 1,
    reportTypes: ['初評報告', '進展／再評報告', '結案報告'],
    items: [
      '能正確詳實且具體列出個案及其家庭的主訴與期待。',
      '描述個案目前在其職能活動中的表現及參與（可參考 ICF-CY 或 OTPF）。',
      '能正確判讀及記錄相關評估工具之結果。',
      '能詳實地記錄介入的過程（含介入策略、方式、行為表現與療效）。',
      '綜合個案的主訴、期待及職能表現，以臨床推理方式分析、彙整及排序個案的主要問題。',
      '依主要問題選擇適合的參考架構，以家庭為中心，列出適當的長短期介入目標。',
      '介入計畫須包含介入策略、介入方法、介入頻率及執行的情境等。',
      '提供適當的親職衛教／學校建議。',
      '能清楚地說明後續的介入建議（如：繼續治療的必要性）。',
      '能清楚地說明結案原因及結案後的後續建議。',
      '能準時完成病歷書寫，符合工作單位的格式規定。',
    ],
  },
];

const epaById = {};
EPAS.forEach(e => { epaById[e.id] = e; });

// ── 訓練階段與期望達成等級 ───────────────────────
// PGY1 訓練結束前應達 Lv.3b；PGY2 結束前 Lv.4
// 新進員工 滿半年 Lv.4、滿一年 Lv.5
const STAGES = ['PGY1', 'PGY2', '新進員工'];
const TARGET = { PGY1: 3.5, PGY2: 4, '新進員工': 4 };
const TARGET_LABEL = { PGY1: '3b', PGY2: '4', '新進員工': '4' };

const SOURCES = ['OPD', '住院'];
const DEPTS = ['復健科', '兒科', '新生兒科（NICU）', '兒童發展評估中心', '早期療育中心', '其他'];

// ── 訓練軌道與期別自動推算 ──────────────────────
const TRACKS = ['PGY', '新進員工'];
function yearsBetween(startDate, asOf) {
  if (!startDate) return 0;
  const s = new Date(startDate).getTime();
  const n = (asOf ? new Date(asOf) : new Date()).getTime();
  return Math.max(0, (n - s) / (365.25 * 24 * 3600 * 1000));
}
function deriveStage(track, startDate, asOf) {
  if (track === '新進員工') return '新進員工';
  return yearsBetween(startDate, asOf) < 1 ? 'PGY1' : 'PGY2';
}
function deriveYears(startDate, asOf) { return yearsBetween(startDate, asOf); }

// ── 評核者名冊（種子）────────────────────────────
const TEACHERS = ['吳孟玲 OT', '許志明 OT', '林雅琪 OT'];

// ── 種子亂數 ──────────────────────────────────────
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function valToCode(v) {
  let best = SCALE[0];
  let bd = Infinity;
  for (const s of SCALE) {
    const d = Math.abs(s.val - v);
    if (d < bd) { bd = d; best = s; }
  }
  return best.code;
}

// ── 學員名冊（種子）──────────────────────────────
const STUDENT_ROSTER = [
  { id: 's1', name: '林佳蓉', track: 'PGY',      startDate: '2025-11-13', active: true },
  { id: 's2', name: '陳冠宇', track: 'PGY',      startDate: '2026-01-25', active: true },
  { id: 's3', name: '黃詩涵', track: 'PGY',      startDate: '2025-09-04', active: true },
  { id: 's4', name: '張雅婷', track: 'PGY',      startDate: '2024-12-20', active: true },
  { id: 's5', name: '王建豪', track: 'PGY',      startDate: '2024-10-11', active: true },
  { id: 's6', name: '李孟潔', track: '新進員工', startDate: '2026-01-01', active: true },
];

const GEN_ASOF = '2026-06-20';
const STUDENT_DEFS = STUDENT_ROSTER.map((s, i) => {
  const profiles = [
    { base: 2.3, slope: 0.20, seed: 11 },
    { base: 1.9, slope: 0.17, seed: 23 },
    { base: 2.6, slope: 0.18, seed: 31 },
    { base: 3.4, slope: 0.13, seed: 47 },
    { base: 3.2, slope: 0.12, seed: 59 },
    { base: 3.8, slope: 0.13, seed: 71 },
  ][i];
  return {
    ...s,
    stage: deriveStage(s.track, s.startDate, GEN_ASOF),
    years: deriveYears(s.startDate, GEN_ASOF),
    ...profiles,
  };
});

const STUDENTS = STUDENT_DEFS.map(s => ({ id: s.id, name: s.name, track: s.track, startDate: s.startDate, active: s.active }));
const studentById = {};
STUDENTS.forEach(s => { studentById[s.id] = s; });

function fmtDate(d) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const QUAL_POOL = [
  '能主動閱讀病歷並整理重點，對兒童發展里程碑掌握度佳；建議多練習評估工具的計分與結果描述。',
  '與孩子及家長互動自然、善用遊戲建立關係，家長回饋正向。下次可更聚焦於主要問題的排序。',
  '介入活動分級得宜、注意安全，遇狀況時尚需教師提示，鼓勵持續累積經驗。',
  '紀錄書寫清晰，CARE 原則大致符合；介入目標可再具體化、量化並以家庭為中心。',
  '親職衛教貼近家庭日常情境，單張製作用心；對不熟悉議題能適時保留並查證，值得肯定。',
  '整體表現穩定進步，已能在必要時知會教師後獨立完成大部分步驟。',
  '評估工具選擇適當，惟對幼兒的指導語可再精簡、活潑；持續加油。',
];

let _seq = 1000;
function genAssessments() {
  const list = [];
  const today = new Date('2026-06-20');
  STUDENT_DEFS.forEach(sd => {
    const rnd = mulberry32(sd.seed);
    const n = 7 + Math.floor(rnd() * 4);
    for (let i = 0; i < n; i++) {
      const epa = EPAS[Math.floor(rnd() * EPAS.length)];
      const daysAgo = Math.round((n - i) * (12 + rnd() * 16));
      const d = new Date(today); d.setDate(d.getDate() - daysAgo);
      const progress = i / Math.max(1, n - 1);
      const center = sd.base + sd.slope * progress * (n - 1) * 0.8;
      const overallV = Math.max(1, Math.min(5, center + (rnd() - 0.5) * 0.5));
      const overall = valToCode(overallV);
      const items = epa.items.map(() => {
        if (rnd() < 0.06) return 'NA';
        const v = Math.max(1, Math.min(5, center + (rnd() - 0.5) * 0.9));
        return valToCode(v);
      });
      const diagnosis = DIAGNOSES[Math.floor(rnd() * (DIAGNOSES.length - 1))];
      const ctx = {
        diagnosis: [diagnosis],
        diagnosisOther: '',
        assessItems: epa.assessItems
          ? ASSESS_ITEMS.filter(() => rnd() < 0.4).slice(0, 3)
          : [],
        source: SOURCES[Math.floor(rnd() * SOURCES.length)],
        dept: DEPTS[Math.floor(rnd() * DEPTS.length)],
        ward: rnd() < 0.6 ? '' : (8 + Math.floor(rnd() * 6)) + 'B',
        reportType: epa.id === 'EPA4' ? epa.reportTypes[Math.floor(rnd() * 3)] : '',
      };
      list.push({
        id: 'a' + (_seq++),
        studentId: sd.id,
        epaId: epa.id,
        date: fmtDate(d),
        _ts: d.getTime(),
        evaluator: TEACHERS[Math.floor(rnd() * TEACHERS.length)],
        stage: sd.stage,
        years: sd.years,
        context: ctx,
        overall,
        items,
        qualitative: QUAL_POOL[Math.floor(rnd() * QUAL_POOL.length)],
      });
    }
  });
  list.sort((a, b) => a._ts - b._ts);
  return list;
}

const SEED_ASSESSMENTS = genAssessments();

function assessmentMean(a) {
  const vals = a.items.map(c => valByCode[c]).filter(v => v != null);
  if (a.overall && valByCode[a.overall] != null) return valByCode[a.overall];
  if (!vals.length) return null;
  return vals.reduce((x, y) => x + y, 0) / vals.length;
}
function itemMean(a) {
  const vals = a.items.map(c => valByCode[c]).filter(v => v != null);
  if (!vals.length) return null;
  return vals.reduce((x, y) => x + y, 0) / vals.length;
}
function cohortSeries(assessments, stage, epaId) {
  const rel = assessments.filter(a => a.stage === stage && (!epaId || a.epaId === epaId))
    .sort((a, b) => a._ts - b._ts);
  return rel.map(a => ({ ts: a._ts, date: a.date, v: valByCode[a.overall] }));
}
function fmtYears(y) {
  if (y == null) return '';
  if (y < 1) return Math.round(y * 12) + ' 個月';
  const yrs = Math.floor(y), mo = Math.round((y - yrs) * 12);
  if (mo === 0) return yrs + ' 年';
  if (mo === 12) return (yrs + 1) + ' 年';
  return yrs + ' 年 ' + mo + ' 個月';
}

return {SCALE, NA, valByCode, codeByVal, labelForCode, lvForCode, DIAGNOSES, ASSESS_ITEMS, EPAS, epaById, STAGES, TARGET, TARGET_LABEL, SOURCES, DEPTS, TEACHERS, STUDENTS, studentById, SEED_ASSESSMENTS, assessmentMean, itemMean, cohortSeries, fmtYears, TRACKS, yearsBetween, deriveStage, deriveYears, STUDENT_ROSTER};
})();

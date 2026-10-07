import {
  TrainingRecord, KPIStats, FeedbackSentiment,
  InstructorStats, FeedbackTheme, ChartDataPoint,
} from './types';

// ── KPIs ──────────────────────────────────────────────
export function computeKPIs(records: TrainingRecord[]): KPIStats {
  if (records.length === 0) {
    return { totalSessions: 0, averageRating: 0, totalParticipants: 0, activeInstructors: 0 };
  }
  return {
    totalSessions: records.length,
    averageRating: Math.round((records.reduce((s, r) => s + r.rating, 0) / records.length) * 100) / 100,
    totalParticipants: records.reduce((s, r) => s + r.participant_count, 0),
    activeInstructors: new Set(records.map(r => r.instructor)).size,
  };
}

// ── Chart data helpers ────────────────────────────────
export function getRatingDistribution(records: TrainingRecord[]): ChartDataPoint[] {
  const dist: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
  records.forEach(r => { dist[String(Math.round(r.rating))]++; });
  return Object.entries(dist).map(([k, v]) => ({ name: `${k} ★`, value: v }));
}

export function getAverageRatingByInstructor(records: TrainingRecord[]): ChartDataPoint[] {
  const m = new Map<string, { sum: number; count: number }>();
  records.forEach(r => {
    const e = m.get(r.instructor) ?? { sum: 0, count: 0 };
    e.sum += r.rating; e.count++;
    m.set(r.instructor, e);
  });
  return [...m.entries()]
    .map(([name, { sum, count }]) => ({ name, value: Math.round((sum / count) * 100) / 100, sessions: count }))
    .sort((a, b) => b.value - a.value);
}

export function getAverageRatingByDepartment(records: TrainingRecord[]): ChartDataPoint[] {
  const m = new Map<string, { sum: number; count: number }>();
  records.forEach(r => {
    const e = m.get(r.department) ?? { sum: 0, count: 0 };
    e.sum += r.rating; e.count++;
    m.set(r.department, e);
  });
  return [...m.entries()]
    .map(([name, { sum, count }]) => ({ name, value: Math.round((sum / count) * 100) / 100 }))
    .sort((a, b) => b.value - a.value);
}

export function getAverageRatingByCourse(records: TrainingRecord[]): ChartDataPoint[] {
  const m = new Map<string, { sum: number; count: number; participants: number }>();
  records.forEach(r => {
    const e = m.get(r.course) ?? { sum: 0, count: 0, participants: 0 };
    e.sum += r.rating; e.count++; e.participants += r.participant_count;
    m.set(r.course, e);
  });
  return [...m.entries()]
    .map(([name, { sum, count, participants }]) => ({ name, value: Math.round((sum / count) * 100) / 100, participants }))
    .sort((a, b) => b.value - a.value);
}

export function getSessionsOverTime(records: TrainingRecord[]): ChartDataPoint[] {
  const m = new Map<string, number>();
  records.forEach(r => { const mo = r.training_date.substring(0, 7); m.set(mo, (m.get(mo) ?? 0) + 1); });
  return [...m.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([name, value]) => ({ name, value }));
}

export function getTopCoursesByParticipation(records: TrainingRecord[]): ChartDataPoint[] {
  const m = new Map<string, number>();
  records.forEach(r => m.set(r.course, (m.get(r.course) ?? 0) + r.participant_count));
  return [...m.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

export function getParticipantsByDepartment(records: TrainingRecord[]): ChartDataPoint[] {
  const m = new Map<string, number>();
  records.forEach(r => m.set(r.department, (m.get(r.department) ?? 0) + r.participant_count));
  return [...m.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

export function getMonthlyActivity(records: TrainingRecord[]): ChartDataPoint[] {
  const m = new Map<string, { sessions: number; participants: number }>();
  records.forEach(r => {
    const mo = r.training_date.substring(0, 7);
    const e = m.get(mo) ?? { sessions: 0, participants: 0 };
    e.sessions++; e.participants += r.participant_count;
    m.set(mo, e);
  });
  return [...m.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, { sessions, participants }]) => ({ name, value: sessions, participants }));
}

// ── Instructor table ──────────────────────────────────
export function getInstructorTable(records: TrainingRecord[]): InstructorStats[] {
  const m = new Map<string, { sum: number; count: number; participants: number }>();
  records.forEach(r => {
    const e = m.get(r.instructor) ?? { sum: 0, count: 0, participants: 0 };
    e.sum += r.rating; e.count++; e.participants += r.participant_count;
    m.set(r.instructor, e);
  });
  return [...m.entries()]
    .map(([instructor, { sum, count, participants }]) => ({
      instructor, sessions: count,
      averageRating: Math.round((sum / count) * 100) / 100,
      totalParticipants: participants,
    }))
    .sort((a, b) => b.averageRating - a.averageRating);
}

export function getRecentSessions(records: TrainingRecord[], count = 10): TrainingRecord[] {
  return [...records].sort((a, b) => b.training_date.localeCompare(a.training_date)).slice(0, count);
}

// ── Feedback sentiment ────────────────────────────────
const POS_KW = ['excellent','great','helpful','enjoyed','clear','well-structured','best','recommend','engaging','confident','useful','knowledgeable','patient','outstanding','fantastic','exceeded'];
const NEG_KW = ['too fast','too short','difficult','not enough','too much','rushed','outdated','unprepared','struggled','hard to','disrupted','not relevant','not appropriate'];

export function classifyFeedback(text: string): 'positive' | 'neutral' | 'negative' {
  const lower = text.toLowerCase();
  const pos = POS_KW.filter(k => lower.includes(k)).length;
  const neg = NEG_KW.filter(k => lower.includes(k)).length;
  if (pos > neg) return 'positive';
  if (neg > pos) return 'negative';
  return 'neutral';
}

export function getFeedbackSentiment(records: TrainingRecord[]): FeedbackSentiment {
  const r: FeedbackSentiment = { positive: 0, neutral: 0, negative: 0 };
  records.forEach(rec => { r[classifyFeedback(rec.feedback)]++; });
  return r;
}

export function getCommonThemes(records: TrainingRecord[]): FeedbackTheme[] {
  const themes: Record<string, string> = {
    'Practical examples': 'practical|hands-on|real-world|case stud',
    'Clear explanations': 'clear|explained|accessible',
    'Good pacing': 'pacing|well-structured|organized',
    'Engaging delivery': 'engaging|interactive|energy',
    'Too fast paced': 'too fast|struggled to keep',
    'Insufficient duration': 'too short|not enough time',
    'Needs more exercises': 'not enough practical|too much theory',
    'Outdated content': 'outdated|could use updating',
    'Too much information': 'too much text|too much information',
    'Insufficient discussion': 'more discussion|rushed through',
    'Difficulty level': 'difficulty|not appropriate|hard to follow',
    'Group activities': 'group|discussion|interaction',
  };
  return Object.entries(themes)
    .map(([theme, pat]) => ({ theme, count: records.filter(r => new RegExp(pat, 'i').test(r.feedback)).length }))
    .filter(t => t.count > 0)
    .sort((a, b) => b.count - a.count);
}

// ── Filters ───────────────────────────────────────────
export interface FilterOptions {
  departments?: string[];
  courses?: string[];
  instructors?: string[];
  dateFrom?: string;
  dateTo?: string;
}

export function filterRecords(records: TrainingRecord[], f: FilterOptions): TrainingRecord[] {
  return records.filter(r => {
    if (f.departments?.length && !f.departments.includes(r.department)) return false;
    if (f.courses?.length && !f.courses.includes(r.course)) return false;
    if (f.instructors?.length && !f.instructors.includes(r.instructor)) return false;
    if (f.dateFrom && r.training_date < f.dateFrom) return false;
    if (f.dateTo && r.training_date > f.dateTo) return false;
    return true;
  });
}

// ── Claude context builder ────────────────────────────
export function prepareClaudeContext(records: TrainingRecord[]): string {
  const stats = computeKPIs(records);
  const byDept = getAverageRatingByDepartment(records);
  const byCourse = getAverageRatingByCourse(records);
  const byInstr = getAverageRatingByInstructor(records);
  const sent = getFeedbackSentiment(records);
  const themes = getCommonThemes(records);
  const uniqueFb = [...new Set(records.slice(0, 60).map(r => r.feedback))];

  return `TRAINING DATASET SUMMARY:
- Total sessions: ${stats.totalSessions}
- Average rating: ${stats.averageRating.toFixed(2)} / 5.0
- Total participants: ${stats.totalParticipants}
- Active instructors: ${stats.activeInstructors}

FEEDBACK SENTIMENT:
- Positive: ${sent.positive} (${((sent.positive / stats.totalSessions) * 100).toFixed(1)}%)
- Neutral: ${sent.neutral} (${((sent.neutral / stats.totalSessions) * 100).toFixed(1)}%)
- Negative: ${sent.negative} (${((sent.negative / stats.totalSessions) * 100).toFixed(1)}%)

DEPARTMENT STATISTICS:
${byDept.map(d => `- ${d.name}: avg rating ${d.value.toFixed(2)}`).join('\n')}

COURSE STATISTICS:
${byCourse.map(c => `- ${c.name}: avg rating ${c.value.toFixed(2)}, ${c.participants} total participants`).join('\n')}

INSTRUCTOR STATISTICS:
${byInstr.map(i => `- ${i.name}: avg rating ${i.value.toFixed(2)}, ${i.sessions} sessions`).join('\n')}

COMMON FEEDBACK THEMES:
${themes.map(t => `- "${t.theme}": mentioned in ${t.count} sessions`).join('\n')}

SAMPLE FEEDBACK (${uniqueFb.length} unique):
${uniqueFb.map((f, i) => `${i + 1}. "${f}"`).join('\n')}`;
}

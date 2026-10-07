export interface TrainingRecord {
  training_id: string;
  training_date: string;
  instructor: string;
  course: string;
  department: string;
  rating: number;
  participant_count: number;
  feedback: string;
}

export interface DatasetInfo {
  records: TrainingRecord[];
  source: 'demo' | 'uploaded';
  fileName?: string;
}

export interface KPIStats {
  totalSessions: number;
  averageRating: number;
  totalParticipants: number;
  activeInstructors: number;
}

export interface FeedbackSentiment {
  positive: number;
  neutral: number;
  negative: number;
}

export interface InstructorStats {
  instructor: string;
  sessions: number;
  averageRating: number;
  totalParticipants: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface FeedbackTheme {
  theme: string;
  count: number;
}

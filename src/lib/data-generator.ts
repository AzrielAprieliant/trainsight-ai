import { TrainingRecord } from './types';

/* Seeded PRNG for consistent demo data across page loads */
function createRNG(seed: number) {
  let s = seed;
  return {
    next(): number {
      s = (s * 1664525 + 1013904223) & 0x7fffffff;
      return s / 0x7fffffff;
    },
    nextInt(min: number, max: number): number {
      return Math.floor(this.next() * (max - min + 1)) + min;
    },
    pick<T>(arr: T[]): T {
      return arr[Math.floor(this.next() * arr.length)];
    },
  };
}

const INSTRUCTORS = [
  'Sarah Chen', 'Marcus Johnson', 'Elena Rodriguez', 'David Kim',
  'Priya Patel', 'James Thompson', 'Aisha Williams', 'Robert Martinez',
  'Lisa Nakamura', "Michael O'Brien", 'Nina Kowalski', 'Carlos Rivera',
  'Hannah Fischer', 'Daniel Okafor', 'Sophie Lambert',
];

const COURSES = [
  'Data Analytics Fundamentals', 'Advanced Excel', 'Python for Data Analysis',
  'Financial Reporting', 'Leadership Fundamentals', 'Project Management',
  'Business Intelligence', 'Risk Management', 'Communication Skills',
  'Data Visualization', 'SQL Fundamentals', 'Digital Transformation',
];

const DEPARTMENTS = [
  'Data & Analytics', 'Finance', 'Human Resources', 'Operations', 'Technology',
];

const POSITIVE_FEEDBACK = [
  'The instructor explained the material very clearly and used excellent practical examples.',
  'Great course! The hands-on exercises were extremely helpful for understanding the concepts.',
  'Really enjoyed the interactive format. The instructor was knowledgeable and engaging.',
  'Well-structured content with good pacing. I feel confident applying what I learned.',
  'Excellent training session. The real-world case studies made the theory come alive.',
  'One of the best training sessions I have attended. Very relevant to my daily work.',
  'The instructor was patient and made complex topics accessible. Highly recommended.',
  'Good balance between theory and practice. The group exercises were particularly useful.',
  'Very informative and well-organized session. The instructor answered all questions thoroughly.',
  'The practical demonstrations were outstanding. I can immediately apply what I learned.',
  'Fantastic course content. The instructor brought energy and expertise to every topic.',
  'Clear explanations and helpful handouts. The course exceeded my expectations.',
];

const NEUTRAL_FEEDBACK = [
  'The course covered the expected topics. Some sections could have been more detailed.',
  'Decent training overall. The materials were adequate but could use updating.',
  'The session was informative but ran a bit long. Content was relevant to my role.',
  'Average training experience. Met expectations but did not exceed them.',
  'The core content was solid, though the delivery could have been more engaging.',
  'Covered the basics well. Would appreciate a follow-up session on advanced topics.',
  'The training was satisfactory. Nothing particularly stood out, positive or negative.',
  'Content was appropriate for the level. Could benefit from more group activities.',
];

const NEGATIVE_FEEDBACK = [
  'The pace was too fast. I struggled to keep up with the material being presented.',
  'Training duration was too short to cover all the topics adequately.',
  'The material was difficult to follow. More structured examples would have helped.',
  'Not enough practical exercises. Too much theory without real application.',
  'The slides contained too much text and information. Need better visual presentations.',
  'More discussion time was needed. Felt rushed through several important topics.',
  'The content felt outdated. Would benefit from more current industry examples.',
  'The instructor seemed unprepared for some of the participant questions.',
  'The difficulty level was not appropriate for the target audience.',
  'Too many participants in the session. It was hard to get individual attention.',
  'The examples used were not relevant to our department-specific needs.',
  'Technical issues disrupted the flow of the presentation significantly.',
];

export function generateDemoDataset(count: number = 500): TrainingRecord[] {
  const rng = createRNG(42);
  const records: TrainingRecord[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const daysAgo = rng.nextInt(0, 365);
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo);
    const dateStr = date.toISOString().split('T')[0];

    const sentimentRoll = rng.next();
    let feedback: string;
    let rating: number;

    if (sentimentRoll < 0.45) {
      feedback = rng.pick(POSITIVE_FEEDBACK);
      rating = 3.5 + rng.next() * 1.5;
    } else if (sentimentRoll < 0.75) {
      feedback = rng.pick(NEUTRAL_FEEDBACK);
      rating = 2.5 + rng.next() * 1.5;
    } else {
      feedback = rng.pick(NEGATIVE_FEEDBACK);
      rating = 1.0 + rng.next() * 2.0;
    }

    rating = Math.min(5.0, Math.max(1.0, Math.round(rating * 10) / 10));

    records.push({
      training_id: `TR-${String(i + 1).padStart(4, '0')}`,
      training_date: dateStr,
      instructor: rng.pick(INSTRUCTORS),
      course: rng.pick(COURSES),
      department: rng.pick(DEPARTMENTS),
      rating,
      participant_count: rng.nextInt(10, 50),
      feedback,
    });
  }

  return records;
}

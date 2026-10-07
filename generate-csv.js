const fs = require('fs');

function createRNG(seed) {
  let s = seed;
  return {
    next() {
      s = (s * 1664525 + 1013904223) & 0x7fffffff;
      return s / 0x7fffffff;
    },
    nextInt(min, max) {
      return Math.floor(this.next() * (max - min + 1)) + min;
    },
    pick(arr) {
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

const POSITIVE = [
  'The instructor explained the material very clearly and used excellent practical examples.',
  'Great course! The hands-on exercises were extremely helpful for understanding the concepts.',
  'Really enjoyed the interactive format. The instructor was knowledgeable and engaging.',
  'Well-structured content with good pacing. I feel confident applying what I learned.',
  'Excellent training session. The real-world case studies made the theory come alive.',
  'One of the best training sessions I have attended. Very relevant to my daily work.',
  'The instructor was patient and made complex topics accessible. Highly recommended.',
  'Good balance between theory and practice. The group exercises were particularly useful.',
];

const NEUTRAL = [
  'The course covered the expected topics. Some sections could have been more detailed.',
  'Decent training overall. The materials were adequate but could use updating.',
  'The session was informative but ran a bit long. Content was relevant to my role.',
  'Average training experience. Met expectations but did not exceed them.',
  'The core content was solid, though the delivery could have been more engaging.',
  'Covered the basics well. Would appreciate a follow-up session on advanced topics.',
];

const NEGATIVE = [
  'The pace was too fast. I struggled to keep up with the material being presented.',
  'Training duration was too short to cover all the topics adequately.',
  'The material was difficult to follow. More structured examples would have helped.',
  'Not enough practical exercises. Too much theory without real application.',
  'The slides contained too much text and information. Need better visual presentations.',
  'More discussion time was needed. Felt rushed through several important topics.',
];

const rng = createRNG(42);
const rows = ['training_id,training_date,instructor,course,department,rating,participant_count,feedback'];
const now = new Date();

for (let i = 0; i < 500; i++) {
  const daysAgo = rng.nextInt(0, 365);
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo);
  const dateStr = date.toISOString().split('T')[0];

  const roll = rng.next();
  let feedback, rating;
  if (roll < 0.45) {
    feedback = rng.pick(POSITIVE);
    rating = 3.5 + rng.next() * 1.5;
  } else if (roll < 0.75) {
    feedback = rng.pick(NEUTRAL);
    rating = 2.5 + rng.next() * 1.5;
  } else {
    feedback = rng.pick(NEGATIVE);
    rating = 1.0 + rng.next() * 2.0;
  }
  rating = Math.min(5.0, Math.max(1.0, Math.round(rating * 10) / 10));
  const participants = rng.nextInt(10, 50);
  const instructor = rng.pick(INSTRUCTORS);
  const course = rng.pick(COURSES);
  const department = rng.pick(DEPARTMENTS);
  const id = 'TR-' + String(i + 1).padStart(4, '0');

  rows.push(`${id},${dateStr},"${instructor}","${course}","${department}",${rating},${participants},"${feedback}"`);
}

const csvData = rows.join('\n');
if (!fs.existsSync('public')) fs.mkdirSync('public');
fs.writeFileSync('public/sample_training_data.csv', csvData, 'utf8');
fs.writeFileSync('sample_training_data.csv', csvData, 'utf8');
console.log('Sample CSV generated with ' + (rows.length - 1) + ' records.');

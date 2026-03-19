/**
 * Shared helpers for email HTML template generation.
 */

export const FONT = "'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif";
export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/* ── Vivaan data ── */
export const VIVAAN = {
  initials: 'VS', name: 'Vivaan Sharma', activeDays: '5',
  sessions: '8', time: '1h 52m', lessons: '5', chats: '3',
  sessionDuration: [12, 18, 8, 35, 28, 15, 22],
  voice: [8, 12, 5, 18, 15, 6, 10],
  text: [4, 6, 3, 8, 5, 2, 4],
  wordsPerMsg: [42, 51, 38, 65, 59, 40, 53],
  sessionsPerDay: [1, 2, 1, 3, 2, 1, 1],
  lessonsExplored: ['The Solar System and Planets', 'Addition and Subtraction', 'Animals and Their Habitats', 'Weather Patterns', 'Basic Geography'],
  memories: [
    '\u201CVivaan loves learning about space and can name all 8 planets in order\u201D',
    '\u201CGets excited when solving math problems and prefers visual examples with objects\u201D',
    '\u201CVivaan mentioned he has a pet dog named Buddy and loves taking him for walks\u201D',
  ],
  aiInsight: "Vivaan had a very active week with 8 sessions across 5 days. He engaged most deeply during Thursday\u2019s solar system lesson, asking follow-up questions about Jupiter\u2019s moons. His voice message usage increased by 40% compared to last week, suggesting growing confidence in verbal expression. He responds best to visual examples and hands-on exploration.",
};

export const MAYA = {
  initials: 'MS', name: 'Maya Sharma', activeDays: '3',
  sessions: '4', time: '53m', lessons: '3', chats: '1',
  sessionDuration: [0, 15, 0, 22, 0, 18, 0],
  voice: [0, 6, 0, 10, 0, 8, 0],
  text: [0, 3, 0, 5, 0, 4, 0],
  wordsPerMsg: [0, 35, 0, 48, 0, 32, 0],
  sessionsPerDay: [0, 1, 0, 2, 0, 1, 0],
  lessonsExplored: ['Colors and Shapes', 'Counting to 20'],
  memories: [
    '\u201CMaya\u2019s favorite color is purple and she loves drawing butterflies\u201D',
    '\u201CShe can count to 15 independently and is working on numbers 16-20\u201D',
  ],
  aiInsight: "Maya had 4 sessions across 3 active days this week. She\u2019s most engaged during counting exercises and loves using colors as a learning tool. Her sessions tend to be focused and productive, averaging about 18 minutes each. She\u2019s making steady progress on numbers 16-20 and shows strong pattern recognition skills.",
};

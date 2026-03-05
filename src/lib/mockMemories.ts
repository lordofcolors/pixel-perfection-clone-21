export type Importance = "high" | "medium" | "low";

export interface Memory {
  id: string;
  text: string;
  importance: Importance;
  createdAt: Date;
  owner: string;
}

const guardianMemories: string[] = [
  "Prefers no emojis in any communications",
  "Wants bullet points to follow a specific format for updates",
  "Prefers story-based lessons over direct practice for all learners",
  "Running weekly check-ins with the team on Tuesdays",
  "Wants updates sent via email, not in-app notifications",
  "Prefers concise lesson summaries under 3 sentences",
  "Likes learners to review material before each session",
  "Wants to be notified when a learner completes a skill",
  "Prefers lessons scheduled in the morning before noon",
  "Asked for no pop culture references in lesson content",
  "Wants progress reports every Friday afternoon",
  "Prefers visual diagrams over text-heavy explanations",
  "Requested bilingual support for Spanish and English",
  "Likes positive reinforcement language in feedback",
  "Wants all lessons to include a hands-on activity",
  "Prefers to review lesson plans before they go live",
  "Asked to limit screen time lessons to 30 minutes",
  "Wants safety warnings highlighted in bold text",
  "Prefers learners work independently before asking for help",
  "Likes weekly goal-setting sessions with each learner",
  "Wants to track time spent per lesson",
  "Prefers no background music during audio lessons",
  "Asked for a monthly summary of all learner progress",
  "Wants vocabulary lists included with each lesson",
  "Prefers quizzes at the end of every module",
  "Likes color-coded difficulty levels for lessons",
  "Wants learners to journal after each session",
  "Prefers real-world examples over hypothetical scenarios",
  "Asked for offline-accessible lesson materials",
  "Wants notification when a learner struggles with a topic",
  "Prefers collaborative exercises between learners",
  "Likes short video introductions to new topics",
  "Wants lessons tied to seasonal or current events",
  "Prefers step-by-step instructions with numbered lists",
  "Asked for a printable version of all lesson plans",
];

const learner1Memories: string[] = [
  "Knows a light tan spark plug color does not need replacing",
  "Does landscaping work and wants to learn mower maintenance",
  "Likes YouTube channels RAR Garage and Dude Perfect",
  "Associates a white or chalky spark plug with too much air",
  "Knows to lift with legs when tilting a lawn mower",
  "Did not know basic lawn mower maintenance steps",
  "Says sturdy boots should be worn for landscaping",
  "Knows about horizontal directional drilling for fiber optics",
  "Can identify a fouled spark plug by its dark oily appearance",
  "Understands the difference between 2-stroke and 4-stroke engines",
  "Learned how to check and change lawn mower oil",
  "Knows the proper gap size for most small engine spark plugs",
  "Can sharpen a lawn mower blade using a bench grinder",
  "Understands why mower decks need to be cleaned regularly",
  "Learned about air filter maintenance and replacement schedules",
  "Knows how to winterize a lawn mower for storage",
  "Can identify common lawn diseases like brown patch fungus",
  "Understands the concept of mowing height for different grass types",
  "Learned proper fuel storage and stabilizer usage",
  "Knows how to replace a pull cord on a small engine",
  "Can perform a basic tune-up on a push mower",
  "Understands the importance of mulching vs bagging clippings",
  "Learned about edging techniques for clean landscape borders",
  "Knows how to adjust carburetor idle on small engines",
  "Can identify poison ivy, oak, and sumac while working",
  "Understands proper lifting techniques for heavy equipment",
  "Learned about chainsaw safety and kickback prevention",
  "Knows the difference between string trimmer line sizes",
  "Can operate a leaf blower efficiently with proper technique",
  "Understands irrigation system basics and sprinkler head types",
  "Learned about soil pH testing and amendment application",
  "Knows proper tree pruning techniques and branch collar cuts",
  "Can identify common weeds and select appropriate treatments",
  "Understands the business side of landscaping pricing",
  "Learned about erosion control methods and ground cover plants",
  "Knows how to properly load and secure equipment on a trailer",
  "Can read a tape measure and calculate area for material estimates",
  "Understands basic electrical safety around outdoor power tools",
  "Learned about hardscape materials like pavers and retaining walls",
  "Knows first aid basics for common landscaping injuries",
  "Can differentiate between annual and perennial plants",
  "Understands seasonal planting schedules for the local climate",
  "Learned about drip irrigation installation and maintenance",
  "Knows how to grade a yard for proper water drainage",
  "Can estimate mulch quantities needed for different bed sizes",
  "Understands the importance of PPE in landscaping work",
  "Learned how to use a transit level for grading projects",
  "Knows about different types of fertilizer and application rates",
  "Can troubleshoot a mower that won't start systematically",
  "Understands how to bid on commercial landscaping contracts",
];

const learner2Memories: string[] = [
  "Enjoys math and recently solved a difficult equation",
  "Plays Clash Royale every day and finds it strategic",
  "Fan of Manchester United but not actively watching anymore",
  "Achieved Ultimate Champion rank in Clash Royale",
  "Specifically enjoys using the Hog Rider deck",
  "Scored 95% on the last algebra test at school",
  "Can solve quadratic equations using the quadratic formula",
  "Understands the concept of slope and y-intercept",
  "Likes to create spreadsheets to track game statistics",
  "Interested in learning Python programming for data analysis",
  "Can calculate percentages and ratios mentally",
  "Enjoys geometry and can identify different polygon types",
  "Learned about probability through analyzing card game odds",
  "Understands basic statistics like mean, median, and mode",
  "Interested in how algorithms work behind the scenes in games",
  "Can convert between fractions, decimals, and percentages",
  "Enjoys logic puzzles and brain teasers",
  "Learned about coordinate geometry and plotting points",
  "Understands the concept of variables in both math and coding",
  "Interested in game design and the math behind game mechanics",
  "Can solve systems of equations with two variables",
  "Enjoys watching math YouTube channels like 3Blue1Brown",
  "Learned about exponential growth through game economy analysis",
  "Understands basic trigonometry and SOH-CAH-TOA",
  "Interested in cryptography and how it uses number theory",
  "Can calculate area and volume of common 3D shapes",
  "Enjoys competitive math and wants to join math olympiad",
  "Learned about sequences and series through pattern recognition",
  "Understands order of operations and applies it consistently",
  "Interested in how sports statistics are calculated",
  "Can read and interpret graphs and charts accurately",
  "Enjoys strategy games beyond Clash Royale including chess",
  "Learned about negative numbers through game score tracking",
  "Understands the concept of functions and function notation",
  "Interested in financial math like compound interest",
  "Can estimate square roots without a calculator",
  "Enjoys collaborative problem-solving in study groups",
  "Learned about prime numbers and factorization",
  "Understands basic set theory and Venn diagrams",
  "Interested in the history of mathematics and famous mathematicians",
  "Can solve word problems by translating them into equations",
  "Enjoys creating math games for younger siblings",
  "Learned about ratios through comparing game unit stats",
  "Understands the concept of infinity and limits intuitively",
  "Interested in how AI uses math and linear algebra",
  "Can perform mental math with numbers up to three digits",
  "Enjoys the challenge of proofs and logical reasoning",
  "Learned about symmetry through art and design projects",
  "Understands basic matrix operations from game programming interest",
  "Interested in pursuing a STEM career path",
];

function randomImportance(index: number): Importance {
  if (index % 5 === 0) return "high";
  if (index % 3 === 0) return "medium";
  if (index % 7 === 0) return "low";
  const options: Importance[] = ["high", "medium", "low"];
  return options[index % 3];
}

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 86400000);
}

export function buildMockMemories(guardianName: string, learners: { name: string }[]): Record<string, Memory[]> {
  const l1 = learners[0]?.name || "Learner 1";
  const l2 = learners[1]?.name || "Learner 2";

  const gMems: Memory[] = guardianMemories.map((text, i) => ({
    id: `g-${i}`,
    text,
    importance: randomImportance(i),
    createdAt: daysAgo(Math.floor(i * 2.5)),
    owner: guardianName,
  }));

  const l1Mems: Memory[] = learner1Memories.map((text, i) => ({
    id: `l1-${i}`,
    text,
    importance: randomImportance(i + 1),
    createdAt: daysAgo(Math.floor(i * 1.8)),
    owner: l1,
  }));

  const l2Mems: Memory[] = learner2Memories.map((text, i) => ({
    id: `l2-${i}`,
    text,
    importance: randomImportance(i + 2),
    createdAt: daysAgo(Math.floor(i * 1.5)),
    owner: l2,
  }));

  return {
    [guardianName]: gMems,
    [l1]: l1Mems,
    [l2]: l2Mems,
  };
}

export function buildLearnerMockMemories(learnerName: string): Memory[] {
  const memories = learnerName === "Mia" ? learner2Memories : learner1Memories;
  return memories.map((text, i) => ({
    id: `lm-${i}`,
    text,
    importance: randomImportance(i),
    createdAt: daysAgo(Math.floor(i * 1.8)),
    owner: learnerName,
  }));
}

export const importanceOrder: Record<Importance, number> = { high: 0, medium: 1, low: 2 };

export const importanceBorderColors: Record<Importance, string> = {
  high: "border-[#EED4F0] text-[#EED4F0]",
  medium: "border-[#94DFE9] text-[#94DFE9]",
  low: "border-[#B9C6FE] text-[#B9C6FE]",
};

export function formatDate(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = today.getTime() - target.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export const PAGE_SIZE = 20;

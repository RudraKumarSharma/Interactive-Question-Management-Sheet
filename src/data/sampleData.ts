import type { Topic } from '@/types/sheet';
import rawData from './sheetData.json';

interface RawQuestion {
  topic: string;
  subTopic: string;
  title: string;
  resource?: string;
  questionId?: {
    difficulty?: string;
    problemUrl?: string;
    name?: string;
  };
}

function normalizeDifficulty(d?: string): 'Easy' | 'Medium' | 'Hard' {
  if (!d) return 'Easy';
  const lower = d.toLowerCase();
  if (lower === 'hard') return 'Hard';
  if (lower === 'medium' || lower === 'moderate') return 'Medium';
  return 'Easy';
}

function transformData(): Topic[] {
  const questions = (rawData as any).data?.questions as RawQuestion[] | undefined;
  if (!questions) return [];

  const topicMap = new Map<string, Map<string, { title: string; difficulty: 'Easy' | 'Medium' | 'Hard'; link?: string }[]>>();

  for (const q of questions) {
    const topicName = q.topic || 'Uncategorized';
    const subTopicName = q.subTopic || 'General';

    if (!topicMap.has(topicName)) {
      topicMap.set(topicName, new Map());
    }
    const subMap = topicMap.get(topicName)!;
    if (!subMap.has(subTopicName)) {
      subMap.set(subTopicName, []);
    }

    subMap.get(subTopicName)!.push({
      title: q.title || q.questionId?.name || 'Untitled',
      difficulty: normalizeDifficulty(q.questionId?.difficulty),
      link: q.questionId?.problemUrl || q.resource || undefined,
    });
  }

  let topicIdx = 0;
  const topics: Topic[] = [];

  for (const [topicName, subMap] of topicMap) {
    topicIdx++;
    let subIdx = 0;
    const subTopics = [];

    for (const [subName, qs] of subMap) {
      subIdx++;
      let qIdx = 0;
      subTopics.push({
        id: `sub-${topicIdx}-${subIdx}`,
        title: subName,
        questions: qs.map((q) => ({
          id: `q-${topicIdx}-${subIdx}-${++qIdx}`,
          title: q.title,
          difficulty: q.difficulty,
          link: q.link,
          completed: false,
        })),
      });
    }

    topics.push({
      id: `topic-${topicIdx}`,
      title: topicName,
      subTopics,
    });
  }

  return topics;
}

export const sampleData: Topic[] = transformData();
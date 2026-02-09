export interface Question {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  link?: string;
  completed: boolean;
  notes?: string;
}

export interface SubTopic {
  id: string;
  title: string;
  questions: Question[];
}

export interface Topic {
  id: string;
  title: string;
  subTopics: SubTopic[];
}

export interface SheetData {
  topics: Topic[];
}
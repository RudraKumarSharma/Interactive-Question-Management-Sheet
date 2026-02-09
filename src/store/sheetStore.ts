import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Topic, Question } from "@/types/sheet";
import { sampleData } from "@/data/sampleData";

interface SheetStore {
  topics: Topic[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addTopic: (title: string) => void;
  editTopic: (topicId: string, newTitle: string) => void;
  deleteTopic: (topicId: string) => void;
  addSubTopic: (topicId: string, title: string) => void;
  editSubTopic: (topicId: string, subTopicId: string, newTitle: string) => void;
  deleteSubTopic: (topicId: string, subTopicId: string) => void;
  addQuestion: (
    topicId: string,
    subTopicId: string,
    question: Omit<Question, "id" | "completed">,
  ) => void;
  editQuestion: (
    topicId: string,
    subTopicId: string,
    questionId: string,
    updates: Partial<Omit<Question, "id">>,
  ) => void;
  deleteQuestion: (
    topicId: string,
    subTopicId: string,
    questionId: string,
  ) => void;
  toggleQuestion: (
    topicId: string,
    subTopicId: string,
    questionId: string,
  ) => void;
  reorderTopics: (sourceIndex: number, destinationIndex: number) => void;
  reorderSubTopics: (
    topicId: string,
    sourceIndex: number,
    destinationIndex: number,
  ) => void;
  reorderQuestions: (
    topicId: string,
    subTopicId: string,
    sourceIndex: number,
    destinationIndex: number,
  ) => void;
}

export const useSheetStore = create<SheetStore>()(
  persist(
    (set) => ({
      topics: sampleData,
      searchQuery: "",

      setSearchQuery: (query) => set({ searchQuery: query }),

      addTopic: (title) =>
        set((state) => {
          const newId = `topic-${Date.now()}`;
          return {
            topics: [
              ...state.topics,
              {
                id: newId,
                title,
                subTopics: [],
              },
            ],
          };
        }),

      editTopic: (topicId, newTitle) =>
        set((state) => ({
          topics: state.topics.map((topic) =>
            topic.id === topicId ? { ...topic, title: newTitle } : topic,
          ),
        })),

      deleteTopic: (topicId) =>
        set((state) => ({
          topics: state.topics.filter((topic) => topic.id !== topicId),
        })),

      addSubTopic: (topicId, title) =>
        set((state) => {
          const newId = `sub-${Date.now()}`;
          return {
            topics: state.topics.map((topic) =>
              topic.id === topicId
                ? {
                    ...topic,
                    subTopics: [
                      ...topic.subTopics,
                      {
                        id: newId,
                        title,
                        questions: [],
                      },
                    ],
                  }
                : topic,
            ),
          };
        }),

      editSubTopic: (topicId, subTopicId, newTitle) =>
        set((state) => ({
          topics: state.topics.map((topic) =>
            topic.id === topicId
              ? {
                  ...topic,
                  subTopics: topic.subTopics.map((subTopic) =>
                    subTopic.id === subTopicId
                      ? { ...subTopic, title: newTitle }
                      : subTopic,
                  ),
                }
              : topic,
          ),
        })),

      deleteSubTopic: (topicId, subTopicId) =>
        set((state) => ({
          topics: state.topics.map((topic) =>
            topic.id === topicId
              ? {
                  ...topic,
                  subTopics: topic.subTopics.filter(
                    (st) => st.id !== subTopicId,
                  ),
                }
              : topic,
          ),
        })),

      addQuestion: (topicId, subTopicId, question) =>
        set((state) => {
          const newId = `q-${Date.now()}`;
          return {
            topics: state.topics.map((topic) =>
              topic.id === topicId
                ? {
                    ...topic,
                    subTopics: topic.subTopics.map((subTopic) =>
                      subTopic.id === subTopicId
                        ? {
                            ...subTopic,
                            questions: [
                              ...subTopic.questions,
                              {
                                ...question,
                                id: newId,
                                completed: false,
                              },
                            ],
                          }
                        : subTopic,
                    ),
                  }
                : topic,
            ),
          };
        }),

      editQuestion: (topicId, subTopicId, questionId, updates) =>
        set((state) => ({
          topics: state.topics.map((topic) =>
            topic.id === topicId
              ? {
                  ...topic,
                  subTopics: topic.subTopics.map((subTopic) =>
                    subTopic.id === subTopicId
                      ? {
                          ...subTopic,
                          questions: subTopic.questions.map((question) =>
                            question.id === questionId
                              ? { ...question, ...updates }
                              : question,
                          ),
                        }
                      : subTopic,
                  ),
                }
              : topic,
          ),
        })),

      deleteQuestion: (topicId, subTopicId, questionId) =>
        set((state) => ({
          topics: state.topics.map((topic) =>
            topic.id === topicId
              ? {
                  ...topic,
                  subTopics: topic.subTopics.map((subTopic) =>
                    subTopic.id === subTopicId
                      ? {
                          ...subTopic,
                          questions: subTopic.questions.filter(
                            (q) => q.id !== questionId,
                          ),
                        }
                      : subTopic,
                  ),
                }
              : topic,
          ),
        })),

      toggleQuestion: (topicId, subTopicId, questionId) =>
        set((state) => ({
          topics: state.topics.map((topic) =>
            topic.id === topicId
              ? {
                  ...topic,
                  subTopics: topic.subTopics.map((subTopic) =>
                    subTopic.id === subTopicId
                      ? {
                          ...subTopic,
                          questions: subTopic.questions.map((question) =>
                            question.id === questionId
                              ? { ...question, completed: !question.completed }
                              : question,
                          ),
                        }
                      : subTopic,
                  ),
                }
              : topic,
          ),
        })),

      reorderTopics: (sourceIndex, destinationIndex) =>
        set((state) => {
          const topics = Array.from(state.topics);
          const [removed] = topics.splice(sourceIndex, 1);
          topics.splice(destinationIndex, 0, removed);
          return { topics };
        }),

      reorderSubTopics: (topicId, sourceIndex, destinationIndex) =>
        set((state) => ({
          topics: state.topics.map((topic) => {
            if (topic.id !== topicId) return topic;
            const subTopics = Array.from(topic.subTopics);
            const [removed] = subTopics.splice(sourceIndex, 1);
            subTopics.splice(destinationIndex, 0, removed);
            return { ...topic, subTopics };
          }),
        })),

      reorderQuestions: (topicId, subTopicId, sourceIndex, destinationIndex) =>
        set((state) => ({
          topics: state.topics.map((topic) => {
            if (topic.id !== topicId) return topic;
            return {
              ...topic,
              subTopics: topic.subTopics.map((subTopic) => {
                if (subTopic.id !== subTopicId) return subTopic;
                const questions = Array.from(subTopic.questions);
                const [removed] = questions.splice(sourceIndex, 1);
                questions.splice(destinationIndex, 0, removed);
                return { ...subTopic, questions };
              }),
            };
          }),
        })),
    }),
    {
      name: "sheet-storage",
    },
  ),
);

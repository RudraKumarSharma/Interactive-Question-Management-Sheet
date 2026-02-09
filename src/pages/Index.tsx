import { useState, useMemo } from "react";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { Plus, Search, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSheetStore } from "@/store/sheetStore";
import TopicSection from "@/components/TopicSection";
import ItemDialog from "@/components/ItemDialog";

const Index = () => {
  const {
    topics,
    searchQuery,
    setSearchQuery,
    addTopic,
    reorderTopics,
    reorderSubTopics,
    reorderQuestions,
  } = useSheetStore();
  const [addTopicOpen, setAddTopicOpen] = useState(false);

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;
    const q = searchQuery.toLowerCase();
    return topics
      .map((topic) => ({
        ...topic,
        subTopics: topic.subTopics
          .map((st) => ({
            ...st,
            questions: st.questions.filter((question) =>
              question.title.toLowerCase().includes(q),
            ),
          }))
          .filter(
            (st) =>
              st.questions.length > 0 || st.title.toLowerCase().includes(q),
          ),
      }))
      .filter(
        (t) => t.subTopics.length > 0 || t.title.toLowerCase().includes(q),
      );
  }, [topics, searchQuery]);

  const totalQuestions = topics.reduce(
    (s, t) => s + t.subTopics.reduce((s2, st) => s2 + st.questions.length, 0),
    0,
  );
  const completedQuestions = topics.reduce(
    (s, t) =>
      s +
      t.subTopics.reduce(
        (s2, st) => s2 + st.questions.filter((q) => q.completed).length,
        0,
      ),
    0,
  );

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, type } = result;
    if (
      source.index === destination.index &&
      source.droppableId === destination.droppableId
    )
      return;

    if (type === "topic") {
      reorderTopics(source.index, destination.index);
    } else if (type === "subtopic") {
      const topicId = source.droppableId.replace("subtopics-", "");
      reorderSubTopics(topicId, source.index, destination.index);
    } else if (type === "question") {
      // droppableId format: questions-{topicId}-{subTopicId}
      // Need to reconstruct properly since IDs can contain dashes
      const droppablePrefix = source.droppableId.replace("questions-", "");
      // Find matching topic and subtopic
      for (const topic of topics) {
        for (const st of topic.subTopics) {
          if (droppablePrefix === `${topic.id}-${st.id}`) {
            reorderQuestions(topic.id, st.id, source.index, destination.index);
            return;
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-md">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold font-heading text-foreground">
                  Question Sheet
                </h1>
                <p className="text-xs text-muted-foreground">
                  {completedQuestions} of {totalQuestions} completed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  className="pl-8 w-48 sm:w-64 h-9 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                onClick={() => setAddTopicOpen(true)}
                size="sm"
                className="gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Topic</span>
              </Button>
            </div>
          </div>
          {/* Overall progress bar */}
          <div className="mt-3 w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{
                width:
                  totalQuestions > 0
                    ? `${(completedQuestions / totalQuestions) * 100}%`
                    : "0%",
              }}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container max-w-4xl mx-auto px-4 py-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="topics" type="topic">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4"
              >
                {filteredTopics.map((topic, i) => (
                  <TopicSection key={topic.id} topic={topic} index={i} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {filteredTopics.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              {searchQuery ? "No results found" : "No topics yet"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery
                ? "Try a different search term"
                : 'Click "+ Topic" to get started'}
            </p>
          </div>
        )}
      </main>

      <ItemDialog
        open={addTopicOpen}
        onOpenChange={setAddTopicOpen}
        title="Add Topic"
        mode="topic"
        onSave={(v: { title: string }) => addTopic(v.title)}
      />
    </div>
  );
};

export default Index;

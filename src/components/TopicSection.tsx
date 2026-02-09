import { useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Topic as TopicType } from "@/types/sheet";
import { useSheetStore } from "@/store/sheetStore";
import SubTopicCard from "./SubTopicCard";
import ItemDialog from "./ItemDialog";

interface TopicSectionProps {
  topic: TopicType;
  index: number;
}

const TopicSection = ({ topic, index }: TopicSectionProps) => {
  const { editTopic, deleteTopic, addSubTopic } = useSheetStore();
  const [expanded, setExpanded] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [addSubOpen, setAddSubOpen] = useState(false);

  const totalQuestions = topic.subTopics.reduce(
    (sum, st) => sum + st.questions.length,
    0,
  );
  const completedQuestions = topic.subTopics.reduce(
    (sum, st) => sum + st.questions.filter((q) => q.completed).length,
    0,
  );

  return (
    <>
      <Draggable draggableId={topic.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`rounded-xl border bg-card shadow-card transition-all animate-fade-in ${snapshot.isDragging ? "dragging" : ""}`}
          >
            <div className="group flex items-center gap-3 px-4 py-3.5">
              <div {...provided.dragHandleProps} className="drag-handle">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {expanded ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold font-heading text-foreground truncate">
                  {topic.title}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground tabular-nums">
                    {completedQuestions}/{totalQuestions}
                  </span>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
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
                <div className="flex gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setAddSubOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEditOpen(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => deleteTopic(topic.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            {expanded && (
              <Droppable droppableId={`subtopics-${topic.id}`} type="subtopic">
                {(dropProvided) => (
                  <div
                    ref={dropProvided.innerRef}
                    {...dropProvided.droppableProps}
                    className="px-4 pb-4 space-y-2"
                  >
                    {topic.subTopics.map((st, si) => (
                      <SubTopicCard
                        key={st.id}
                        subTopic={st}
                        index={si}
                        topicId={topic.id}
                      />
                    ))}
                    {dropProvided.placeholder}
                    {topic.subTopics.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No sub-topics yet. Click + to add one.
                      </p>
                    )}
                  </div>
                )}
              </Droppable>
            )}
          </div>
        )}
      </Draggable>
      <ItemDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Topic"
        mode="topic"
        initialValues={{ title: topic.title }}
        onSave={(v: { title: string }) => editTopic(topic.id, v.title)}
      />
      <ItemDialog
        open={addSubOpen}
        onOpenChange={setAddSubOpen}
        title="Add Sub-topic"
        mode="subtopic"
        onSave={(v: { title: string }) => addSubTopic(topic.id, v.title)}
      />
    </>
  );
};

export default TopicSection;

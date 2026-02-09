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
import type { SubTopic as SubTopicType } from "@/types/sheet";
import { useSheetStore } from "@/store/sheetStore";
import QuestionRow from "./QuestionRow";
import ItemDialog from "./ItemDialog";

interface SubTopicCardProps {
  subTopic: SubTopicType;
  index: number;
  topicId: string;
}

const SubTopicCard = ({ subTopic, index, topicId }: SubTopicCardProps) => {
  const { editSubTopic, deleteSubTopic, addQuestion } = useSheetStore();
  const [expanded, setExpanded] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [addQuestionOpen, setAddQuestionOpen] = useState(false);

  const completedCount = subTopic.questions.filter((q) => q.completed).length;
  const totalCount = subTopic.questions.length;

  return (
    <>
      <Draggable draggableId={subTopic.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`rounded-lg border bg-card transition-all ${snapshot.isDragging ? "dragging" : ""}`}
          >
            <div className="group flex items-center gap-2 px-3 py-2.5">
              <div
                {...provided.dragHandleProps}
                className="drag-handle opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {expanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              <h3 className="flex-1 text-sm font-semibold font-heading text-foreground">
                {subTopic.title}
              </h3>
              <span className="text-xs font-medium text-muted-foreground tabular-nums">
                {completedCount}/{totalCount}
              </span>
              {/* Progress bar */}
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden hidden sm:block">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{
                    width:
                      totalCount > 0
                        ? `${(completedCount / totalCount) * 100}%`
                        : "0%",
                  }}
                />
              </div>
              <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setAddQuestionOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setEditOpen(true)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => deleteSubTopic(topicId, subTopic.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            {expanded && (
              <Droppable
                droppableId={`questions-${topicId}-${subTopic.id}`}
                type="question"
              >
                {(dropProvided) => (
                  <div
                    ref={dropProvided.innerRef}
                    {...dropProvided.droppableProps}
                    className="px-2 pb-2 space-y-0.5"
                  >
                    {subTopic.questions.map((q, qi) => (
                      <QuestionRow
                        key={q.id}
                        question={q}
                        index={qi}
                        topicId={topicId}
                        subTopicId={subTopic.id}
                      />
                    ))}
                    {dropProvided.placeholder}
                    {subTopic.questions.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-3">
                        No questions yet
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
        title="Edit Sub-topic"
        mode="subtopic"
        initialValues={{ title: subTopic.title }}
        onSave={(v: { title: string }) =>
          editSubTopic(topicId, subTopic.id, v.title)
        }
      />
      <ItemDialog
        open={addQuestionOpen}
        onOpenChange={setAddQuestionOpen}
        title="Add Question"
        mode="question"
        onSave={(v: {
          title: string;
          difficulty?: "Easy" | "Medium" | "Hard";
          link?: string;
          notes?: string;
        }) =>
          addQuestion(topicId, subTopic.id, {
            title: v.title,
            difficulty: v.difficulty || "Easy",
            link: v.link,
            notes: v.notes,
          })
        }
      />
    </>
  );
};

export default SubTopicCard;

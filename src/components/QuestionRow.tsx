import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { GripVertical, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Question } from "@/types/sheet";
import { useSheetStore } from "@/store/sheetStore";
import ItemDialog from "./ItemDialog";

interface QuestionRowProps {
  question: Question;
  index: number;
  topicId: string;
  subTopicId: string;
}

const difficultyStyles: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Easy: {
    bg: "hsl(160 84% 39% / 0.15)",
    text: "hsl(160 84% 39%)",
    border: "hsl(160 84% 39% / 0.2)",
  },
  Medium: {
    bg: "hsl(38 92% 50% / 0.15)",
    text: "hsl(38 92% 50%)",
    border: "hsl(38 92% 50% / 0.2)",
  },
  Hard: {
    bg: "hsl(0 84% 60% / 0.15)",
    text: "hsl(0 84% 60%)",
    border: "hsl(0 84% 60% / 0.2)",
  },
};

const QuestionRow = ({
  question,
  index,
  topicId,
  subTopicId,
}: QuestionRowProps) => {
  const { toggleQuestion, editQuestion, deleteQuestion } = useSheetStore();
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <Draggable draggableId={question.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`group flex items-center gap-3 px-4 py-2.5 rounded-md transition-all ${
              snapshot.isDragging ? "dragging" : "hover:bg-muted/50"
            } ${question.completed ? "opacity-60" : ""}`}
          >
            <div
              {...provided.dragHandleProps}
              className="drag-handle opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <Checkbox
              checked={question.completed}
              onCheckedChange={() =>
                toggleQuestion(topicId, subTopicId, question.id)
              }
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span
              className={`flex-1 text-sm font-body ${question.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
            >
              {question.title}
            </span>
            {question.notes && (
              <span className="text-xs text-muted-foreground max-w-30 truncate hidden sm:inline">
                {question.notes}
              </span>
            )}
            <Badge
              variant="outline"
              className="text-xs font-medium"
              style={{
                backgroundColor: difficultyStyles[question.difficulty].bg,
                color: difficultyStyles[question.difficulty].text,
                borderColor: difficultyStyles[question.difficulty].border,
              }}
            >
              {question.difficulty}
            </Badge>
            {question.link && (
              <a
                href={question.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
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
                onClick={() => deleteQuestion(topicId, subTopicId, question.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </Draggable>
      <ItemDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Question"
        mode="question"
        initialValues={{
          title: question.title,
          difficulty: question.difficulty,
          link: question.link,
          notes: question.notes,
        }}
        onSave={(vals: {
          title: string;
          difficulty?: "Easy" | "Medium" | "Hard";
          link?: string;
          notes?: string;
        }) => editQuestion(topicId, subTopicId, question.id, vals)}
      />
    </>
  );
};

export default QuestionRow;

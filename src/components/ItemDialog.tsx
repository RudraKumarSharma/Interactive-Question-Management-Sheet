import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  mode: "topic" | "subtopic" | "question";
  initialValues?: {
    title?: string;
    difficulty?: "Easy" | "Medium" | "Hard";
    link?: string;
    notes?: string;
  };
  onSave: (values: {
    title: string;
    difficulty?: "Easy" | "Medium" | "Hard";
    link?: string;
    notes?: string;
  }) => void;
}

const ItemDialog = ({
  open,
  onOpenChange,
  title,
  mode,
  initialValues,
  onSave,
}: ItemDialogProps) => {
  const [name, setName] = useState(initialValues?.title || "");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    initialValues?.difficulty || "Easy",
  );
  const [link, setLink] = useState(initialValues?.link || "");
  const [notes, setNotes] = useState(initialValues?.notes || "");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      title: name.trim(),
      ...(mode === "question" && {
        difficulty,
        link: link.trim() || undefined,
        notes: notes.trim() || undefined,
      }),
    });
    setName("");
    setLink("");
    setNotes("");
    setDifficulty("Easy");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md font-body">
        <DialogHeader>
          <DialogTitle className="font-heading">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              placeholder={`Enter ${mode} title...`}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                e.key === "Enter" && handleSave()
              }
              autoFocus
            />
          </div>
          {mode === "question" && (
            <>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select
                  value={difficulty}
                  onValueChange={(v: string) =>
                    setDifficulty(v as "Easy" | "Medium" | "Hard")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Link (optional)</Label>
                <Input
                  value={link}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setLink(e.target.value)
                  }
                  placeholder="https://leetcode.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Input
                  value={notes}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNotes(e.target.value)
                  }
                  placeholder="Add notes..."
                />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDialog;

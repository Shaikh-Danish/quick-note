import { formatDistanceToNow } from "date-fns";
import { Icons } from "@/components/ui/icons";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { type Note } from "@/features/notes/client";

interface NoteCardProps {
  note: Note;
  onCopy?: (text: string) => void;
  onAction?: (id: string) => void;
}

export function NoteCard({ note, onCopy, onAction }: NoteCardProps) {
  return (
    <Card className="group flex flex-col justify-between h-56 hover:shadow-md transition-all hover:-translate-y-1 rounded-none border-border bg-background">
      <CardHeader className="p-5 pb-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex flex-wrap gap-2">
            {note.tags?.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="rounded-none font-semibold text-xs bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                #{tag.name}
              </Badge>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onAction?.(note.id)}
            className="text-muted-foreground hover:text-foreground dark:hover:text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Icons.dotsThree size={24} weight="bold" />
          </button>
        </div>
        <CardTitle className="text-lg font-bold text-foreground line-clamp-1">
          {note.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 py-2 flex-grow overflow-hidden">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {note.content}
        </p>
      </CardContent>
      <CardFooter className="px-5 pb-5 pt-0 flex justify-between items-center mt-2">
        <span className="text-xs font-medium text-muted-foreground">
          {formatDistanceToNow(new Date(note.createdAt), {
            addSuffix: true,
          })}
        </span>
        <button
          type="button"
          onClick={() => onCopy?.(note.content)}
          title="Copy to clipboard"
          className="text-muted-foreground hover:text-foreground dark:hover:text-primary-foreground active:scale-95 transition-all"
        >
          <Icons.copy size={16} weight="bold" />
        </button>
      </CardFooter>
    </Card>
  );
}

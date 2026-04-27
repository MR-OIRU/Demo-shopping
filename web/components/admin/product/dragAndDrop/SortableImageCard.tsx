import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { X } from "lucide-react";

export default function SortableImageCard({
  id,
  src,
  index,
  onRemove,
}: {
  id: string;
  src: string;
  index: number;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative h-30 sm:h-50 rounded-lg border overflow-hidden bg-muted">
      <Image src={src} alt={`image-${index}`} fill className="object-cover" sizes="200px" />

      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        aria-label="Drag to reorder"
      />

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 z-20 h-7 w-7 rounded-full bg-red-700 text-white shadow flex items-center justify-center hover:bg-red-800 cursor-pointer"
      >
        <X className="h-4 w-4 stroke-3" />
      </button>

      {index === 0 && (
        <span className="absolute bottom-2 left-2 z-20 rounded bg-black/70 text-white text-xs px-2 py-1">
          Image Cover
        </span>
      )}
    </div>
  );
}

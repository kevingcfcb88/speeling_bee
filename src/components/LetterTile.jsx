import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function LetterTile({ id, letter, disabled, onClick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    disabled: disabled,
    data: { letter, id }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    touchAction: 'none', // Critical for mobile drag and drop
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={disabled ? null : onClick} // Allow clicking as an alternative to dragging
      className={`
        w-12 h-14 sm:w-14 sm:h-16 flex items-center justify-center 
        text-2xl sm:text-3xl font-bold uppercase rounded-lg shadow-md select-none
        border-b-4 
        ${disabled 
          ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed' 
          : 'bg-white text-blue-700 border-blue-200 cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform'
        }
        ${isDragging ? 'shadow-xl z-50 ring-4 ring-blue-300 ring-opacity-50' : ''}
      `}
    >
      {letter}
    </div>
  );
}

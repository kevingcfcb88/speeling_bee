import { useDroppable } from '@dnd-kit/core';

export default function DropZone({ id, label, currentAnswer, onRemoveLetter, isActive, isSuccess, isError }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    disabled: !isActive
  });

  let borderClass = isActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50 opacity-60';
  if (isOver) borderClass = 'border-blue-600 bg-blue-100 ring-4 ring-blue-200';
  if (isSuccess) borderClass = 'border-green-500 bg-green-50 ring-2 ring-green-300';
  if (isError) borderClass = 'border-red-500 bg-red-50 ring-2 ring-red-300';

  return (
    <div className={`flex flex-col gap-2 w-full max-w-2xl mx-auto ${isActive ? '' : 'pointer-events-none'}`}>
      <h3 className={`text-lg font-bold text-center ${isActive ? 'text-gray-700' : 'text-gray-400'}`}>
        {label}
      </h3>
      
      <div 
        ref={setNodeRef}
        className={`
          min-h-[80px] p-4 rounded-xl border-4 border-dashed transition-all
          flex flex-wrap items-center justify-center gap-2
          ${borderClass}
        `}
      >
        {currentAnswer.length === 0 && (
          <span className="text-gray-400 font-medium text-lg">
            {isActive ? 'Drop letters here' : 'Locked'}
          </span>
        )}
        
        {currentAnswer.map((item, index) => (
          <div
            key={item.id || index}
            onClick={() => isActive && onRemoveLetter(index)}
            className="w-12 h-14 sm:w-14 sm:h-16 flex items-center justify-center 
              text-2xl sm:text-3xl font-bold uppercase rounded-lg shadow-sm
              bg-yellow-100 text-yellow-800 border-b-4 border-yellow-300
              cursor-pointer hover:bg-red-100 hover:text-red-600 hover:border-red-300
              transition-colors"
            title="Click to remove"
          >
            {item.char}
          </div>
        ))}
      </div>
    </div>
  );
}

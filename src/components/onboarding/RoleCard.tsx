import React from 'react';

interface RoleCardProps {
  role: 'learner' | 'guardian';
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  isSelected: boolean;
  onSelect: () => void;
  backgroundColor: string;
  imageClassName?: string;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  role,
  title,
  description,
  imageUrl,
  imageAlt,
  isSelected,
  onSelect,
  backgroundColor,
  imageClassName = ''
}) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-[248px] h-[244px] flex-col items-start gap-6 shrink-0 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] relative bg-slate-900 p-6 rounded-lg border-solid transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#EED4F0] focus:ring-offset-2 focus:ring-offset-slate-900 max-sm:w-[220px] max-sm:h-[220px] max-sm:p-5 ${
        isSelected 
          ? 'border-[3px] border-[#EED4F0]' 
          : 'border border-slate-700 hover:border-slate-600'
      }`}
      aria-pressed={isSelected}
      aria-label={`Select ${title} role: ${description}`}
    >
      <div
        className="flex h-[103px] flex-col items-start shrink-0 self-stretch relative rounded-lg"
        style={{ backgroundColor }}
      >
        <div className="flex h-0 rotate-[-25.377deg] flex-col items-center shrink-0 self-stretch relative" />
      </div>
      <img
        src={imageUrl}
        alt={imageAlt}
        className={`absolute ${imageClassName}`}
      />
      <div className="flex flex-col items-start gap-1.5 self-stretch relative">
        <div className={`self-stretch text-sm font-bold leading-[21px] relative ${
          isSelected ? 'text-neutral-50' : 'text-slate-50'
        }`}>
          {title}
        </div>
        <div className="self-stretch text-slate-50 text-sm font-normal leading-5 relative">
          {description}
        </div>
      </div>
    </button>
  );
};

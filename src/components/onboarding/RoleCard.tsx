import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

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
      className={`relative focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      aria-pressed={isSelected}
      aria-label={`Select ${title} role: ${description}`}
    >
      <Card
        className={`w-[248px] h-[244px] max-sm:w-[220px] max-sm:h-[220px] p-6 transition-transform duration-200 hover:scale-105 ${
          isSelected ? 'border-primary' : ''
        }`}
      >
        <div
          className="flex h-[103px] flex-col items-start shrink-0 self-stretch relative rounded-lg"
          style={{ backgroundColor }}
        >
          <div className="flex h-0 rotate-[-25.377deg] flex-col items-center shrink-0 self-stretch relative" />
        </div>
        <img src={imageUrl} alt={imageAlt} loading="lazy" className={`absolute ${imageClassName}`} />
        <CardContent className="pt-6">
          <div className="flex flex-col items-start gap-1.5">
            <div className={`text-sm font-bold leading-[21px] ${isSelected ? 'text-foreground' : ''}`}>
              {title}
            </div>
            <div className="text-sm text-muted-foreground leading-5">{description}</div>
          </div>
        </CardContent>
      </Card>
    </button>
  );
};

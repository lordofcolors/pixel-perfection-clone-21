import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface RoleCardProps {
  role: 'learner' | 'guardian';
  title: string;
  description: string;
  bulletPoints: string[];
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
  bulletPoints,
  imageUrl,
  imageAlt,
  isSelected,
  onSelect,
  backgroundColor,
  imageClassName = ''
}) => {
  return (
    <Card
      onClick={onSelect}
      className={`relative w-[280px] cursor-pointer p-6 transition-transform duration-200 hover:scale-105 ${
        isSelected ? 'ring-2 ring-primary border-primary' : ''
      }`}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`Select ${title} role: ${description}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div
        className="flex h-[103px] flex-col items-start shrink-0 self-stretch relative rounded-lg"
        style={{ backgroundColor }}
      >
        <div className="flex h-0 rotate-[-25.377deg] flex-col items-center shrink-0 self-stretch relative" />
      </div>
      <img src={imageUrl} alt={imageAlt} loading="lazy" className={`absolute ${imageClassName}`} />
      <CardContent className="pt-6 px-0">
        <div className="flex flex-col items-start gap-1.5 text-left">
          <div className={`text-sm font-bold leading-[21px] ${isSelected ? 'text-foreground' : ''}`}>
            {title}
          </div>
          <div className="text-sm text-muted-foreground leading-5 text-left">{description}</div>
          <ul className="text-xs text-muted-foreground/80 leading-4 text-left mt-2 border-t border-border/50 pt-2 space-y-1.5 list-none">
            {bulletPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-1.5">
                <span className="text-primary mt-0.5">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

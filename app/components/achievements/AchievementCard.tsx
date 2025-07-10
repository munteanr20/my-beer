'use client';

import { Achievement } from '../../types';

interface AchievementCardProps {
  achievement: Achievement;
  onClick?: () => void;
}

export default function AchievementCard({ achievement, onClick }: AchievementCardProps) {
  const progressPercentage = Math.min(100, (achievement.criteria.current / achievement.criteria.target) * 100);

  const getProgressText = (achievement: Achievement) => {
    const { current, target, unit } = achievement.criteria;
    
    switch (unit) {
      case 'beers':
        return `${current}/${target} beers`;
      case 'types':
        return `${current}/${target} types`;
      case 'days':
        return `${current}/${target} days`;
      case 'weeks':
        return `${current}/${target} weeks`;
      case 'high_alcohol':
        return `${current}/${target} strong beers`;
      case 'total_liters':
        return `${current.toFixed(1)}/${target} liters`;
      case 'pure_alcohol_liters':
        return `${current.toFixed(1)}/${target}L alcohol`;
      case 'large_beers':
        return `${current}/${target} large beers`;
      case 'pint_sized':
        return `${current}/${target} pints`;
      case 'low_alcohol':
        return `${current}/${target} light beers`;
      case 'weekends':
        return `${current}/${target} weekends`;
      case 'late_nights':
        return `${current}/${target} late nights`;
      case 'detailed_logs':
        return `${current}/${target} detailed logs`;
      case 'rated_beers':
        return `${current}/${target} rated beers`;
      case 'mega_beers':
        return `${current}/${target} mega beers`;
      case 'varied_alcohol':
        return `${current}/${target} alcohol levels`;
      case 'all_types':
        return `${current}/${target} beer types`;
      case 'owner':
        return achievement.unlocked ? 'Owner' : 'Not owner';
      case 'all_achievements':
        return `${current}/${target} achievements`;
      default:
        return `${current}/${target} ${unit}`;
    }
  };

  return (
    <div 
      className={`tavern-glass rounded-lg p-4 border border-[var(--tavern-copper)] border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
        achievement.unlocked ? 'opacity-100' : 'opacity-70'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        {/* Achievement Icon */}
        <div className={`text-3xl ${achievement.unlocked ? 'animate-pulse' : ''}`}>
          {achievement.icon}
        </div>
        
        {/* Achievement Content */}
        <div className="flex-1">
          <h4 className={`heading-font text-lg font-bold ${
            achievement.unlocked ? 'text-tavern-secondary' : 'text-tavern-primary'
          }`}>
            {achievement.title}
          </h4>
          
          <p className="body-font text-sm text-tavern-primary mt-1">
            {achievement.description}
          </p>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="body-font text-xs text-tavern-primary">
                Progress: {getProgressText(achievement)}
              </span>
              {achievement.unlocked && (
                <span className="text-xs text-tavern-secondary font-bold">
                  UNLOCKED! 🎉
                </span>
              )}
            </div>
            
            <div className="w-full bg-[var(--tavern-copper)] rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  achievement.unlocked 
                    ? 'bg-[var(--tavern-gold)]' 
                    : 'bg-[var(--tavern-dark)]'
                }`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          
          {/* Unlock Date */}
          {achievement.unlocked && achievement.unlockedAt && (
            <p className="body-font text-xs text-tavern-primary mt-2">
              Unlocked: {achievement.unlockedAt.toDate ? 
                achievement.unlockedAt.toDate().toLocaleDateString() : 
                new Date(achievement.unlockedAt).toLocaleDateString()
              }
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 
import { motion } from 'motion/react';

interface LanguageBadgeProps {
  langue: 'FR' | 'EN';
  size?: 'sm' | 'md' | 'lg';
}

export function LanguageBadge({ langue, size = 'sm' }: LanguageBadgeProps) {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      className={`inline-flex items-center gap-1 rounded font-semibold ${sizeClasses[size]} ${
        langue === 'FR'
          ? 'bg-primary/20 text-primary'
          : 'bg-secondary/20 text-secondary'
      }`}
    >
      <span>{langue === 'FR' ? '🇫🇷' : '🇬🇧'}</span>
      <span>{langue}</span>
    </motion.span>
  );
}

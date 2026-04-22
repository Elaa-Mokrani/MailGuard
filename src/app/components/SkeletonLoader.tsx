import { motion } from 'motion/react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`bg-muted rounded-lg ${className}`}
    />
  );
}

export function KPICardSkeleton() {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <Skeleton className="w-16 h-6 rounded-lg" />
      </div>
      <Skeleton className="w-24 h-8 mb-2" />
      <Skeleton className="w-32 h-4" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <Skeleton className="w-48 h-6 mb-6" />
      <div className="space-y-4">
        <Skeleton className="w-full h-64" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3 border-b border-muted">
      <div className="flex items-center gap-4 flex-1">
        <Skeleton className="w-2 h-2 rounded-full" />
        <div className="flex-1">
          <Skeleton className="w-32 h-4 mb-2" />
          <Skeleton className="w-48 h-3" />
        </div>
      </div>
      <Skeleton className="w-20 h-3" />
    </div>
  );
}

export function EmailCardSkeleton() {
  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div>
            <Skeleton className="w-32 h-4 mb-1" />
            <Skeleton className="w-24 h-3" />
          </div>
        </div>
        <Skeleton className="w-4 h-4 rounded-full" />
      </div>
      <Skeleton className="w-full h-4 mb-2" />
      <div className="flex items-center gap-2">
        <Skeleton className="w-20 h-5 rounded-lg" />
        <Skeleton className="w-16 h-3" />
      </div>
    </div>
  );
}

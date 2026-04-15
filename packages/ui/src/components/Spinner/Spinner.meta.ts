import type { ComponentMeta } from '@/types/ComponentMeta';

export const meta = {
  category: 'feedback-status',
  description: 'Indicates that content or an action is loading.',
  tags: ['loading', 'feedback', 'status', 'async'],
  order: 10,
  status: 'stable',
  featured: true,
  related: ['Placeholder', 'ProgressBar', 'ProgressButton', 'LoadingState'],
} satisfies ComponentMeta;

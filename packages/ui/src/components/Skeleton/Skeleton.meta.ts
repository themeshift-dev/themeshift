import type { ComponentMeta } from '@/types/ComponentMeta';

export const meta = {
  category: 'feedback-status',
  description:
    'Make placeholders for when data is loading, helping reduce layout shift.',
  tags: ['loading', 'placeholder', 'skeleton', 'shimmer'],
  order: 20,
  status: 'stable',
  featured: true,
  aliases: ['loading-placeholder', 'shimmer'],
  related: ['spinner', 'progress'],
} satisfies ComponentMeta;

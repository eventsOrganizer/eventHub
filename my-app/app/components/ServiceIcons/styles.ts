import { theme } from '../../../lib/theme';

export const iconStyles = {
  icon: {
    size: theme.spacing.xxl, // Increased icon size
    container: `p-${theme.spacing.md} rounded-${theme.borderRadius.full}`,
    wrapper: `items-center justify-center`,
    label: `text-sm mt-2 text-center font-medium text-[${theme.colors.secondary}]`
  },
  grid: {
    container: `flex-row flex-wrap justify-around items-center py-8 px-4`,
    itemWidth: 'w-1/5' // 5 icons per row
  }
};
import { cn } from '../../utils/helpers';

const Badge = ({ text, variant = 'default', className = '' }) => {
  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide',
      variant,
      className
    )}>
      {text}
    </span>
  );
};

export default Badge;

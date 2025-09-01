import * as React from 'react';
import { FileQuestion } from 'lucide-react';
import { cn } from '../utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Icon to display (defaults to FileQuestion)
   */
  icon?: React.ReactNode;
  /**
   * Title text
   */
  title: string;
  /**
   * Description text
   */
  description?: string;
  /**
   * Optional action button
   */
  action?: React.ReactNode;
}

/**
 * EmptyState component for displaying when lists or content areas are empty
 * 
 * @example
 * ```tsx
 * <EmptyState
 *   title="No courses found"
 *   description="Get started by creating your first course"
 *   action={<Button>Create Course</Button>}
 * />
 * ```
 */
const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center py-12 px-4 text-center',
          className
        )}
        {...props}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          {icon || <FileQuestion className="h-6 w-6 text-muted-foreground" />}
        </div>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        {description && (
          <p className="mb-6 text-sm text-muted-foreground max-w-sm">
            {description}
          </p>
        )}
        {action && <div>{action}</div>}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';

export { EmptyState };

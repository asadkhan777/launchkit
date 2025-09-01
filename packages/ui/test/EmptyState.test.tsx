import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState, Button } from '../src';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No items found" />);
    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <EmptyState 
        title="No items found" 
        description="Get started by adding your first item" 
      />
    );
    expect(screen.getByText('Get started by adding your first item')).toBeInTheDocument();
  });

  it('renders action when provided', () => {
    render(
      <EmptyState 
        title="No items found" 
        action={<Button>Add Item</Button>} 
      />
    );
    expect(screen.getByRole('button', { name: 'Add Item' })).toBeInTheDocument();
  });

  it('renders default icon when no custom icon provided', () => {
    render(<EmptyState title="No items found" />);
    // Check for the default FileQuestion icon container
    const iconContainer = screen.getByText('No items found').previousElementSibling;
    expect(iconContainer).toHaveClass('bg-muted');
  });
});

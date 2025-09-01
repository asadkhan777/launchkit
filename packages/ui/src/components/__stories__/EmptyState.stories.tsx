import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState, Button } from '../..';
import { Plus } from 'lucide-react';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'No items found',
    description: 'Get started by creating your first item.',
  },
};

export const WithAction: Story = {
  args: {
    title: 'No courses available',
    description: 'Create your first course to get started with LaunchKit AI.',
    action: <Button><Plus className="w-4 h-4 mr-2" />Create Course</Button>,
  },
};

export const CustomIcon: Story = {
  args: {
    title: 'No lessons found',
    description: 'Add lessons to make your course more engaging.',
    icon: <Plus className="h-6 w-6 text-muted-foreground" />,
    action: <Button variant="outline">Add Lesson</Button>,
  },
};

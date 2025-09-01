import type { Meta, StoryObj } from '@storybook/react';
import { Modal, Button } from '../..';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Modal Title',
    description: 'This is a modal description explaining what this modal is for.',
    trigger: <Button>Open Modal</Button>,
    children: (
      <div className="py-4">
        <p>Modal content goes here.</p>
      </div>
    ),
  },
};

export const WithoutDescription: Story = {
  args: {
    title: 'Simple Modal',
    trigger: <Button variant="outline">Open Simple Modal</Button>,
    children: (
      <div className="py-4">
        <p>This modal has no description.</p>
      </div>
    ),
  },
};

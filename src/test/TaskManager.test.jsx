import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import TaskManager from '../components/TaskManager';

describe('TaskManager', () => {
  it('renders the input, Add Task button, and Start Next Task button', () => {
    render(<TaskManager onTaskSelect={vi.fn()} />);
    expect(screen.getByPlaceholderText('Add a new task')).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
    expect(screen.getByText('Start Next Task')).toBeInTheDocument();
  });

  it('adds a task when the form is submitted', async () => {
    const user = userEvent.setup();
    render(<TaskManager onTaskSelect={vi.fn()} />);

    const input = screen.getByPlaceholderText('Add a new task');
    await user.type(input, 'Write docs');
    await user.click(screen.getByText('Add Task'));

    expect(screen.getByText('Write docs')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('adds a task when Enter is pressed', async () => {
    const user = userEvent.setup();
    render(<TaskManager onTaskSelect={vi.fn()} />);

    const input = screen.getByPlaceholderText('Add a new task');
    await user.type(input, 'Review PR{Enter}');

    expect(screen.getByText('Review PR')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('does not add empty or whitespace-only tasks', async () => {
    const user = userEvent.setup();
    render(<TaskManager onTaskSelect={vi.fn()} />);

    await user.click(screen.getByText('Add Task'));
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);

    const input = screen.getByPlaceholderText('Add a new task');
    await user.type(input, '   {Enter}');
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('selects the first task via Start Next Task', async () => {
    const onTaskSelect = vi.fn();
    const user = userEvent.setup();
    render(<TaskManager onTaskSelect={onTaskSelect} />);

    const input = screen.getByPlaceholderText('Add a new task');
    await user.type(input, 'Task A{Enter}');
    await user.type(input, 'Task B{Enter}');

    await user.click(screen.getByText('Start Next Task'));

    expect(onTaskSelect).toHaveBeenCalledWith(
      expect.objectContaining({ content: 'Task A' })
    );
    expect(screen.getByText('Current Task:')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText('Return to List')).toBeInTheDocument();
    // Task A should no longer be in the active list (only in current task section)
    expect(screen.getByText('Task B')).toBeInTheDocument();
  });

  it('completes the current task and moves it to completed list', async () => {
    const onTaskSelect = vi.fn();
    const user = userEvent.setup();
    render(<TaskManager onTaskSelect={onTaskSelect} />);

    const input = screen.getByPlaceholderText('Add a new task');
    await user.type(input, 'Task A{Enter}');

    await user.click(screen.getByText('Start Next Task'));
    await user.click(screen.getByText('Complete'));

    expect(onTaskSelect).toHaveBeenLastCalledWith(null);
    // Task A should now be in the completed list (has line-through class)
    const completedItem = screen.getByText('Task A');
    expect(completedItem.className).toContain('line-through');
    // Start Next Task button should reappear
    expect(screen.getByText('Start Next Task')).toBeInTheDocument();
  });

  it('returns the current task to the active list', async () => {
    const onTaskSelect = vi.fn();
    const user = userEvent.setup();
    render(<TaskManager onTaskSelect={onTaskSelect} />);

    const input = screen.getByPlaceholderText('Add a new task');
    await user.type(input, 'Task A{Enter}');
    await user.type(input, 'Task B{Enter}');

    await user.click(screen.getByText('Start Next Task'));
    await user.click(screen.getByText('Return to List'));

    expect(onTaskSelect).toHaveBeenLastCalledWith(null);
    // Task A should be back in the active list (no line-through)
    const taskAEl = screen.getByText('Task A');
    expect(taskAEl).toBeInTheDocument();
    expect(taskAEl.className).not.toContain('line-through');
    expect(screen.getByText('Start Next Task')).toBeInTheDocument();
  });

  it('does nothing when Start Next Task is clicked with no active tasks', async () => {
    const onTaskSelect = vi.fn();
    const user = userEvent.setup();
    render(<TaskManager onTaskSelect={onTaskSelect} />);

    await user.click(screen.getByText('Start Next Task'));

    expect(onTaskSelect).not.toHaveBeenCalled();
    expect(screen.getByText('Start Next Task')).toBeInTheDocument();
  });
});

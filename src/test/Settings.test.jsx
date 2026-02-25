import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SettingsModal, { SettingsButton } from '../components/Settings';

function renderModal(overrides = {}) {
  const props = {
    isOpen: true,
    onClose: vi.fn(),
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 10,
    sessionsBeforeLongBreak: 4,
    onWorkDurationChange: vi.fn(),
    onBreakDurationChange: vi.fn(),
    onLongBreakDurationChange: vi.fn(),
    onSessionsBeforeLongBreakChange: vi.fn(),
    ...overrides,
  };
  const result = render(<SettingsModal {...props} />);
  return { ...result, props };
}

describe('SettingsModal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = renderModal({ isOpen: false });
    expect(container.innerHTML).toBe('');
  });

  it('renders the modal with all inputs when isOpen is true', () => {
    renderModal();
    expect(screen.getByText('Timer Settings')).toBeInTheDocument();
    expect(screen.getByLabelText('Work Duration (minutes):')).toHaveValue(25);
    expect(screen.getByLabelText('Break Duration (minutes):')).toHaveValue(5);
    expect(screen.getByLabelText('Long Break Duration (minutes):')).toHaveValue(10);
    expect(screen.getByLabelText('Sessions Before Long Break:')).toHaveValue(4);
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('calls all onChange callbacks and onClose when Save is clicked', async () => {
    const user = userEvent.setup();
    const { props } = renderModal();

    await user.click(screen.getByText('Save'));

    expect(props.onWorkDurationChange).toHaveBeenCalledWith(25);
    expect(props.onBreakDurationChange).toHaveBeenCalledWith(5);
    expect(props.onLongBreakDurationChange).toHaveBeenCalledWith(10);
    expect(props.onSessionsBeforeLongBreakChange).toHaveBeenCalledWith(4);
    expect(props.onClose).toHaveBeenCalled();
  });

  it('saves updated values after editing inputs', async () => {
    const { props } = renderModal();

    const workInput = screen.getByLabelText('Work Duration (minutes):');
    fireEvent.change(workInput, { target: { value: '30' } });

    fireEvent.click(screen.getByText('Save'));

    expect(props.onWorkDurationChange).toHaveBeenCalledWith(30);
  });

  it('enforces a minimum value of 1', () => {
    const { props } = renderModal();

    const workInput = screen.getByLabelText('Work Duration (minutes):');
    fireEvent.change(workInput, { target: { value: '0' } });

    fireEvent.click(screen.getByText('Save'));

    expect(props.onWorkDurationChange).toHaveBeenCalledWith(1);
  });
});

describe('SettingsButton', () => {
  it('renders a button with Settings text and calls onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SettingsButton onClick={onClick} />);

    const button = screen.getByText('Settings');
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });
});

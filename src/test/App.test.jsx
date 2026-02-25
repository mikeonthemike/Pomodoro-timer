import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from '../App';

/**
 * Advance the timer by n seconds, ticking one second at a time.
 * The App's useEffect clears/recreates the interval on every state change,
 * so each tick must flush through React before the next one fires.
 */
function tickSeconds(n) {
  for (let i = 0; i < n; i++) {
    act(() => { vi.advanceTimersByTime(1000); });
  }
}

/**
 * Run a full timer period to completion (countdown + transition tick).
 * The timer needs durationMinutes*60 ticks to reach 0:00, then 1 more
 * tick for the transition branch to fire (it checks when both are already 0).
 */
function completeTimer(durationMinutes) {
  tickSeconds(durationMinutes * 60 + 1);
}

describe('App – timer logic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders initial state: 25:00, Work mode, 0 sessions', () => {
    render(<App />);
    expect(screen.getByText('25:00')).toBeInTheDocument();
    expect(screen.getByText(/Current mode:.*Work/)).toBeInTheDocument();
    expect(screen.getByText(/Completed work sessions: 0/)).toBeInTheDocument();
  });

  it('starts countdown when Start is clicked', () => {
    render(<App />);

    fireEvent.click(screen.getByText('Start'));
    expect(screen.getByText('Pause')).toBeInTheDocument();

    tickSeconds(1);
    expect(screen.getByText('24:59')).toBeInTheDocument();

    tickSeconds(1);
    expect(screen.getByText('24:58')).toBeInTheDocument();
  });

  it('pauses and resumes the timer', () => {
    render(<App />);

    fireEvent.click(screen.getByText('Start'));
    tickSeconds(3);
    expect(screen.getByText('24:57')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Pause'));
    expect(screen.getByText('Start')).toBeInTheDocument();

    tickSeconds(5);
    expect(screen.getByText('24:57')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Start'));
    tickSeconds(2);
    expect(screen.getByText('24:55')).toBeInTheDocument();
  });

  it('resets the timer to current mode duration', () => {
    render(<App />);

    fireEvent.click(screen.getByText('Start'));
    tickSeconds(5);

    fireEvent.click(screen.getByText('Pause'));
    fireEvent.click(screen.getByText('Reset'));
    expect(screen.getByText('25:00')).toBeInTheDocument();
    expect(screen.getByText('Start')).toBeInTheDocument();
  });

  it('transitions from work to short break when timer reaches 0:00', () => {
    render(<App />);

    fireEvent.click(screen.getByText('Start'));
    completeTimer(25);

    expect(screen.getByText(/Current mode:.*Short Break/)).toBeInTheDocument();
    expect(screen.getByText('05:00')).toBeInTheDocument();
    expect(screen.getByText(/Completed work sessions: 1/)).toBeInTheDocument();
  });

  it('transitions to long break after sessionsBeforeLongBreak work sessions', () => {
    render(<App />);

    for (let session = 0; session < 3; session++) {
      fireEvent.click(screen.getByText('Start'));
      completeTimer(25);

      fireEvent.click(screen.getByText('Start'));
      completeTimer(5);
    }

    fireEvent.click(screen.getByText('Start'));
    completeTimer(25);

    expect(screen.getByText(/Current mode:.*Long Break/)).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
    expect(screen.getByText(/Completed work sessions: 4/)).toBeInTheDocument();
  }, 30000);

  it('returns to work mode after a break completes', () => {
    render(<App />);

    fireEvent.click(screen.getByText('Start'));
    completeTimer(25);

    expect(screen.getByText(/Short Break/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Start'));
    completeTimer(5);

    expect(screen.getByText(/Current mode:.*Work/)).toBeInTheDocument();
    expect(screen.getByText('25:00')).toBeInTheDocument();
  });
});

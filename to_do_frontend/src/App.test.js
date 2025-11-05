import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app header title', () => {
  render(<App />);
  const titleEl = screen.getByRole('heading', { name: /my to-do list/i });
  expect(titleEl).toBeInTheDocument();
});

test('renders task input field', () => {
  render(<App />);
  const input = screen.getByRole('textbox', { name: /task title/i });
  expect(input).toBeInTheDocument();
});

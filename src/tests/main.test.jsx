import { render, screen, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';
import WordComponent from '../WordComponent';

test('test of the test', () => {
  expect(1).toBe(1);
});

test('Find the header', async () => {
  render(<WordComponent />);

  await waitFor(() => {
    const h1 = screen.getByText('Dictionary');
    expect(h1).toBeInTheDocument();
  });
});

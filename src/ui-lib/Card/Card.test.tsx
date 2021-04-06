import * as React from 'react';
import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import Card from './Card';

test('loads and defaults to "openOrders" route', async () => {
  render(<Card>Content</Card>);
  expect(screen.getByText(/Content/i)).toHaveTextContent('Content');
});

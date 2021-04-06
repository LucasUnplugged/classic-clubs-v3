import * as React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import App from './App';
import { ROUTE_TITLES } from '../../shared/models/route.models';

const server = setupServer(
  rest.get('data.json', (req, res, ctx) => {
    return res(
      ctx.json({
        inventory: {
          bread: 10,
          lettuce: 5,
          tomato: 5,
          cheese: 5,
          bacon: 5,
          turkey: 5,
        },
        menu: [
          {
            name: 'BLT',
            price: 5,
            ingredients: {
              bread: 3,
              lettuce: 1,
              tomato: 1,
              bacon: 2,
            },
          },
          {
            name: 'Turkey',
            price: 6,
            ingredients: {
              bread: 2,
              lettuce: 1,
              tomato: 1,
              cheese: 1,
              turkey: 1,
            },
          },
        ],
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('loads and defaults to "openOrders" route', async () => {
  const title = ROUTE_TITLES['/open-orders'];
  render(<App />);

  await screen.findByText(title);

  expect(screen.getByRole(title)).toHaveTextContent('Open Orders');
});

// test('test', () => {
//   const { getByText } = render(<p>Orders</p>);
//   expect(getByText(/Orders/i)).toBeInTheDocument();
// });

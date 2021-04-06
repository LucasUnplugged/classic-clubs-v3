import * as React from 'react';
import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import App from './App';
import { ROUTE_TITLES } from '../../shared/models/route.models';

const inventory = {
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
};

beforeAll(() => {
  const mockedListener = jest.spyOn(window, 'fetch');
  mockedListener.mockResolvedValueOnce(new Response(JSON.stringify(inventory)));
});

test('loads and defaults to "openOrders" route', async () => {
  const title = ROUTE_TITLES['/open-orders'];
  render(<App />);

  await screen.findByRole('heading', { name: title });

  expect(screen.getByRole('heading', { name: title })).toHaveTextContent('Open Orders');
  expect(screen.getByRole('rowgroup')).toBeEmptyDOMElement();
  // expect(screen.getAllByRole('button', { name: ROUTE_TITLES['/new-order'] })).toHaveTextContent(
  //   'New Order'
  // );
});

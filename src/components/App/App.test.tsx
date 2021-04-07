import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
      name: 'Vegetarian',
      price: 4,
      ingredients: {
        bread: 2,
        lettuce: 2,
        tomato: 2,
        cheese: 2,
      },
    },
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

beforeEach(() => {
  const mockedListener = jest.spyOn(window, 'fetch');
  mockedListener.mockResolvedValueOnce(new Response(JSON.stringify(inventory)));
});

test('loads and defaults to empty "open-orders" route', async () => {
  const title = ROUTE_TITLES['/open-orders'];
  render(<App />);

  await screen.findByRole('heading', { name: title });

  expect(screen.getByRole('heading', { name: title })).toHaveTextContent('Open Orders');
  expect(screen.getByRole('rowgroup')).toBeEmptyDOMElement();
  expect(screen.getByRole('button', { name: title })).toHaveClass('active');
  expect(screen.getByRole('complementary').querySelector('li h3')).toHaveTextContent(
    '0Open orders'
  );
});

test('navigates to "new-order" route, and displays menu grid', async () => {
  const title = ROUTE_TITLES['/new-order'];
  render(<App />);

  const navButton = screen.getByRole('button', { name: title });
  userEvent.click(navButton);

  await screen.findByRole('heading', { name: title });

  expect(screen.getByRole('heading', { name: title })).toHaveTextContent('New Order');
  expect(navButton).toHaveClass('primary');
  expect(screen.getByRole('article')).toHaveClass('OrderMenu');
  expect(screen.getByRole('article').querySelectorAll('ul[role="grid"] > li')).toHaveLength(3);
  expect(screen.getByRole('complementary').querySelector('header > h2')).toHaveTextContent(
    'Order Details #1'
  );
  expect(screen.getByRole('complementary').querySelector('li.empty h4')).toHaveTextContent(
    'Order is Empty'
  );
});

test('creates an order, and navigates to "open-orders" route', async () => {
  const title = ROUTE_TITLES['/new-order'];
  render(<App />);

  const navButton = screen.getByRole('button', { name: title });
  userEvent.click(navButton);

  await screen.findByRole('heading', { name: title });

  expect(screen.getByRole('heading', { name: title })).toHaveTextContent('New Order');
  expect(
    screen.getByRole('article').querySelectorAll('ul[role="grid"] > li')[2].querySelector('h3')
  ).toHaveTextContent('Turkey');

  const turkeyButton = screen
    .getByRole('article')
    .querySelectorAll('ul[role="grid"] > li')[2]
    .querySelector('header section button');

  if (turkeyButton) {
    userEvent.click(turkeyButton);
  }

  expect(screen.getByRole('complementary').querySelector('ul > li > p')).toHaveTextContent(
    '1Turkey'
  );

  expect(screen.getByRole('complementary').querySelector('ul > li.total > p')).toHaveTextContent(
    'Total:$6.00'
  );

  const orderButton = screen.getByRole('button', { name: 'Submit Order' });
  userEvent.click(orderButton);

  const orderTitle = ROUTE_TITLES['/open-orders'];
  await screen.findByRole('heading', { name: orderTitle });
  expect(screen.getByRole('heading', { name: orderTitle })).toHaveTextContent('Open Orders');

  expect(screen.getByRole('complementary').querySelector('li h3')).toHaveTextContent('1Open order');
  expect(screen.getByRole('rowgroup')).not.toBeEmptyDOMElement();
  expect(screen.getByRole('rowgroup').querySelector('li[role="row"] header h4')).toHaveTextContent(
    'Order #1'
  );
  expect(
    screen.getByRole('rowgroup').querySelector('li[role="row"] ul.items li')
  ).toHaveTextContent('1 Turkey');
  expect(screen.getByRole('rowgroup').querySelector('li[role="row"] .cost')).toHaveTextContent(
    '$6.00'
  );
});

test('picks up an order, and navigates to "pickedup-orders" route', async () => {
  const title = ROUTE_TITLES['/new-order'];
  render(<App />);

  const navButton = screen.getByRole('button', { name: title });
  userEvent.click(navButton);

  await screen.findByRole('heading', { name: title });

  const turkeyButton = screen
    .getByRole('article')
    .querySelectorAll('ul[role="grid"] > li')[2]
    .querySelector('header section button');

  if (turkeyButton) {
    userEvent.click(turkeyButton);
  }

  const orderButton = screen.getByRole('button', { name: 'Submit Order' });
  userEvent.click(orderButton);

  const orderTitle = ROUTE_TITLES['/open-orders'];
  await screen.findByRole('heading', { name: orderTitle });

  expect(screen.getByRole('rowgroup')).not.toBeEmptyDOMElement();

  const pickupButton = screen.getByRole('cell', { name: 'Mark order as "picked-up"' });
  if (pickupButton) {
    userEvent.click(pickupButton);
  }

  expect(screen.getByRole('rowgroup')).toBeEmptyDOMElement();

  const pickedupButton = screen.getByRole('button', { name: 'Picked-Up Orders' });
  userEvent.click(pickedupButton);

  const pickedupTitle = ROUTE_TITLES['/pickedup-orders'];
  await screen.findByRole('heading', { name: pickedupTitle });

  expect(screen.getByRole('rowgroup')).not.toBeEmptyDOMElement();
  expect(screen.getByRole('complementary').querySelector('li h3')).toHaveTextContent(
    '0Open orders'
  );
  expect(screen.getByRole('rowgroup').querySelector('li[role="row"] header h4')).toHaveTextContent(
    'Order #1'
  );
  expect(
    screen.getByRole('rowgroup').querySelector('li[role="row"] ul.items li')
  ).toHaveTextContent('1 Turkey');
  expect(screen.getByRole('rowgroup').querySelector('li[role="row"] .cost')).toHaveTextContent(
    '$6.00'
  );
  expect(screen.getByRole('rowgroup').querySelector('li[role="row"] .status')).toHaveTextContent(
    'Picked-Up'
  );
});

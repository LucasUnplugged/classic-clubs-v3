import * as React from 'react';
import { Order, OrderStatus, SandwichNames } from '../../shared/models/data.models';
import Button from '../../ui-lib/Button/Button';
import { OrderDispatch } from '../Orders/Orders.reducer';
import './OrderList.css';

const MINUTES_RANGE = 3600000;
const SECONDS_RANGE = 60000;

interface OrderListProps {
  now: number;
  ordersDispatch: OrderDispatch;
  orders: Order[];
}

export default function OrderList(props: OrderListProps) {
  const { now, ordersDispatch, orders } = props;

  const updateOrder = React.useCallback(
    (order: Order): void => {
      console.log(`Marking order #${order.id} as picked-up`, order);
      // Update order status
      ordersDispatch({ type: 'UPDATE_ORDER', order: { ...order, status: OrderStatus.pickedUp } });
    },
    [ordersDispatch]
  );

  const orderList = React.useMemo(
    (): React.ReactNode[] =>
      orders.map(
        (order: Order): React.ReactNode => {
          const timeDiff = Math.max(0, now - order.timestamp);
          let date = new Date(order.timestamp).toDateString();

          if (timeDiff < SECONDS_RANGE) {
            date = `${(timeDiff / 1000).toFixed(0)} seconds ago`;
          } else if (timeDiff < MINUTES_RANGE) {
            date = `${(timeDiff / 60000).toFixed(0)} minutes ago`;
          }

          const orderItems: React.ReactNode[] = [];
          Object.entries(order.items).forEach(
            ([type, amount]: [keyof typeof SandwichNames, number]): void => {
              if (amount > 0) {
                orderItems.push(
                  <li key={type}>
                    {amount} {type}
                  </li>
                );
              }
            }
          );

          return (
            <li key={order.id} role="row">
              <header role="cell">
                <h4>Order #{order.id}</h4>
                <h5 className="date">{date}</h5>
              </header>
              <ul className="items" role="cell">
                {orderItems}
              </ul>
              <strong className="cost" role="cell">
                ${order.cost.toFixed(2)}
              </strong>
              {order.status === OrderStatus.open ? (
                <Button
                  role="cell"
                  aria-label={'Mark order as "picked-up"'}
                  onClick={() => updateOrder(order)}
                >
                  Picked-Up
                </Button>
              ) : (
                <em className="status" role="cell">
                  Picked-Up
                </em>
              )}
            </li>
          );
        }
      ),
    [now, orders, updateOrder]
  );

  return (
    <ul className="OrderList" role="rowgroup">
      {orderList}
    </ul>
  );
}

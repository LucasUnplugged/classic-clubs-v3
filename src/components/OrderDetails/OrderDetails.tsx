import * as React from 'react';
import { Order, Sandwiches, SandwichNames } from '../../shared/models/data.models';
import Button from '../../ui-lib/Button/Button';
import './OrderDetails.css';

interface OrderDetailsProps {
  children: React.ReactNode;
  menu: Sandwiches;
  order: Order;
  removeSandwich: (type: keyof typeof SandwichNames, amount: number) => void;
}

export default function OrderDetails(props: OrderDetailsProps) {
  const { children, menu, order, removeSandwich } = props;

  const sandwichList = React.useMemo(
    (): React.ReactNode[] =>
      Object.entries(order.items).map(
        ([type, amount]: [keyof typeof SandwichNames, number]): React.ReactNode => {
          return !amount ? null : (
            <li key={type}>
              <p>
                {amount}
                <strong className="type">{type}</strong>
              </p>
              <section>
                ${(menu[type].price * amount).toFixed(2)}
                <Button
                  aria-label={amount > 1 ? `Remove 1 ${type} sandwich` : `Remove ${type} sandwich`}
                  isIcon
                  onClick={() => removeSandwich(type, amount)}
                >
                  {amount > 1 ? '–' : 'X'}
                </Button>
              </section>
            </li>
          );
        }
      ),
    [menu, order, removeSandwich]
  );
  return (
    <aside className="OrderDetails">
      <header>
        <h2>
          Order Details <span>#{order.id}</span>
        </h2>
      </header>
      <ul>
        {sandwichList}
        {order.itemCount === 0 && (
          <li className="empty">
            <h4>Order is Empty</h4>
            <p>Please add sandwiches from the menu.</p>
          </li>
        )}
        {order.itemCount > 0 && (
          <li className="total">
            <p>
              Total:
              <strong className="type">${order.cost.toFixed(2)}</strong>
            </p>
          </li>
        )}
      </ul>
      {children}
    </aside>
  );
}

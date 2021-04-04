import * as React from 'react';
import './OrderMenu.css';
import { ShopContext } from '../App/App';
import { OrderDispatch } from '../Orders/Orders.reducer';
import {
  Order,
  OrderItems,
  OrderState,
  Sandwich,
  SandwichNames,
} from '../../shared/models/data.models';
import Card, { CardPadding } from '../../ui-lib/Card/Card';
import Button from '../../ui-lib/Button/Button';

interface OrderMenuProps {
  ordersDispatch: OrderDispatch;
}

const emptyItems = {} as OrderItems;
Object.keys(SandwichNames).forEach((name: keyof typeof SandwichNames): void => {
  emptyItems[name as string] = 0;
});

export default function OrderMenu(props: OrderMenuProps) {
  const { ordersDispatch } = props;
  const {
    incrementOrderNumber,
    inventory,
    inventoryDispatch,
    menu,
    orderNumber,
  } = React.useContext(ShopContext);

  const [order, setOrder] = React.useState<Order>({
    cost: 0,
    id: orderNumber,
    items: emptyItems,
    state: OrderState.open,
    timestamp: new Date().getTime(),
  });

  // Build a memoized list of sandwiches
  const sandwichList = React.useMemo((): React.ReactNode[] => {
    // Handler for the "Add to Order" button
    const addToOrder = (sandwich: Sandwich): void => {
      // Add to order
      setOrder(
        (currentOrder: Order): Order => ({
          ...currentOrder,
          items: {
            ...currentOrder.items,
            [sandwich.name]: currentOrder.items[sandwich.name] + 1,
          },
        })
      );
      // Remove all sandwich ingredients from inventory
      inventoryDispatch({ type: 'REMOVE_SANDWICH', sandwich });
    };

    // Validator for whether we have enough ingredients in the inventory
    const hasIngredients = (sandwich: Sandwich): boolean => {
      for (const ingredient in sandwich.ingredients) {
        if (sandwich.ingredients.hasOwnProperty(ingredient)) {
          const amount = sandwich.ingredients[ingredient];
          if (inventory[ingredient] - amount < 0) {
            return false;
          }
        }
      }
      return true;
    };

    // Return the list of sandwiches
    return Object.entries(menu).map(
      ([name, sandwich]: [keyof typeof SandwichNames, Sandwich]): React.ReactNode => {
        const isDisabled = !hasIngredients(sandwich);
        return (
          <li key={name} className={isDisabled ? 'disabled' : ''}>
            <Card padding={CardPadding.none}>
              <header>
                <h3>{name}</h3>
                <section>
                  <span className="price">${sandwich.price}</span>
                  <Button isDisabled={isDisabled} onClick={() => addToOrder(sandwich)}>
                    {isDisabled ? 'Sold Out' : 'Add to Order'}
                  </Button>
                </section>
              </header>
              <section>
                <h4>Ingredients</h4>
                <ul className="ingredients">
                  {Object.entries(sandwich.ingredients).map(
                    ([ingredient, amount]): React.ReactNode => (
                      <li key={ingredient}>
                        {amount}
                        <strong>{ingredient}</strong>
                      </li>
                    )
                  )}
                </ul>
              </section>
            </Card>
          </li>
        );
      }
    );
  }, [inventory, inventoryDispatch, menu]);

  return (
    <>
      <article className="OrderMenu">
        <ul>{sandwichList}</ul>
      </article>
      <aside className="OrderMenu--details">
        Details
        {JSON.stringify(order)}
      </aside>
    </>
  );
}

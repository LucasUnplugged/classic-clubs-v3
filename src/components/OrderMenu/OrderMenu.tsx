import * as React from 'react';
import './OrderMenu.css';
import { ShopContext } from '../App/App';
import { OrderDispatch } from '../Orders/Orders.reducer';
import {
  Order,
  OrderItems,
  OrderStatus,
  Sandwich,
  SandwichNames,
} from '../../shared/models/data.models';
import Card, { CardPadding } from '../../ui-lib/Card/Card';
import Button from '../../ui-lib/Button/Button';
import OrderDetails from '../OrderDetails/OrderDetails';

const emptyItems = {} as OrderItems;
Object.keys(SandwichNames).forEach((name: keyof typeof SandwichNames): void => {
  emptyItems[name as string] = 0;
});

interface OrderMenuProps {
  ordersDispatch: OrderDispatch;
}

export default function OrderMenu(props: OrderMenuProps) {
  const { ordersDispatch } = props;
  const {
    addToOrder,
    incrementOrderNumber,
    inventory,
    inventoryDispatch,
    menu,
    orderNumber,
    removeFromOrder,
    viewOpenOrders,
  } = React.useContext(ShopContext);

  const emptyOrder = React.useMemo(
    (): Order => ({
      cost: 0,
      id: orderNumber,
      itemCount: 0,
      items: emptyItems,
      status: OrderStatus.open,
      timestamp: new Date().getTime(),
    }),
    [orderNumber]
  );

  // Create a working order, to make sure we can easily modify + cancel it
  const [order, setOrder] = React.useState<Order>({ ...emptyOrder });

  const isMounted = React.useRef<HTMLHeadingElement>(null);
  const isOrderCompleted = React.useRef(false);

  // ORDER MANAGEMENT FUNCTIONS ///////////////////////////////////////////////////////////////////
  const restartOrder = React.useCallback((): void => {
    // Return our order's ingredients to the inventory
    inventoryDispatch({ type: 'CANCEL_ORDER', menu, order });
    // Reset the open order
    setOrder({ ...emptyOrder });
  }, [emptyOrder, inventoryDispatch, menu, order]);

  const removeSandwich = React.useCallback(
    (type: keyof typeof SandwichNames): void => {
      const sandwich = menu[type];
      // Remove from order
      setOrder((odr: Order): Order => removeFromOrder(odr, sandwich));
      // Return our sandwich's ingredients to the inventory
      inventoryDispatch({ type: 'ADD_SANDWICH', sandwich });
    },
    [inventoryDispatch, menu, removeFromOrder]
  );

  const submitOrder = React.useCallback((): void => {
    console.log(`Submitting order #${order.id}`, order);
    // NOTE: The shop's inventory is already up-to-date, so does not need to be updated here
    // Increment our global order number
    incrementOrderNumber();
    // Add order to list
    ordersDispatch({ type: 'ADD_ORDER', order: { ...order, timestamp: new Date().getTime() } });
    // Go to the open orders page
    isOrderCompleted.current = true;
    viewOpenOrders();
  }, [incrementOrderNumber, order, ordersDispatch, viewOpenOrders]);
  // END OF ORDER MANAGEMENT FUNCTIONS ////////////////////////////////////////////////////////////

  // If we unmount before order completion, make sure we cancel the order
  React.useEffect(
    () => (): void => {
      // We only want to run this when the component unmounts (not on regular clean-up),
      // and only if the order is NOT completed.
      if (!isMounted.current && !isOrderCompleted.current) {
        restartOrder();
      }
    },
    [restartOrder]
  );

  // Build a memoized list of sandwiches
  const sandwichList = React.useMemo((): React.ReactNode[] => {
    // Handler for the "Add to Order" button
    const addSandwich = (sandwich: Sandwich): void => {
      // Add to order
      setOrder((odr: Order): Order => addToOrder(odr, sandwich));
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
        const isSoldOut = !hasIngredients(sandwich);
        return (
          <Card
            tag="li"
            key={name}
            className={isSoldOut ? 'sold-out' : ''}
            padding={CardPadding.none}
            role="gridcell"
          >
            <header>
              <h3>{name}</h3>
              <section>
                <span className="price">${sandwich.price}</span>
                <Button isDisabled={isSoldOut} onClick={() => addSandwich(sandwich)}>
                  {isSoldOut ? 'Sold Out' : 'Add to Order'}
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
                      <span>{ingredient}</span>
                    </li>
                  )
                )}
              </ul>
            </section>
          </Card>
        );
      }
    );
  }, [inventory, inventoryDispatch, addToOrder, menu]);

  return (
    <>
      <article ref={isMounted} className="OrderMenu">
        <ul role="grid">{sandwichList}</ul>
      </article>
      <OrderDetails menu={menu} order={order} removeSandwich={removeSandwich}>
        {order.itemCount > 0 && (
          <footer>
            <Button isLink onClick={restartOrder}>
              Restart Order
            </Button>
            <Button isDisabled={!order.itemCount} isPrimary onClick={submitOrder}>
              Submit Order
            </Button>
          </footer>
        )}
      </OrderDetails>
    </>
  );
}

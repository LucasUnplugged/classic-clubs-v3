import * as React from 'react';
import './App.css';
import Orders from '../Orders/Orders';
import Button from '../../ui-lib/Button/Button';
import {
  Inventory,
  Sandwich,
  Sandwiches,
  ShopDTO,
  Ingredient,
  Order,
  SandwichNames,
} from '../../shared/models/data.models';
import { Route, ROUTE_TITLES } from '../../shared/models/route.models';
import { inventoryReducer, InventoryReducer, InventoryAction } from './App.reducer';

// MODULE HELPERS /////////////////////////////////////////////////////////////////////////////////
// Getter for our specific route handlers, to avoid boilerplate repetition
const getRouteHandler = (key: keyof typeof Route, setter: (route: Route) => void): (() => void) => {
  return (): void => {
    setter(Route[key]);
    window.history.pushState(null, key as string, Route[key]);
  };
};

// Dynamically create a valid empty inventory, based on the `Ingredient` type
const emptyInventory = {} as Inventory;
Object.keys(Ingredient).forEach((key: string): void => {
  emptyInventory[key] = 0;
});
// END OF MODULE HELPERS //////////////////////////////////////////////////////////////////////////

// SHOP CONTEXT ///////////////////////////////////////////////////////////////////////////////////
type OrderModifier = (order: Order, sandwich: Sandwich) => Order;
interface ShopContextType {
  addToOrder: OrderModifier;
  incrementOrderNumber: () => void;
  inventory: Inventory;
  inventoryDispatch: (action: InventoryAction) => void;
  menu: Sandwiches;
  orderNumber: number;
  removeFromOrder: OrderModifier;
  viewOpenOrders: () => void;
}
export const ShopContext = React.createContext<ShopContextType>({} as ShopContextType);
// END OF SHOP CONTEXT ////////////////////////////////////////////////////////////////////////////

// MAIN APP FC ////////////////////////////////////////////////////////////////////////////////////
export default function App() {
  // Setup app state
  const [route, setRoute] = React.useState<Route>();
  const [inventory, inventoryDispatch] = React.useReducer<InventoryReducer>(
    inventoryReducer,
    emptyInventory
  );
  const [menu, setMenu] = React.useState<Sandwiches>({} as Sandwiches);
  const [orderNumber, setOrderNumber] = React.useState<number>(1);

  // ROUTE MANAGEMENT /////////////////////////////////////////////////////////////////////////////
  // Setup route handlers
  const viewOpenOrders = getRouteHandler('openOrders' as keyof typeof Route, setRoute);
  const viewPickedupOrders = getRouteHandler('pickedupOrders' as keyof typeof Route, setRoute);
  const viewNewOrder = getRouteHandler('newOrder' as keyof typeof Route, setRoute);

  // Set initial route
  React.useEffect((): void => {
    // Determine our initial route...
    const path = window.location.pathname;
    const initialRouteKey =
      Object.keys(Route).find((key: string): boolean => Route[key] === path) || 'openOrders';
    const initialRoute = Route[initialRouteKey];
    // ...and save it into state
    setRoute(initialRoute);
    window.history.pushState(null, initialRouteKey, initialRoute);
  }, []);
  // END OF ROUTE MANAGEMENT //////////////////////////////////////////////////////////////////////

  // EVENT HANDLERS ///////////////////////////////////////////////////////////////////////////////
  // KeyDown handler
  const keyDownHandler = React.useCallback(
    (event: KeyboardEvent): void => {
      if (event.shiftKey) {
        switch (event.key) {
          case 'N':
            viewNewOrder();
            break;

          case 'O':
            viewOpenOrders();
            break;

          case 'P':
            viewPickedupOrders();
            break;

          default:
            break;
        }
      }
    },
    [viewNewOrder, viewOpenOrders, viewPickedupOrders]
  );

  // Add event listeners
  React.useEffect(() => {
    window.addEventListener('keydown', keyDownHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, [keyDownHandler]);
  // END OF EVENT HANDLERS ////////////////////////////////////////////////////////////////////////

  // ORDER MODIFIER FUNCTIONS /////////////////////////////////////////////////////////////////////
  const incrementOrderNumber = React.useCallback(
    (): void => setOrderNumber((count: number): number => count + 1),
    []
  );

  const getOrderCost = React.useCallback(
    (order: Order): number => {
      let cost = 0;
      Object.entries(order.items).forEach(
        ([type, amount]: [keyof typeof SandwichNames, number]): void => {
          cost += menu[type].price * amount;
        }
      );
      return cost;
    },
    [menu]
  );

  // Add/remove a sandwich to/from an order
  const updateOrderSandwiches = React.useCallback(
    (order: Order, sandwich: Sandwich, modifier: number): Order => {
      const newOrder: Order = {
        ...order,
        itemCount: order.itemCount + modifier,
        items: {
          ...order.items,
          [sandwich.name]: order.items[sandwich.name] + modifier,
        },
      };
      newOrder.cost = getOrderCost(newOrder);
      return newOrder;
    },
    [getOrderCost]
  );

  const addToOrder: OrderModifier = React.useCallback(
    (order: Order, sandwich: Sandwich): Order => updateOrderSandwiches(order, sandwich, 1),
    [updateOrderSandwiches]
  );

  const removeFromOrder: OrderModifier = React.useCallback(
    (order: Order, sandwich: Sandwich): Order => updateOrderSandwiches(order, sandwich, -1),
    [updateOrderSandwiches]
  );
  // END OF ORDER MODIFIER FUNCTIONS //////////////////////////////////////////////////////////////

  // DATA FETCHING ////////////////////////////////////////////////////////////////////////////////
  // Fetch the inventory and menu data
  React.useEffect((): void => {
    fetch('data.json', {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    })
      .then((response: Response): Promise<ShopDTO> => response.json())
      .then((data: ShopDTO): void => {
        inventoryDispatch({ type: 'SET_INVENTORY', inventory: data.inventory });
        const sandwiches = {} as Sandwiches;
        data.menu.forEach((sandwich: Sandwich): void => {
          sandwiches[sandwich.name as string] = sandwich;
        });
        setMenu(sandwiches);
      });
  }, []);
  // END OF DATA FETCHING /////////////////////////////////////////////////////////////////////////

  return (
    <ShopContext.Provider
      value={{
        addToOrder,
        incrementOrderNumber,
        inventory,
        inventoryDispatch,
        menu,
        orderNumber,
        removeFromOrder,
        viewOpenOrders,
      }}
    >
      <main className="App" role="main">
        <header role="banner">
          <h1 role="img" aria-label="Company logo: white text inside a red container">
            Classic Clubs
          </h1>
          <nav role="navigation">
            <ul>
              <li>
                <Button isLink isActive={route === Route.openOrders} onClick={viewOpenOrders}>
                  {ROUTE_TITLES[Route.openOrders]}
                </Button>
              </li>
              <li>
                <Button
                  isLink
                  isActive={route === Route.pickedupOrders}
                  onClick={viewPickedupOrders}
                >
                  {ROUTE_TITLES[Route.pickedupOrders]}
                </Button>
              </li>
              <li>
                <Button isPrimary={route === Route.newOrder} onClick={viewNewOrder}>
                  {ROUTE_TITLES[Route.newOrder]}
                </Button>
              </li>
            </ul>
          </nav>
        </header>
        {route && <Orders route={route} />}
      </main>
    </ShopContext.Provider>
  );
}

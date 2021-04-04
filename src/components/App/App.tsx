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
} from '../../shared/models/data.models';
import { Route, ROUTE_TITLES } from '../../shared/models/route.models';
import { inventoryReducer, InventoryReducer, InventoryAction } from './App.reducer';

// Getter for our specific route handlers, to avoid boilerplate repetition
const getRouteHandler = (key: keyof Route, setter: (route: Route) => void): (() => void) => {
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

// SHOP CONTEXT ///////////////////////////////////////////////////////////////////////////////////
interface ShopContextType {
  incrementOrderNumber: (number: number) => void;
  inventory: Inventory;
  inventoryDispatch: (action: InventoryAction) => void;
  menu: Sandwiches;
  orderNumber: number;
}
export const ShopContext = React.createContext<ShopContextType>({} as ShopContextType);
// END OF SHOP CONTEXT ////////////////////////////////////////////////////////////////////////////

export default function App() {
  // Setup app state
  const [route, setRoute] = React.useState<Route>();
  const [inventory, inventoryDispatch] = React.useReducer<InventoryReducer>(
    inventoryReducer,
    emptyInventory
  );
  const [menu, setMenu] = React.useState<Sandwiches>({} as Sandwiches);
  const [orderNumber, setOrderNumber] = React.useState<number>(0);
  const incrementOrderNumber = React.useCallback(
    (): void => setOrderNumber((count: number): number => count + 1),
    []
  );

  // Setup route handlers
  const viewOpenOrder = getRouteHandler('openOrders' as keyof Route, setRoute);
  const viewPickedupOrder = getRouteHandler('pickedupOrders' as keyof Route, setRoute);
  const viewNewOrder = getRouteHandler('newOrder' as keyof Route, setRoute);

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

  console.warn(
    `************************
    TODO:
      - Responsiveness
      - Accessibility sweep
      - Tests
    ************************`
  );

  return (
    <ShopContext.Provider
      value={{ incrementOrderNumber, inventory, inventoryDispatch, menu, orderNumber }}
    >
      <main className="App">
        <header>
          <h1>Classic Clubs</h1>
          <nav>
            <ul>
              <li>
                <Button isLink isActive={route === Route.openOrders} onClick={viewOpenOrder}>
                  {ROUTE_TITLES[Route.openOrders]}
                </Button>
              </li>
              <li>
                <Button
                  isLink
                  isActive={route === Route.pickedupOrders}
                  onClick={viewPickedupOrder}
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

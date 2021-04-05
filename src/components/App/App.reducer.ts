import {
  Ingredient,
  Inventory,
  Order,
  Sandwich,
  Sandwiches,
  SandwichNames,
} from '../../shared/models/data.models';

type InventoryActionType =
  | 'ADD_SANDWICH'
  | 'CANCEL_ORDER'
  | 'REDUCE_INGREDIENT'
  | 'REMOVE_SANDWICH'
  | 'SET_INVENTORY';
interface ReduceInventoryAction {
  type: InventoryActionType;
  ingredient: Ingredient;
  amount?: number;
  inventory?: never;
  menu?: never;
  order?: never;
  sandwich?: never;
}
interface OrderInventoryAction {
  type: InventoryActionType;
  menu: Sandwiches;
  order: Order;
  amount?: never;
  ingredient?: never;
  inventory?: never;
  sandwich?: never;
}
interface SandwichInventoryAction {
  type: InventoryActionType;
  sandwich: Sandwich;
  amount?: never;
  ingredient?: never;
  inventory?: never;
  menu?: never;
  order?: never;
}
interface SetInventoryAction {
  type: InventoryActionType;
  inventory: Inventory;
  amount?: never;
  ingredient?: never;
  menu?: never;
  order?: never;
  sandwich?: never;
}
export type InventoryAction =
  | ReduceInventoryAction
  | OrderInventoryAction
  | SandwichInventoryAction
  | SetInventoryAction;
export type InventoryReducer = (state: Inventory, action: InventoryAction) => Inventory;

export const inventoryReducer: InventoryReducer = (
  state: Inventory,
  action: InventoryAction
): Inventory => {
  const newState = { ...state };
  switch (action.type) {
    case 'ADD_SANDWICH':
      if (!action.sandwich) {
        return state;
      }
      Object.entries(action.sandwich.ingredients).forEach(([ingredient, amount]): void => {
        newState[ingredient] = newState[ingredient] + amount;
      });
      return newState;

    case 'CANCEL_ORDER':
      if (!action.order || !action.menu) {
        return state;
      }
      // For each sandwich type in the order, we want to return
      // those ingredients into the inventory.
      Object.entries(action.order.items).forEach(
        ([type, multiplier]: [keyof typeof SandwichNames, number]): void => {
          // Only return ingredients for sandwiches that are in the order
          if (multiplier > 0) {
            const sandwich = action.menu[type];
            Object.entries(sandwich.ingredients).forEach(([ingredient, quantity]): void => {
              // Make sure we're accounting for each sandwhich of this type (i.e., the multiplier)
              newState[ingredient] = newState[ingredient] + quantity * multiplier;
            });
          }
        }
      );
      return newState;

    case 'REDUCE_INGREDIENT':
      if (!action.ingredient) {
        return state;
      }
      const amount = action.amount ?? 0;
      return {
        ...state,
        [action.ingredient]: state[action.ingredient] - amount,
      };

    case 'REMOVE_SANDWICH':
      if (!action.sandwich) {
        return state;
      }
      Object.entries(action.sandwich.ingredients).forEach(([ingredient, amount]): void => {
        newState[ingredient] = newState[ingredient] - amount;
      });
      return newState;

    case 'SET_INVENTORY':
      if (!action.inventory) {
        return state;
      }
      return action.inventory;

    default:
      // If nothing change, we return `state` to avoid a reference change
      return state;
  }
};

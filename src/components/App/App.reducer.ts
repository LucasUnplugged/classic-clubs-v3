import { Ingredient, Inventory, Sandwich } from '../../shared/models/data.models';

type InventoryActionType =
  | 'ADD_SANDWICH'
  | 'REDUCE_INGREDIENT'
  | 'REMOVE_SANDWICH'
  | 'SET_INVENTORY';
interface ReduceInventoryAction {
  type: InventoryActionType;
  ingredient: Ingredient;
  amount?: number;
  inventory?: never;
  sandwich?: never;
}
interface SandwichInventoryAction {
  type: InventoryActionType;
  sandwich: Sandwich;
  amount?: never;
  ingredient?: never;
  inventory?: never;
}
interface SetInventoryAction {
  type: InventoryActionType;
  inventory: Inventory;
  amount?: never;
  ingredient?: never;
  sandwich?: never;
}
export type InventoryAction = ReduceInventoryAction | SandwichInventoryAction | SetInventoryAction;
export type InventoryReducer = (state: Inventory, action: InventoryAction) => Inventory;

export const inventoryReducer: InventoryReducer = (
  state: Inventory,
  action: InventoryAction
): Inventory => {
  switch (action.type) {
    case 'ADD_SANDWICH':
      if (!action.sandwich) {
        return state;
      }
      const addState = { ...state };
      Object.entries(action.sandwich.ingredients).forEach(([ingredient, amount]): void => {
        addState[ingredient] = addState[ingredient] + amount;
      });
      return addState;
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
      const removeState = { ...state };
      Object.entries(action.sandwich.ingredients).forEach(([ingredient, amount]): void => {
        removeState[ingredient] = removeState[ingredient] - amount;
      });
      return removeState;
    case 'SET_INVENTORY':
      if (!action.inventory) {
        return state;
      }
      return action.inventory;
    default:
      return state;
  }
};

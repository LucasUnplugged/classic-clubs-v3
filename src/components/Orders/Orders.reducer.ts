import { Order } from '../../shared/models/data.models';

type OrderActionType = 'ADD_ORDER' | 'REMOVE_ORDER' | 'UPDATE_ORDER';
interface OrderAction {
  type: OrderActionType;
  order: Order;
}
export type OrderDispatch = (action: OrderAction) => void;
export type OrderReducer = (state: Order[], action: OrderAction) => Order[];

export const orderReducer: OrderReducer = (state: Order[], action: OrderAction): Order[] => {
  switch (action.type) {
    case 'ADD_ORDER':
      return [...state, action.order];

    case 'REMOVE_ORDER':
      return state.filter((order: Order): boolean => order.id !== action.order.id);

    case 'UPDATE_ORDER':
      return state.map(
        (order: Order): Order => (order.id === action.order.id ? action.order : order)
      );

    default:
      // If nothing change, we return `state` to avoid a reference change
      return state;
  }
};

import { Order } from '../../shared/models/data.models';

type OrderActionType = 'ADD_ORDER' | 'REMOVE_ORDER';
interface OrderAction {
  type: OrderActionType;
  order: Order;
}
export type OrderDispatch = (action: OrderAction) => void;
export type OrderReducer = (state: Order[], action: OrderAction) => Order[];

export const orderReducer: OrderReducer = (state: Order[], action: OrderAction): Order[] => {
  if (action.type === 'ADD_ORDER') {
    return [...state, action.order];
  } else if (action.type === 'REMOVE_ORDER') {
    return state.filter((order: Order): boolean => order.id !== action.order.id);
  }
  return state;
};

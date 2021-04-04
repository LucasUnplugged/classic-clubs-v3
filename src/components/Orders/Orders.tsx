import * as React from 'react';
import Card, { CardPadding } from '../../ui-lib/Card/Card';
import './Orders.css';
import OrderDashboard from '../OrderDashboard/OrderDashboard';
import OrderList from '../OrderList/OrderList';
import { Order, OrderState } from '../../shared/models/data.models';
import { Route, ROUTE_TITLES } from '../../shared/models/route.models';
import { orderReducer, OrderReducer } from './Orders.reducer';
import OrderMenu from '../OrderMenu/OrderMenu';

export interface OrderProps {
  route: Route;
}

export default function Orders(props: OrderProps) {
  const { route } = props;
  const [orders, ordersDispatch] = React.useReducer<OrderReducer>(orderReducer, []);
  const [selectedOrder, setSelectedOrder] = React.useState<Order>();
  let title = ROUTE_TITLES[route];

  // Get a list of filtered orders (by route), and open orders
  const [filteredOrders, openOrders] = React.useMemo((): Order[][] => {
    const filtered: Order[] = [];
    const open: Order[] = [];
    orders.forEach((order: Order): void => {
      const isOrderPickedup = order.state === OrderState.pickedUp;
      const isOrderOpen = order.state === OrderState.open;
      const isPickedupRoute = route === Route.pickedupOrders;
      const orderMatchesRoute = isPickedupRoute ? isOrderPickedup : isOrderOpen;
      if (orderMatchesRoute) {
        filtered.push(order);
      }
      if (isOrderOpen) {
        open.push(order);
      }
    });
    return [filtered, open];
  }, [orders, route]);

  return (
    <section className="Orders">
      <header>
        <h2>{title}</h2>
      </header>
      {route !== Route.newOrder && (
        <>
          <OrderDashboard openOrders={openOrders} />
          <Card padding={CardPadding.sm}>
            <OrderList orders={filteredOrders} />
          </Card>
        </>
      )}
      {route === Route.newOrder && (
        <>
          <OrderMenu ordersDispatch={ordersDispatch} />
        </>
      )}
    </section>
  );
}

import * as React from 'react';
import Card, { CardPadding } from '../../ui-lib/Card/Card';
import './Orders.css';
import OrderDashboard from '../OrderDashboard/OrderDashboard';
import OrderList from '../OrderList/OrderList';
import { Order, OrderStatus } from '../../shared/models/data.models';
import { Route, ROUTE_TITLES } from '../../shared/models/route.models';
import { orderReducer, OrderReducer } from './Orders.reducer';
import OrderMenu from '../OrderMenu/OrderMenu';

const HEARTBEAT_DELAY = 4000;
let heartbeat: number;

export interface OrderProps {
  route: Route;
}

export default function Orders(props: OrderProps) {
  const { route } = props;
  const [orders, ordersDispatch] = React.useReducer<OrderReducer>(orderReducer, []);
  const [now, setNow] = React.useState<number>(new Date().getTime());
  let title = ROUTE_TITLES[route];

  // Live update heartbeat
  React.useEffect((): (() => void) => {
    // Only maintain heartbeat if the user isn't on the "New Order" screen
    if (route !== Route.newOrder) {
      setNow(new Date().getTime());
      heartbeat = setInterval((): void => {
        setNow(new Date().getTime());
      }, HEARTBEAT_DELAY);
    }
    return (): void => clearInterval(heartbeat);
  }, [route]);

  // Get a list of filtered orders (by route), and open orders
  const [filteredOrders, openOrders] = React.useMemo((): Order[][] => {
    const filtered: Order[] = [];
    const open: Order[] = [];
    orders.forEach((order: Order): void => {
      const isOrderPickedup = order.status === OrderStatus.pickedUp;
      const isOrderOpen = order.status === OrderStatus.open;
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
          <OrderDashboard now={now} openOrders={openOrders} />
          <Card padding={CardPadding.sm}>
            <OrderList now={now} ordersDispatch={ordersDispatch} orders={filteredOrders} />
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

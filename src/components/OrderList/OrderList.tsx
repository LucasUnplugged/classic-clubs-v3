import * as React from 'react';
import { Order } from '../../shared/models/data.models';
import './OrderList.css';

interface OrderListProps {
  orders: Order[];
}

export default function OrderList(props: OrderListProps) {
  const { orders } = props;
  const orderList = React.useMemo(
    (): React.ReactNode[] =>
      orders.map((order: Order): React.ReactNode => <li key={order.id}>Order {order.id}</li>),
    [orders]
  );
  return <ul className="OrderList">{orderList}</ul>;
}

import * as React from 'react';
import { Order } from '../../shared/models/data.models';
import Card from '../../ui-lib/Card/Card';
import './OrderDashboard.css';

const LAGGING_DELAY = 300000;
const CRITICAL_DELAY = 600000;

interface OrdersDashboardProps {
  now: number;
  openOrders: Order[];
}

export default function OrderDashboard(props: OrdersDashboardProps) {
  const { now, openOrders } = props;
  const [lagging, setLagging] = React.useState<number>(0);
  const [critical, setCritical] = React.useState<number>(0);

  // Calculate states on every new heartbeat
  React.useEffect((): void => {
    let laggingCount = 0;
    let criticalCount = 0;
    openOrders.forEach((order: Order): void => {
      const delta = now - order.timestamp;
      if (delta > CRITICAL_DELAY) {
        criticalCount++;
      } else if (delta > LAGGING_DELAY) {
        laggingCount++;
      }
    });
    setLagging(laggingCount);
    setCritical(criticalCount);
  }, [now, openOrders]);

  return (
    <aside className="OrderDashboard">
      <ul>
        <Card tag="li">
          <h3>
            <span className="number">{openOrders.length}</span>
            Open orders
          </h3>
        </Card>
        <Card tag="li" className={lagging ? 'lagging' : ''}>
          <h3>
            <span className="number">{lagging}</span>
            Lagging
          </h3>
        </Card>
        <Card tag="li" className={critical ? 'critical' : ''}>
          <h3>
            <span className="number">{critical}</span>
            Critical
          </h3>
        </Card>
      </ul>
    </aside>
  );
}

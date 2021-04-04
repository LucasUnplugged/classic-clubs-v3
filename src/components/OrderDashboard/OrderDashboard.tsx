import * as React from 'react';
import { Order } from '../../shared/models/data.models';
import Card from '../../ui-lib/Card/Card';
import './OrderDashboard.css';

const LAGGING_DELAY = 300000;
const CRITICAL_DELAY = 600000;
const HEARTBEAT_DELAY = 5000;
let heartbeat: number;

interface OrdersDashboardProps {
  openOrders: Order[];
}

export default function OrderDashboard(props: OrdersDashboardProps) {
  const { openOrders } = props;
  const [now, setNow] = React.useState<number>(new Date().getTime());

  // Calculate states on every new heartbeat
  const [laggingOrderCount, criticalOrderCount] = React.useMemo((): number[] => {
    let lagging = 0;
    let critical = 0;
    openOrders.forEach((order: Order): void => {
      if (now - order.timestamp > LAGGING_DELAY) {
        lagging++;
      } else if (now - order.timestamp > CRITICAL_DELAY) {
        critical++;
      }
    });
    return [lagging, critical];
  }, [now, openOrders]);

  // Live update heartbeat
  React.useEffect((): (() => void) => {
    clearInterval(heartbeat);
    heartbeat = setInterval((): void => setNow(new Date().getTime()), HEARTBEAT_DELAY);
    return (): void => {
      clearInterval(heartbeat);
    };
  }, [openOrders]);

  return (
    <aside className="OrderDashboard">
      <ul>
        <li>
          <Card>
            <h3>
              <span className="number">{openOrders.length}</span>
              Open orders
            </h3>
          </Card>
        </li>
        <li className={laggingOrderCount ? 'lagging' : ''}>
          <Card>
            <h3>
              <span className="number">{laggingOrderCount}</span>
              Lagging orders
            </h3>
          </Card>
        </li>
        <li className={criticalOrderCount ? 'critical' : ''}>
          <Card>
            <h3>
              <span className="number">{criticalOrderCount}</span>
              Critical orders
            </h3>
          </Card>
        </li>
      </ul>
    </aside>
  );
}

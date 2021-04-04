type RouteTitles = {
  [K in Route]: string;
};

export enum Route {
  newOrder = '/new-order',
  openOrders = '/open-orders',
  pickedupOrders = '/pickedup-orders',
}

export const ROUTE_TITLES: RouteTitles = {
  '/new-order': 'New Order',
  '/open-orders': 'Open Orders',
  '/pickedup-orders': 'Picked-Up Orders',
};

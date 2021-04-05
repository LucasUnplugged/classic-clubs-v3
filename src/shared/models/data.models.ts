export enum Ingredient {
  bread = 'bread',
  lettuce = 'lettuce',
  tomato = 'tomato',
  cheese = 'cheese',
  bacon = 'bacon',
  turkey = 'turkey',
}

export type Inventory = {
  [K in keyof typeof Ingredient]: number;
};

// Ingredients common to all sandwiches
interface BaseIngredients {
  bread: number;
}

// Variable ingredients, depending on the sandwich
type OptionalIngredients = {
  [K in keyof typeof Ingredient]?: number;
};

export type SandwichIngredients = BaseIngredients & OptionalIngredients;

export enum SandwichNames {
  Vegetarian = 'Vegetarian',
  BLT = 'BLT',
  Turkey = 'Turkey',
}

export interface Sandwich {
  ingredients: SandwichIngredients;
  name: SandwichNames;
  price: number;
}

export enum OrderStatus {
  open = 'open',
  pickedUp = 'pickedUp',
}

export type OrderItems = {
  [K in keyof typeof SandwichNames]: number;
};

export interface Order {
  cost: number;
  id: number;
  itemCount: number;
  items: OrderItems;
  status: OrderStatus;
  timestamp: number;
}

export type Sandwiches = {
  [K in keyof typeof SandwichNames]: Sandwich;
};

export interface ShopDTO {
  inventory: Inventory;
  menu: Sandwich[];
}

import { UserState } from './user';
import { CartState } from './cart';
import { OrderState } from './order';

export interface RootState {
  user: UserState;
  cart: CartState;
  order: OrderState;
};
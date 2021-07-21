import { UserState } from './user';
import { CartState } from './cart';
import { OrderState } from './order';
import { H5State } from './h5';

export interface RootState {
  user: UserState;
  cart: CartState;
  order: OrderState;
  h5: H5State;
};
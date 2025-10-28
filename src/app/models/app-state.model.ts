import { UserState } from '../store/reducers/user.reducer';
import { OrderState } from '../store/reducers/order.reducer';

/**
 * Root application state interface
 * Matches the required structure from requirement #4
 */
export interface AppState {
  users: UserState;
  orders: OrderState;
}

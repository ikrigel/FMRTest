import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderState, selectAll, selectEntities } from '../reducers/order.reducer';

// Feature selector
export const selectOrderState = createFeatureSelector<OrderState>('orders');

// Get all orders using the adapter selector
export const selectAllOrders = createSelector(
  selectOrderState,
  selectAll
);

// Get order entities dictionary
export const selectOrderEntities = createSelector(
  selectOrderState,
  selectEntities
);

// Get loading state
export const selectOrdersLoading = createSelector(
  selectOrderState,
  (state: OrderState) => state.loading
);

// Get error state
export const selectOrdersError = createSelector(
  selectOrderState,
  (state: OrderState) => state.error
);

// Get orders for a specific user
export const selectOrdersByUserId = (userId: number) =>
  createSelector(
    selectAllOrders,
    (orders) => orders.filter(order => order.userId === userId)
  );

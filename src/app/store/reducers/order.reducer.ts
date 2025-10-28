import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Order } from '../../models/user.model';
import * as OrderActions from '../actions/order.actions';

// Define the Order State interface extending EntityState
export interface OrderState extends EntityState<Order> {
  loading: boolean;
  error: any;
}

// Create the Entity Adapter for Order
export const orderAdapter: EntityAdapter<Order> = createEntityAdapter<Order>({
  selectId: (order: Order) => order.id,
  sortComparer: false
});

// Define the initial state using the adapter
export const initialState: OrderState = orderAdapter.getInitialState({
  loading: false,
  error: null
});

// Create the reducer
export const orderReducer = createReducer(
  initialState,

  // Load Orders
  on(OrderActions.loadOrders, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(OrderActions.loadOrdersSuccess, (state, { orders }) =>
    orderAdapter.setAll(orders, {
      ...state,
      loading: false,
      error: null
    })
  ),

  on(OrderActions.loadOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Add Order - Prevent duplicates
  on(OrderActions.addOrder, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(OrderActions.addOrderSuccess, (state, { order }) => {
    const existingOrder = state.entities[order.id];

    if (existingOrder) {
      // If order exists, update instead of adding
      return orderAdapter.updateOne(
        { id: order.id, changes: order },
        {
          ...state,
          loading: false,
          error: null
        }
      );
    } else {
      // If order doesn't exist, add new order
      return orderAdapter.addOne(order, {
        ...state,
        loading: false,
        error: null
      });
    }
  }),

  on(OrderActions.addOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Order
  on(OrderActions.updateOrder, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(OrderActions.updateOrderSuccess, (state, { order }) =>
    orderAdapter.updateOne(
      { id: order.id, changes: order },
      {
        ...state,
        loading: false,
        error: null
      }
    )
  ),

  on(OrderActions.updateOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete Order
  on(OrderActions.deleteOrder, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(OrderActions.deleteOrderSuccess, (state, { orderId }) =>
    orderAdapter.removeOne(orderId, {
      ...state,
      loading: false,
      error: null
    })
  ),

  on(OrderActions.deleteOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

// Export the adapter selectors for use in our custom selectors
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = orderAdapter.getSelectors();

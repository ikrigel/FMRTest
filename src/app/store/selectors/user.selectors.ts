import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState, selectAll, selectEntities } from '../reducers/user.reducer';
import { User, Order } from '../../models/user.model';
import { selectAllOrders } from './order.selectors';

// Feature selector
export const selectUserState = createFeatureSelector<UserState>('users');

// Get all users using the adapter selector
export const selectAllUsers = createSelector(
  selectUserState,
  selectAll
);

// Get user entities dictionary
export const selectUserEntities = createSelector(
  selectUserState,
  selectEntities
);

// Get selected user ID
export const selectSelectedUserId = createSelector(
  selectUserState,
  (state: UserState) => state.selectedUserId
);

// Get loading state
export const selectUsersLoading = createSelector(
  selectUserState,
  (state: UserState) => state.loading
);

// Get error state
export const selectUsersError = createSelector(
  selectUserState,
  (state: UserState) => state.error
);

/**
 * Selector that returns the selected user based on selectedUserId
 * Requirement #4a
 */
export const selectSelectedUser = createSelector(
  selectUserEntities,
  selectSelectedUserId,
  (entities, selectedUserId) => {
    return selectedUserId ? entities[selectedUserId] : null;
  }
);

/**
 * Selector that returns all orders of the selected user
 * Requirement #4b
 * Joins user and order data from separate state slices
 */
export const selectSelectedUserOrders = createSelector(
  selectSelectedUserId,
  selectAllOrders,
  (selectedUserId: number | null, allOrders: Order[]): Order[] => {
    if (!selectedUserId) {
      return [];
    }
    return allOrders.filter((order: Order) => order.userId === selectedUserId);
  }
);

/**
 * Selector that returns an object containing the selected user's name
 * and the total sum of all their orders
 * Requirement #4c
 * Joins user and order data from separate state slices
 */
export const selectSelectedUserSummary = createSelector(
  selectSelectedUser,
  selectSelectedUserOrders,
  (user: User | null | undefined, orders: Order[]) => {
    if (!user) {
      return {
        userName: '',
        totalOrdersAmount: 0
      };
    }

    const totalOrdersAmount = orders.reduce(
      (sum, order) => sum + order.total,
      0
    );

    return {
      userName: user.name,
      totalOrdersAmount
    };
  }
);

/**
 * Additional helpful selectors
 */

// Get total number of users
export const selectTotalUsers = createSelector(
  selectUserState,
  (state: UserState) => state.ids.length
);

// Check if a specific user exists
export const selectUserExists = (userId: number) =>
  createSelector(
    selectUserEntities,
    (entities) => !!entities[userId]
  );

// Get a specific user by ID
export const selectUserById = (userId: number) =>
  createSelector(
    selectUserEntities,
    (entities) => entities[userId]
  );

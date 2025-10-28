import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { User } from '../../models/user.model';
import * as UserActions from '../actions/user.actions';

// Define the User State interface extending EntityState
export interface UserState extends EntityState<User> {
  selectedUserId: number | null;
  loading: boolean;
  error: any;
}

// Create the Entity Adapter for User
export const userAdapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: (user: User) => user.id,
  sortComparer: false // We can add sorting if needed: (a, b) => a.name.localeCompare(b.name)
});

// Define the initial state using the adapter
export const initialState: UserState = userAdapter.getInitialState({
  selectedUserId: null,
  loading: false,
  error: null
});

// Create the reducer
export const userReducer = createReducer(
  initialState,

  // Load Users
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.loadUsersSuccess, (state, { users }) =>
    userAdapter.setAll(users, {
      ...state,
      loading: false,
      error: null
    })
  ),

  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Add User - Prevent duplicates by checking if user with same ID exists
  on(UserActions.addUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.addUserSuccess, (state, { user }) => {
    // Check if user already exists
    const existingUser = state.entities[user.id];

    if (existingUser) {
      // If user exists, update instead of adding
      return userAdapter.updateOne(
        { id: user.id, changes: user },
        {
          ...state,
          loading: false,
          error: null
        }
      );
    } else {
      // If user doesn't exist, add new user
      return userAdapter.addOne(user, {
        ...state,
        loading: false,
        error: null
      });
    }
  }),

  on(UserActions.addUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update User
  on(UserActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.updateUserSuccess, (state, { user }) =>
    userAdapter.updateOne(
      { id: user.id, changes: user },
      {
        ...state,
        loading: false,
        error: null
      }
    )
  ),

  on(UserActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete User
  on(UserActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.deleteUserSuccess, (state, { userId }) =>
    userAdapter.removeOne(userId, {
      ...state,
      loading: false,
      error: null,
      // Clear selected user if it was deleted
      selectedUserId: state.selectedUserId === userId ? null : state.selectedUserId
    })
  ),

  on(UserActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Select User
  on(UserActions.selectUser, (state, { userId }) => ({
    ...state,
    selectedUserId: userId
  })),

  // Load User Details
  on(UserActions.loadUserDetails, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.loadUserDetailsSuccess, (state, { user }) =>
    userAdapter.upsertOne(user, {
      ...state,
      loading: false,
      error: null
    })
  ),

  on(UserActions.loadUserDetailsFailure, (state, { error }) => ({
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
} = userAdapter.getSelectors();

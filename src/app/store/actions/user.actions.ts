import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

// Load Users Actions
export const loadUsers = createAction(
  '[User List] Load Users'
);

export const loadUsersSuccess = createAction(
  '[User API] Load Users Success',
  props<{ users: User[] }>()
);

export const loadUsersFailure = createAction(
  '[User API] Load Users Failure',
  props<{ error: any }>()
);

// Add User Actions
export const addUser = createAction(
  '[User] Add User',
  props<{ user: User }>()
);

export const addUserSuccess = createAction(
  '[User API] Add User Success',
  props<{ user: User }>()
);

export const addUserFailure = createAction(
  '[User API] Add User Failure',
  props<{ error: any }>()
);

// Update User Actions
export const updateUser = createAction(
  '[User] Update User',
  props<{ user: User }>()
);

export const updateUserSuccess = createAction(
  '[User API] Update User Success',
  props<{ user: User }>()
);

export const updateUserFailure = createAction(
  '[User API] Update User Failure',
  props<{ error: any }>()
);

// Delete User Actions
export const deleteUser = createAction(
  '[User] Delete User',
  props<{ userId: number }>()
);

export const deleteUserSuccess = createAction(
  '[User API] Delete User Success',
  props<{ userId: number }>()
);

export const deleteUserFailure = createAction(
  '[User API] Delete User Failure',
  props<{ error: any }>()
);

// Select User Actions
export const selectUser = createAction(
  '[User] Select User',
  props<{ userId: number | null }>()
);

// Load User Details (when user is selected)
export const loadUserDetails = createAction(
  '[User] Load User Details',
  props<{ userId: number }>()
);

export const loadUserDetailsSuccess = createAction(
  '[User API] Load User Details Success',
  props<{ user: User }>()
);

export const loadUserDetailsFailure = createAction(
  '[User API] Load User Details Failure',
  props<{ error: any }>()
);

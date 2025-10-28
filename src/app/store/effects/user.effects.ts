import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, mergeMap, switchMap, tap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { StorageService } from '../../services/storage.service';
import * as UserActions from '../actions/user.actions';
import * as OrderActions from '../actions/order.actions';

@Injectable()
export class UserEffects {

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private storageService: StorageService,
    private store: Store
  ) {}

  /**
   * Effect for loading all users
   * Uses exhaustMap to ignore new requests while one is in progress
   */
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      exhaustMap(() =>
        this.userService.getUsers().pipe(
          map(users => UserActions.loadUsersSuccess({ users })),
          catchError(error => of(UserActions.loadUsersFailure({ error })))
        )
      )
    )
  );

  /**
   * Effect to load orders when users are loaded successfully
   * This ensures both users and orders are in the store
   */
  loadOrdersAfterUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsersSuccess),
      map(() => OrderActions.loadOrders())
    )
  );

  /**
   * Effect to restore selected user from localStorage after users are loaded
   * This runs after users are successfully loaded
   */
  restoreSelectedUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsersSuccess),
      map(() => {
        const savedUserId = this.storageService.getSelectedUserId();
        if (savedUserId !== null) {
          return UserActions.selectUser({ userId: savedUserId });
        }
        return { type: 'NO_ACTION' };
      })
    )
  );

  /**
   * Effect for loading user details when a user is selected
   * Uses switchMap to cancel previous API call if user selection changes
   * This satisfies requirement #6
   */
  loadUserDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserDetails),
      switchMap(({ userId }) =>
        this.userService.getUserDetails(userId).pipe(
          map(user => {
            if (user) {
              return UserActions.loadUserDetailsSuccess({ user });
            } else {
              return UserActions.loadUserDetailsFailure({
                error: 'User not found'
              });
            }
          }),
          catchError(error => of(UserActions.loadUserDetailsFailure({ error })))
        )
      )
    )
  );

  /**
   * Effect to save selected user to localStorage
   * This runs whenever a user is selected/deselected
   */
  saveSelectedUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.selectUser),
      tap(({ userId }) => {
        this.storageService.saveSelectedUserId(userId);
      })
    ),
    { dispatch: false }
  );

  /**
   * Effect triggered when user is selected
   * Automatically loads user details
   */
  selectUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.selectUser),
      switchMap(({ userId }) => {
        if (userId !== null) {
          // When user is selected, load their details
          return of(UserActions.loadUserDetails({ userId }));
        } else {
          // If userId is null, do nothing
          return of({ type: 'NO_ACTION' });
        }
      })
    )
  );

  /**
   * Effect for adding a user
   * Uses mergeMap to allow multiple concurrent add operations
   */
  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.addUser),
      mergeMap(({ user }) =>
        this.userService.addUser(user).pipe(
          map(addedUser => UserActions.addUserSuccess({ user: addedUser })),
          catchError(error => of(UserActions.addUserFailure({ error })))
        )
      )
    )
  );

  /**
   * Effect for updating a user
   * Uses mergeMap to allow multiple concurrent update operations
   */
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      mergeMap(({ user }) =>
        this.userService.updateUser(user).pipe(
          map(updatedUser => UserActions.updateUserSuccess({ user: updatedUser })),
          catchError(error => of(UserActions.updateUserFailure({ error })))
        )
      )
    )
  );

  /**
   * Effect for deleting a user
   * Uses mergeMap to allow multiple concurrent delete operations
   */
  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      mergeMap(({ userId }) =>
        this.userService.deleteUser(userId).pipe(
          map(() => UserActions.deleteUserSuccess({ userId })),
          catchError(error => of(UserActions.deleteUserFailure({ error })))
        )
      )
    )
  );
}

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, mergeMap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import * as OrderActions from '../actions/order.actions';

@Injectable()
export class OrderEffects {

  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}

  /**
   * Effect for loading all orders
   * Uses exhaustMap to ignore new requests while one is in progress
   */
  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.loadOrders),
      exhaustMap(() =>
        this.userService.getOrders().pipe(
          map(orders => OrderActions.loadOrdersSuccess({ orders })),
          catchError(error => of(OrderActions.loadOrdersFailure({ error })))
        )
      )
    )
  );

  /**
   * Effect for adding an order
   * Uses mergeMap to allow multiple concurrent add operations
   */
  addOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.addOrder),
      mergeMap(({ order }) =>
        this.userService.addOrder(order).pipe(
          map(addedOrder => OrderActions.addOrderSuccess({ order: addedOrder })),
          catchError(error => of(OrderActions.addOrderFailure({ error })))
        )
      )
    )
  );

  /**
   * Effect for updating an order
   * Uses mergeMap to allow multiple concurrent update operations
   */
  updateOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.updateOrder),
      mergeMap(({ order }) =>
        this.userService.updateOrder(order).pipe(
          map(updatedOrder => OrderActions.updateOrderSuccess({ order: updatedOrder })),
          catchError(error => of(OrderActions.updateOrderFailure({ error })))
        )
      )
    )
  );

  /**
   * Effect for deleting an order
   * Uses mergeMap to allow multiple concurrent delete operations
   */
  deleteOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.deleteOrder),
      mergeMap(({ orderId }) =>
        this.userService.deleteOrder(orderId).pipe(
          map(() => OrderActions.deleteOrderSuccess({ orderId })),
          catchError(error => of(OrderActions.deleteOrderFailure({ error })))
        )
      )
    )
  );
}

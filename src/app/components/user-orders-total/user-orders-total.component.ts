import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectSelectedUserSummary } from '../../store/selectors/user.selectors';

@Component({
  selector: 'app-user-orders-total',
  templateUrl: './user-orders-total.component.html',
  styleUrls: ['./user-orders-total.component.css']
})
export class UserOrdersTotalComponent {
  totalOrdersAmount$: Observable<number>;

  constructor(private store: Store) {
    // Listen to the selector and extract only the totalOrdersAmount
    // Requirement #5b - separate component for displaying orders total
    this.totalOrdersAmount$ = this.store.select(selectSelectedUserSummary).pipe(
      map(summary => summary.totalOrdersAmount)
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectAllUsers, selectSelectedUserSummary, selectSelectedUserId } from '../../store/selectors/user.selectors';
import { loadUsers, selectUser } from '../../store/actions/user.actions';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit {
  users$: Observable<User[]>;
  userSummary$: Observable<{ userName: string; totalOrdersAmount: number }>;
  selectedUserId$: Observable<number | null>;

  constructor(private store: Store) {
    this.users$ = this.store.select(selectAllUsers);
    this.userSummary$ = this.store.select(selectSelectedUserSummary);
    this.selectedUserId$ = this.store.select(selectSelectedUserId);
  }

  ngOnInit(): void {
    // Load users when component initializes (Requirement #1)
    this.store.dispatch(loadUsers());
    // Restore selected user from localStorage if present
    const storedId = localStorage.getItem('selectedUserId');
    if (storedId) {
      const userId = parseInt(storedId, 10);
      if (!isNaN(userId)) {
        this.store.dispatch(selectUser({ userId }));
      }
    }
    // Subscribe to selection changes and persist
    this.selectedUserId$.subscribe(userId => {
      if (userId !== null && userId !== undefined) {
        localStorage.setItem('selectedUserId', userId.toString());
      } else {
        localStorage.removeItem('selectedUserId');
      }
    });
  }

  /**
   * Change the selected user in the store
   * Requirement #5a
   */
  onSelectUser(userId: number): void {
    this.store.dispatch(selectUser({ userId }));
  }

  /**
   * Clear user selection
   */
  onClearSelection(): void {
    this.store.dispatch(selectUser({ userId: null }));
  }
}

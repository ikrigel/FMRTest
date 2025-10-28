import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectSelectedUserSummary } from '../../store/selectors/user.selectors';

@Component({
  selector: 'app-user-name',
  templateUrl: './user-name.component.html',
  styleUrls: ['./user-name.component.css']
})
export class UserNameComponent {
  userName$: Observable<string>;

  constructor(private store: Store) {
    // Listen to the selector and extract only the userName
    // Requirement #5b - separate component for displaying user name
    this.userName$ = this.store.select(selectSelectedUserSummary).pipe(
      map(summary => summary.userName)
    );
  }
}

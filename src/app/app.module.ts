import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { UserOrdersComponent } from './components/user-orders/user-orders.component';
import { UserNameComponent } from './components/user-name/user-name.component';
import { UserOrdersTotalComponent } from './components/user-orders-total/user-orders-total.component';

import { userReducer } from './store/reducers/user.reducer';
import { orderReducer } from './store/reducers/order.reducer';
import { UserEffects } from './store/effects/user.effects';
import { OrderEffects } from './store/effects/order.effects';
import { UserService } from './services/user.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [
    AppComponent,
    UserOrdersComponent,
    UserNameComponent,
    UserOrdersTotalComponent
  ],
  imports: [
    BrowserModule,
    // Angular Material Modules
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatToolbarModule,
    MatDividerModule,
    // Register the NGRX Store with both user and order reducers
    // This matches the AppState interface structure
    StoreModule.forRoot({
      users: userReducer,
      orders: orderReducer
    }),
    // Register the effects for both users and orders
    EffectsModule.forRoot([UserEffects, OrderEffects]),
    // Redux DevTools (disable in production)
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: false // Restrict extension to log-only mode
    })
  ],
  providers: [UserService, provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }

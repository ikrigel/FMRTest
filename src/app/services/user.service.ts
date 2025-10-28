import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { User, Order } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private mockUsers: User[] = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' },
    { id: 4, name: 'Alice Williams' }
  ];

  private mockOrders: Order[] = [
    // John Doe's orders
    { id: 101, userId: 1, total: 1200 },
    { id: 102, userId: 1, total: 25 },
    { id: 103, userId: 1, total: 75 },
    // Jane Smith's orders
    { id: 201, userId: 2, total: 350 },
    { id: 202, userId: 2, total: 150 },
    // Bob Johnson's orders
    { id: 301, userId: 3, total: 450 },
    { id: 302, userId: 3, total: 300 },
    { id: 303, userId: 3, total: 80 },
    // Alice Williams's orders
    { id: 401, userId: 4, total: 600 }
  ];

  constructor() { }

  /**
   * Get all users from the server (simulated with mock data)
   */
  getUsers(): Observable<User[]> {
    // Simulate API delay
    return of(this.mockUsers).pipe(delay(500));
  }

  /**
   * Get all orders from the server (simulated with mock data)
   */
  getOrders(): Observable<Order[]> {
    // Simulate API delay
    return of(this.mockOrders).pipe(delay(500));
  }

  /**
   * Get detailed information for a specific user by ID
   * Used when a user is selected to fetch additional details
   */
  getUserDetails(userId: number): Observable<User | undefined> {
    const user = this.mockUsers.find(u => u.id === userId);
    // Simulate API delay
    return of(user).pipe(delay(800));
  }

  /**
   * Get orders for a specific user
   */
  getUserOrders(userId: number): Observable<Order[]> {
    const orders = this.mockOrders.filter(o => o.userId === userId);
    return of(orders).pipe(delay(500));
  }

  /**
   * Add a new user (simulated)
   */
  addUser(user: User): Observable<User> {
    return of(user).pipe(delay(300));
  }

  /**
   * Update an existing user (simulated)
   */
  updateUser(user: User): Observable<User> {
    return of(user).pipe(delay(300));
  }

  /**
   * Delete a user (simulated)
   */
  deleteUser(userId: number): Observable<void> {
    return of(void 0).pipe(delay(300));
  }

  /**
   * Add a new order (simulated)
   */
  addOrder(order: Order): Observable<Order> {
    return of(order).pipe(delay(300));
  }

  /**
   * Update an existing order (simulated)
   */
  updateOrder(order: Order): Observable<Order> {
    return of(order).pipe(delay(300));
  }

  /**
   * Delete an order (simulated)
   */
  deleteOrder(orderId: number): Observable<void> {
    return of(void 0).pipe(delay(300));
  }
}

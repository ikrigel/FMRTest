import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly SELECTED_USER_KEY = 'selectedUserId';

  constructor() { }

  /**
   * Save the selected user ID to localStorage
   */
  saveSelectedUserId(userId: number | null): void {
    if (userId !== null) {
      localStorage.setItem(this.SELECTED_USER_KEY, userId.toString());
    } else {
      localStorage.removeItem(this.SELECTED_USER_KEY);
    }
  }

  /**
   * Get the selected user ID from localStorage
   */
  getSelectedUserId(): number | null {
    const userId = localStorage.getItem(this.SELECTED_USER_KEY);
    return userId ? parseInt(userId, 10) : null;
  }

  /**
   * Clear the selected user ID from localStorage
   */
  clearSelectedUserId(): void {
    localStorage.removeItem(this.SELECTED_USER_KEY);
  }
}

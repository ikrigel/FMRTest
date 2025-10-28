# סיכום מימוש - NGRX User Management

## מבוא
הפרויקט מממש אפליקציית ניהול משתמשים והזמנות באמצעות NGRX. המימוש כולל Entity Adapter, Effects, Selectors וארכיטקטורת state management מלאה.

בנוסף, האפליקציה משתמשת ב-Angular Material לעיצוב ה-UI ומתמכת ב-localStorage לשמירת המצב בין טעינות.

***

## דרישות המבחן

### 1. טעינת משתמשים מ-API
הקומפוננטה `UserOrdersComponent` טוענת את רשימת המשתמשים בעת אתחול:

```typescript
ngOnInit(): void {
  this.store.dispatch(loadUsers());
}
```

**זרימת המידע:**
1. הקומפוננטה שולחת את ה-action `loadUsers()`
2. ה-Effect `loadUsers$` מבצע קריאה ל-`UserService.getUsers()`
3. בהצלחה, נשלח `loadUsersSuccess` עם המשתמשים
4. ה-Reducer מעדכן את ה-Store

השימוש ב-Effects מפריד בין הקומפוננטה ללוגיקה האסינכרונית  

***

### 2. Entity Adapter
ה-State של המשתמשים מנוהל באמצעות `createEntityAdapter`:

```typescript
export const userAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id,
  sortComparer: false
});
```

ה-Adapter מספק:
- אחסון אופטימלי עם מבנה dictionary + array
- פעולות מובנות: `addOne`, `updateOne`, `removeOne`, `setAll`
- Selectors אוטומטיים: `selectAll`, `selectEntities`, `selectIds`

ה-State מורחב עם שדות נוספים:
```typescript
interface UserState extends EntityState<User> {
  selectedUserId: number | null;
  loading: boolean;
  error: string | null;
}
```  

***

### 3. פעולות CRUD
המימוש כולל את כל הפעולות הבסיסיות:

**הוספת משתמש** (עם בדיקת כפילויות):
```typescript
on(UserActions.addUserSuccess, (state, { user }) => {
  const existingUser = state.entities[user.id];

  if (existingUser) {
    return userAdapter.updateOne(
      { id: user.id, changes: user },
      { ...state, loading: false, error: null }
    );
  }
  return userAdapter.addOne(user, { ...state, loading: false, error: null });
});
```

**עדכון משתמש:**
```typescript
on(UserActions.updateUserSuccess, (state, { user }) =>
  userAdapter.updateOne(
    { id: user.id, changes: user },
    { ...state, loading: false }
  )
);
```

הלוגיקה מונעת כפילויות - אם המשתמש קיים, הוא מתעדכן במקום להיווסף מחדש  

***

### 4. Selectors
הפרויקט משתמש ב-Selectors ממוימזים לקריאה יעילה מה-Store:

**בחירת משתמש:**
```typescript
export const selectSelectedUser = createSelector(
  selectUserEntities,
  selectSelectedUserId,
  (entities, id) => id ? entities[id] : null
);
```

**חישוב סכום ההזמנות:**
```typescript
export const selectSelectedUserSummary = createSelector(
  selectSelectedUser,
  (user) => {
    if (!user) return { userName: '', totalOrdersAmount: 0 };

    const total = user.orders.reduce((sum, order) => sum + order.amount, 0);
    return { userName: user.name, totalOrdersAmount: total };
  }
);
```

ה-Selectors משתמשים ב-memoization - התוצאה נשמרת בזיכרון ומחושבת מחדש רק כאשר הערכים הנכנסים משתנים

***

### 5. ארכיטקטורת הקומפוננטות

**UserOrdersComponent** - הקומפוננטה הראשית:
- מציגה רשימת כפתורי משתמשים
- מטפלת בבחירת משתמש באמצעות dispatch של action
- משתמשת ב-Angular Material לעיצוב (mat-card, mat-button)

```typescript
onSelectUser(userId: number): void {
  this.store.dispatch(selectUser({ userId }));
}
```

**פיצול לקומפוננטות משנה:**
- `UserNameComponent` - מציג את שם המשתמש הנבחר
- `UserOrdersTotalComponent` - מציג את סכום ההזמנות

כל קומפוננטה קוראת מה-Store באמצעות Selector ייעודי, מה שמאפשר עדכונים אוטומטיים כאשר ה-State משתנה

***

### 6. ניהול קריאות אסינכרוניות עם switchMap
ה-Effects משתמשים ב-`switchMap` לניהול קריאות API:

```typescript
loadUsers$ = createEffect(() =>
  this.actions$.pipe(
    ofType(UserActions.loadUsers),
    switchMap(() =>
      this.userService.getUsers().pipe(
        map(users => UserActions.loadUsersSuccess({ users })),
        catchError(error => of(UserActions.loadUsersFailure({ error })))
      )
    )
  )
);
```

`switchMap` מבטל קריאות קודמות אם נשלח action חדש לפני שהקודם הסתיים. זה מונע:
- Race conditions (מספר תשובות שחוזרות בסדר לא צפוי)
- עדכונים מיותרים של ה-Store
- בזבוז רוחב פס

***

## מבנה הקוד

```
src/app/
├── models/              # הגדרות ממשקים (User, Order)
├── services/            # שירותים (UserService)
├── store/
│   ├── actions/         # הגדרות Actions
│   ├── reducers/        # User & Order Reducers
│   ├── selectors/       # Selectors ממוימזים
│   └── effects/         # Effects לטיפול ב-API
└── components/
    ├── user-orders/     # קומפוננטה ראשית
    ├── user-name/       # תצוגת שם משתמש
    └── user-orders-total/  # תצוגת סכום הזמנות
```

***

## טכנולוגיות מרכזיות

**NGRX:**
- Store מרכזי עם ניהול state חד-כיווני
- Entity Adapter לניהול collections
- Effects לפעולות אסינכרוניות
- Selectors עם memoization

**RxJS Operators:**
- `switchMap` - ביטול Observable קודם
- `map` - טרנספורמציה של נתונים
- `catchError` - טיפול בשגיאות

**UI:**
- Angular Material (Indigo-Pink theme)
- Responsive design
- כפתורים ממותגים עם מצבים (selected/unselected)  

***

## הרצה מקומית

```bash
# התקנת תלויות
npm install

# הרצת שרת פיתוח
npm start
```

האפליקציה תעלה על http://localhost:4200

לפתיחת Redux DevTools: לחץ F12 ובחר בכרטיסייה Redux

***

## פיצ'רים נוספים

**שמירת מצב:**
- המשתמש הנבחר נשמר ב-localStorage
- בעת טעינה מחדש, הבחירה מתאפסת אוטומטית

**עיצוב:**
- Material Design עם ערכת צבעים Indigo-Pink
- רקע עם גרדיאנט סגול
- אנימציות מובנות (ripple effects)

**נגישות:**
- כפתורים עם הבדלה ברורה (צבע ושוליים)
- תמיכה בניווט מקלדת
- תמיכה ב-screen readers דרך Angular Material

***

## סיכום

הפרויקט מממש את כל דרישות המבחן:

1. ✅ טעינת נתונים מ-API באמצעות Effects
2. ✅ ניהול state עם Entity Adapter
3. ✅ פעולות CRUD מלאות (הוספה, עדכון, מחיקה) עם מניעת כפילויות
4. ✅ Selectors ממוימזים לחישובים מורכבים
5. ✅ פיצול קומפוננטות לתצוגות נפרדות
6. ✅ שימוש ב-switchMap למניעת race conditions

בנוסף לדרישות, נוסף:
- Angular Material UI
- שמירת state ב-localStorage
- פריסה ל-GitHub Pages ו-Vercel

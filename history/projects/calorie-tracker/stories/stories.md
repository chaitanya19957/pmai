# Stories: Calorie Tracking App

Generated from PRD on 2026-01-11

---

## Epic 1: User Authentication

### Story 1.1: User Registration

User story:
As a new user, I want to create an account so that my food logs are saved and synced.

#### Acceptance Criteria
- [ ] User can register with email and password
- [ ] Email validation (format check)
- [ ] Password requirements enforced (min 8 chars)
- [ ] Account created in backend, user logged in automatically
- [ ] Error states shown for invalid input

#### Dependencies
- Backend auth service
- User database schema

#### Analytics
- Events: `user_registered`
- Properties: `registration_method`, `timestamp`

---

### Story 1.2: User Login

User story:
As a returning user, I want to log in so that I can access my food history.

#### Acceptance Criteria
- [ ] User can log in with email and password
- [ ] "Forgot password" link visible
- [ ] Error message for invalid credentials
- [ ] Session persisted on device

#### Dependencies
- Story 1.1 (User Registration)

#### Analytics
- Events: `user_logged_in`
- Properties: `login_method`, `timestamp`

---

### Story 1.3: User Logout

User story:
As a logged-in user, I want to log out so that I can secure my account on shared devices.

#### Acceptance Criteria
- [ ] Logout option in settings/profile
- [ ] Session cleared on logout
- [ ] Redirect to login screen

#### Dependencies
- Story 1.2 (User Login)

#### Analytics
- Events: `user_logged_out`
- Properties: `timestamp`

---

## Epic 2: Daily Goal Setting

### Story 2.1: Set Daily Calorie Goal

User story:
As a user, I want to set my daily calorie goal so that I can track progress against it.

#### Acceptance Criteria
- [ ] Input field for daily calorie target (numeric)
- [ ] Goal saved to user profile
- [ ] Goal displayed on main dashboard
- [ ] Default value suggested (2000 kcal) if user skips

#### Dependencies
- Story 1.1 (User Registration)

#### Analytics
- Events: `calorie_goal_set`
- Properties: `goal_value`, `is_default`, `timestamp`

---

### Story 2.2: Edit Daily Calorie Goal

User story:
As a user, I want to change my calorie goal so that I can adjust as my needs change.

#### Acceptance Criteria
- [ ] Edit option accessible from settings or dashboard
- [ ] Previous goal shown as reference
- [ ] New goal saved immediately

#### Dependencies
- Story 2.1 (Set Daily Calorie Goal)

#### Analytics
- Events: `calorie_goal_updated`
- Properties: `old_value`, `new_value`, `timestamp`

---

## Epic 3: Food Logging (Core)

### Story 3.1: Search for Food

User story:
As a user, I want to search for foods so that I can quickly find what I ate.

#### Acceptance Criteria
- [ ] Search bar on main screen
- [ ] Results appear as user types (debounced)
- [ ] Results show food name + calories per serving
- [ ] Handles partial matches and common typos
- [ ] Empty state when no results found

#### Dependencies
- Food database API integration

#### Analytics
- Events: `food_search_performed`
- Properties: `query`, `results_count`, `timestamp`

---

### Story 3.2: Add Food from Search Results

User story:
As a user, I want to add a food item to my daily log so that my calories are tracked.

#### Acceptance Criteria
- [ ] Tap on search result to add
- [ ] Serving size selector (with default)
- [ ] Calories calculated based on serving
- [ ] Food added to today's log
- [ ] Confirmation feedback (toast/animation)

#### Dependencies
- Story 3.1 (Search for Food)

#### Analytics
- Events: `food_logged`
- Properties: `food_id`, `food_name`, `calories`, `serving_size`, `source: search`, `timestamp`

---

### Story 3.3: Manual Food Entry

User story:
As a user, I want to manually enter a custom food so that I can log items not in the database.

#### Acceptance Criteria
- [ ] "Add custom food" option in search
- [ ] Fields: food name, calories, serving size (optional)
- [ ] Custom food saved to personal list
- [ ] Food added to today's log

#### Dependencies
- Story 3.1 (Search for Food)

#### Analytics
- Events: `food_logged`
- Properties: `food_name`, `calories`, `serving_size`, `source: manual`, `timestamp`

---

### Story 3.4: View Daily Food Log

User story:
As a user, I want to see my food log for today so that I know what I've eaten.

#### Acceptance Criteria
- [ ] List of logged foods for current day
- [ ] Each item shows name, calories, serving
- [ ] Running total at top/bottom
- [ ] Progress bar toward daily goal
- [ ] Empty state for no entries

#### Dependencies
- Story 3.2 (Add Food from Search)

#### Analytics
- Events: `daily_log_viewed`
- Properties: `date`, `items_count`, `total_calories`, `timestamp`

---

### Story 3.5: Delete Food Entry

User story:
As a user, I want to remove a logged food so that I can fix mistakes.

#### Acceptance Criteria
- [ ] Swipe-to-delete or delete button on each item
- [ ] Confirmation prompt (optional, can be setting)
- [ ] Running total updates immediately

#### Dependencies
- Story 3.4 (View Daily Food Log)

#### Analytics
- Events: `food_deleted`
- Properties: `food_id`, `calories_removed`, `timestamp`

---

### Story 3.6: Edit Food Entry

User story:
As a user, I want to edit a logged food so that I can correct the serving size.

#### Acceptance Criteria
- [ ] Tap on logged item to edit
- [ ] Can change serving size
- [ ] Calories recalculated
- [ ] Log updated

#### Dependencies
- Story 3.4 (View Daily Food Log)

#### Analytics
- Events: `food_edited`
- Properties: `food_id`, `old_calories`, `new_calories`, `timestamp`

---

## Epic 4: Progress Visualization (P1)

### Story 4.1: Weekly Summary View

User story:
As a user, I want to see my weekly calorie summary so that I can track my overall progress.

#### Acceptance Criteria
- [ ] View accessible from main navigation
- [ ] Shows 7-day view (current week)
- [ ] Daily totals displayed
- [ ] Average calories per day calculated
- [ ] Days over/under goal highlighted

#### Dependencies
- Story 3.4 (View Daily Food Log)

#### Analytics
- Events: `weekly_summary_viewed`
- Properties: `week_start_date`, `avg_calories`, `timestamp`

---

### Story 4.2: Calorie Trend Chart

User story:
As a user, I want to see a chart of my calories over time so that I can visualize trends.

#### Acceptance Criteria
- [ ] Line or bar chart showing daily calories
- [ ] Goal line shown for reference
- [ ] Timeframe selector (7 days, 30 days)
- [ ] Tap on data point shows details

#### Dependencies
- Story 4.1 (Weekly Summary View)

#### Analytics
- Events: `chart_viewed`
- Properties: `timeframe`, `timestamp`

---

## Epic 5: Quick-Add Features (P1)

### Story 5.1: Recent Foods Quick-Add

User story:
As a user, I want to quickly add recently logged foods so that repeat meals are faster.

#### Acceptance Criteria
- [ ] "Recent" section on add food screen
- [ ] Shows last 10 unique foods
- [ ] One-tap to add with same serving
- [ ] Option to change serving before adding

#### Dependencies
- Story 3.2 (Add Food from Search)

#### Analytics
- Events: `food_logged`
- Properties: `food_id`, `source: recent`, `timestamp`

---

### Story 5.2: Frequent Foods Quick-Add

User story:
As a user, I want to see my most frequently logged foods so that common items are easy to find.

#### Acceptance Criteria
- [ ] "Frequent" section on add food screen
- [ ] Shows top 10 foods by log count
- [ ] One-tap to add
- [ ] Updates automatically based on usage

#### Dependencies
- Story 3.2 (Add Food from Search)

#### Analytics
- Events: `food_logged`
- Properties: `food_id`, `source: frequent`, `timestamp`

---

### Story 5.3: Barcode Scanning

User story:
As a user, I want to scan a barcode so that I can log packaged foods instantly.

#### Acceptance Criteria
- [ ] Camera access for barcode scanning
- [ ] Barcode lookup returns food data
- [ ] If found: show food details, allow add
- [ ] If not found: prompt manual entry
- [ ] Works offline with cached recent scans

#### Dependencies
- Barcode API integration
- Story 3.2 (Add Food from Search)

#### Analytics
- Events: `barcode_scanned`
- Properties: `barcode`, `found: boolean`, `timestamp`
- Events: `food_logged`
- Properties: `food_id`, `source: barcode`, `timestamp`

---

## Epic 6: Data Management (P2)

### Story 6.1: Export Data to CSV

User story:
As a user, I want to export my food log so that I can analyze it externally or share with a nutritionist.

#### Acceptance Criteria
- [ ] Export option in settings
- [ ] Date range selector
- [ ] CSV format with columns: date, food, calories, serving
- [ ] Share sheet for export

#### Dependencies
- Story 3.4 (View Daily Food Log)

#### Analytics
- Events: `data_exported`
- Properties: `format`, `date_range`, `rows_count`, `timestamp`

---

## Story Priority Summary

| Priority | Stories | Count |
|----------|---------|-------|
| P0 | 1.1, 1.2, 1.3, 2.1, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6 | 10 |
| P1 | 2.2, 4.1, 4.2, 5.1, 5.2, 5.3 | 6 |
| P2 | 6.1 | 1 |

---

## Open Questions for Stories
- Story 5.3 (Barcode): Which barcode API? Offline mode scope?
- Story 1.x (Auth): Social login (Google/Apple) needed for v1?
- All stories: Specific platform UI patterns (iOS vs Android)?

---
*Generated from PRD on 2026-01-11*

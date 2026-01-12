# PRD: Calorie Tracking App

## Problem
Users struggle to track daily calorie intake consistently. Manual logging is tedious, food databases are incomplete, and existing apps are bloated with features. This leads to abandoned health goals and poor dietary awareness.

## Users
| Segment | Description | Priority |
|---------|-------------|----------|
| Weight managers | People actively trying to lose or maintain weight | Primary |
| Fitness enthusiasts | Users tracking macros alongside workouts | Secondary |
| Health-conscious beginners | New to calorie counting, need simple UX | Secondary |

## Goals
- Enable quick food logging (<10 seconds per entry)
- Provide accurate calorie data for common foods
- Show daily/weekly progress toward user-defined goals
- Reduce logging abandonment through low-friction UX

## Non-goals
- Meal planning or recipe generation (v1)
- Social features or community (v1)
- Integration with fitness devices (v1)
- Premium/paid features (v1)

## Requirements

### Must Have (P0)
- Food search with calorie data
- Manual entry for custom foods
- Daily calorie goal setting
- Daily log view with running total
- User accounts with data sync

### Should Have (P1)
- Barcode scanning for packaged foods
- Recent/frequent foods quick-add
- Weekly summary view
- Basic charts (calories over time)

### Nice to Have (P2)
- Macro breakdown (protein, carbs, fat)
- Meal categories (breakfast, lunch, dinner, snacks)
- Export data (CSV)

## UX Notes
- Mobile-first; one-handed operation
- Large tap targets for food items
- Search should be fast and forgiving (typos, partial matches)
- Prominent "Add Food" button on main screen
- Minimal onboarding (goal setting only)

## Metrics / Success Criteria
| Metric | Baseline | Target |
|--------|----------|--------|
| Time to log a food item | N/A | <10 seconds |
| Daily active users (DAU) | 0 | TBD after launch |
| 7-day retention | N/A | >40% |
| Foods logged per user per day | N/A | >3 |

## Risks / Open Questions

### Risks
- **Competitive market**: Many established players (MyFitnessPal, Lose It!)
- **Food database quality**: Accuracy and coverage are critical for trust
- **User fatigue**: Logging every meal is a high-friction habit

### Open Questions
| Question | Owner | Status |
|----------|-------|--------|
| Which platforms for v1? (iOS only? Both?) | Product | Open |
| Food database source? (USDA, Nutritionix, custom?) | Engineering | Open |
| Barcode API provider? | Engineering | Open |
| Monetization strategy for v2+? | Business | Open |

## Assumptions
- Mobile app (iOS and/or Android) is the primary interface
- Cloud sync required for user data
- Third-party food database API will be used (not building our own)
- Free tier for v1; monetization deferred

## Rollout Plan
1. **Alpha**: Internal testing with team (2-week cycle)
2. **Beta**: Limited invite-only release (100 users)
3. **Launch**: Public release on app store(s)

---
*Generated from discovery notes on 2026-01-11*

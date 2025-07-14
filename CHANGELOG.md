# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [v1.2.1] - 2025-07-14

### Added
- Global notification system with NotificationContext and NotificationProvider
- NotificationToast component for displaying notifications in bottom-left corner
- Auto-dismiss functionality for notifications (4 seconds default)
- Responsive notification display (hidden on mobile, shown on md+ screens)
- Close button for manual notification dismissal
- Notification animations with slide-in effects
- Success notifications for beer additions with tavern theme styling
- Notification system integration in layout with proper provider setup

### Changed
- AddBeerForm now uses global notification system instead of local success state
- Success notifications appear in corner for desktop, remain in form for mobile
- Updated notification styling to match tavern theme with proper colors and effects
- Enhanced user experience with non-intrusive notification placement

### Fixed
- Notifications now properly dismiss automatically after specified duration
- Mobile users still see success messages in form for better UX
- Notification animations work smoothly across different screen sizes
- Proper z-index handling for notifications to appear above other content

## [v1.2.0] - 2025-07-10

### Added
- Leaderboard system for all tavern patrons
- LeaderboardService for fetching and ranking user data
- useLeaderboard hook for leaderboard state management
- Leaderboard component with scrollable table design
- CircleLeaderboard component with interactive circle visualization
- Time-based filters for leaderboard (Today, Week, Month)
- Real-time user ranking based on beers consumed in selected time period
- Visual rank indicators (🥇🥈🥉) for top 3 positions
- User status badges (Legend, Regular, Novice) based on beer consumption
- Highlighted current user row in leaderboard
- Refresh functionality for leaderboard data
- Leaderboard integration in Dashboard layout with dual view (table + circles)
- Firestore security rules for leaderboard data access
- Firestore indexes for efficient beer queries by user and date
- Enhanced logging for leaderboard debugging

### Fixed
- Leaderboard now properly displays beers from all users, not just current user
- Added proper Firestore security rules to allow reading all beers for leaderboard
- Added required Firestore indexes for complex queries with userId and createdAt
- Enhanced error handling and logging in LeaderboardService
- Optimized leaderboard performance with single query approach
- Time filters now work instantly without additional database queries
- Added automatic leaderboard refresh when users add new beers
- Improved beer collection display with scrollable list showing only 5 beers initially

## [v1.1.0] - 2025-07-10

### Added 
- Achievement components (AchievementCard, AchievementList)
- useAchievements hook for achievement management
- Achievement integration in Dashboard
- User role system with 'user', 'admin', 'owner', 'moderator' roles
- Role-based achievement unlocking (Tavern Owner only for 'owner' role)
- User role management script (scripts/manage-user-roles.js)
- Default 'user' role assignment for new users
- Role field in user database documents
- Real-time achievement progress tracking with detailed statistics
- Enhanced BeerService with comprehensive user statistics calculation
- Progress-based achievement unlocking with accurate calculations
- Detailed progress display for all achievement types (beers, types, alcohol, quantity, streaks)
- Automatic achievement checking when adding new beers
- Improved progress text display with unit-specific formatting

### Fixed
- Dropdown select elements now properly display with correct background and text colors in dark mode

### Changed
- AddBeerForm and BeerList now have consistent styling and equal height containers in the dashboard layout
- Beer types are now loaded dynamically from the database instead of using hardcoded constants
- Added BeerStyleService and useBeerStyles hook for managing beer styles from Firebase

## [v1.0.1] - 2025-07-10

### Added
- Achievement system planning
- Dark theme implementation
- Responsive header design
- Tavern-themed color palette
- Theme toggle functionality
- Loading states for profile pictures
- Auth components folder structure
- Beer components folder structure
- UI components folder structure
- Services folder structure with beer and achievement services
- Types folder with comprehensive TypeScript interfaces
- Constants folder with app-wide constants and achievement definitions

### Changed
- Updated color scheme for tavern theme
- Improved mobile layout organization
- Enhanced user interface with tavern styling
- Restructured auth components into dedicated folder
- Restructured beer components into dedicated folder
- Restructured UI components into dedicated folder
- Updated BeerStats component to use theme-aware CSS classes
- Updated AddBeerForm component to use theme-aware CSS classes
- Added theme-aware message styles for error and success states
- Enhanced beer-input styles with glassmorphism effect and theme adaptation
- Improved BeerStats calculations for more accurate alcohol and time-based metrics
- Updated AddBeerForm to use centralized beer types from constants
- Refactored useBeers hook to use beerService for addBeer operations

### Fixed
- Profile picture loading issues
- Mobile layout alignment problems
- Hover effects on buttons
- Text color consistency in dark theme

## [v1.0.0] - 2025-07-09

### Added
- Initial beer tracking application
- Firebase authentication system
- Tavern theme implementation
- Beer statistics tracking
- User profile management
- Responsive design

### Changed
- Initial release with core functionality

### Fixed
- Initial stable release 
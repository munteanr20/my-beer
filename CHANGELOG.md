# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [v1.2.3] - 2025-01-27

### Added
- Dynamic hero section with animated background elements and floating beer icons
- Interactive central beer icon with hover effects and orbiting stat elements
- Animated gradient text effect for main dashboard heading
- Theme-aware hero section styling with proper light/dark mode support
- Enhanced dashboard stats with 7 comprehensive metrics instead of 4
- Modern card design with gradient glow effects and hover animations
- Feature highlight pills showing Track Stats, Achievements, and Leaderboard
- Quick stats preview with infinity and goal symbols
- Live Dashboard status badge with pulsing indicator
- Theme-specific CSS classes for hero badges and feature pills

### Changed
- Dashboard hero section completely redesigned with modern, dynamic layout
- Removed redundant user name from dashboard (now only in navbar)
- Dashboard welcome message changed from personal greeting to feature-focused
- BeerStats dashboard variant enhanced with 6 main stats and 3 additional quick info cards
- Removed unnecessary profile redirect link from dashboard stats
- Dashboard layout improved with better spacing and visual hierarchy
- Hero section background now uses tavern-glass class for consistent theming
- All text elements now use theme-aware classes (text-tavern-primary, etc.)
- Dashboard stats cards now have hover effects and modern styling

### Fixed
- Redundancy between navbar greeting and dashboard welcome message
- Dashboard stats now self-contained without unnecessary navigation
- Theme consistency across light and dark modes for hero section
- Proper contrast ratios and readability in both themes
- Glassmorphism effects that adapt properly to theme changes
- Animated elements that work consistently in both themes

### Improved
- Dashboard user experience with cleaner, more focused design
- Visual hierarchy and information architecture
- Theme switching experience with proper color adaptation
- Code maintainability with reusable theme-aware CSS classes
- Animation performance and smooth transitions
- Mobile responsiveness for all new dashboard elements

## [v1.2.2] - 2025-07-20

### Added
- Reusable Footer component for consistent footer across all pages
- Real achievement data integration in profile page overview tab
- Dynamic "Next Goal" card showing closest achievement to unlock
- Achievement progress tracking with real-time data
- Recent achievements display showing up to 3 most recent unlocks
- User creation date logic with "Prehistorical Era" for early users
- Firebase timestamp conversion for accurate user creation dates
- Profile page tab navigation with minimalist text-only design
- Enhanced profile header with glassmorphism and animations
- Real-time achievement progress bars with percentage completion
- Loading states for achievement data with skeleton animations

### Changed
- Profile page overview tab now uses real achievement data instead of static content
- Footer extracted to reusable component for maintainability and consistency
- Profile page tabs redesigned with elegant underline animations
- "Next Goal" card now shows achievement with highest progress percentage
- User creation date display now shows actual dates or "Prehistorical Era"
- Achievement progress cards display real unlocked/total counts
- Profile page layout improved with better spacing and animations

### Fixed
- Firebase timestamp conversion for proper date display
- Achievement data loading and error handling
- Profile page date logic with robust error handling
- Footer component reusability across all pages
- Achievement progress calculation accuracy
- User creation date fallback handling

### Improved
- Profile page user experience with real-time data
- Code maintainability with reusable footer component
- Achievement system integration and display
- Date handling robustness with multiple format support
- Loading states and error handling throughout profile page
- Visual consistency with tavern theme across all components

## [v1.2.1] - 2025-01-27

### Added
- Multiple beer addition functionality in AddBeerForm with quantity field
- "Add 1 more" button in BeerList for quick beer duplication
- Horizontal scroll support for leaderboard table on mobile devices
- Status indicators with colored dots instead of text badges in leaderboard
- Status legend in leaderboard showing color meanings
- Mobile-optimized leaderboard design with responsive layout
- Mobile-optimized circle leaderboard with smaller radius and touch-friendly elements
- Enhanced mobile responsiveness for all leaderboard components

### Changed
- Leaderboard table now uses horizontal scroll for better mobile experience
- Status badges replaced with compact colored dots in leaderboard table
- Beer list "Add 1 more" button now positioned below beer information on mobile
- Leaderboard rank colors updated to use tavern theme colors (gold, copper, cream)
- Mobile layout improvements for leaderboard headers and controls
- Circle leaderboard radius reduced on mobile for better fit
- Time filter buttons made full-width on mobile for better touch targets
- Footer information layout improved for mobile devices

### Fixed
- Long user names now display properly in leaderboard with horizontal scroll
- Status badges no longer overflow or get cut off in leaderboard table
- Mobile touch targets improved for better accessibility
- Leaderboard table column widths optimized for better content display
- Circle leaderboard tooltips improved with better z-index handling
- Mobile responsive design issues in both table and circle leaderboards

### Improved
- Mobile UX for beer addition with larger, more accessible buttons
- Leaderboard readability on small screens with optimized layouts
- Touch-friendly interface elements across all components
- Visual consistency with tavern theme colors throughout the app
- Performance optimizations for mobile devices

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
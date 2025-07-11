# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


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
# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

### Known Issues / TODOs
- Selecting all from ReadView is picking up line numbers
- Public view needs styling
- Remove axios and use native fetch
- Replace window.locations with React router redirects

## [0.4.0] - 2017-03-06
### Added
- Added CORS headers
- Added a view for Not Found

### Changed
- Using react context for state
- Updated public view styling
- Modularized scss and cleaned up flex issues

### Fixed
- Disabled header links depending on view
- Cleaned up lots of redundancies in code
- Scrolling issue in public list view
- Issue with remembering public/private option

### Removed
- Removed MobX and replaced with React context for state management

## [0.3.0] - 2017-01-27
### Added
- Public list view of pastes
- Help view pulling changelog from github
- Added Public/Private option to saved user preferences

### Fixed
- Raw link function in header
- Resolved server issues with larger pastes
- Retained white-space in ReadView
- Cursor pointer style for nav links
- Cookie expiration

## [0.2.0] - 2016-11-16
### Added
- Mobx for global and local state management between components
- Remembers last name and expiration choices
- This Change Log Doc
- Started marking releases

### Changed
- Routing and related folder structure
- Renamed GlobalStore to AppStore

### Fixed
- Some line-ending issues after editing a saved paste
- Positioning of error message in the PasteView

## [0.1.0] - 2016-11-01
### Added
- First released iteration of everpaste
- Simple pastebin application allows for adding and editing code snippets
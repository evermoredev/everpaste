# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
- CORS headers

### Known Issues / TODOs
- Selecting all from ReadView is picking up line numbers
- Public view needs styling
- Highlight nav items when active, grey out disabled buttons per view
- Remove axios and use native fetch
- Scrollbar issue in public list view

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
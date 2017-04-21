# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

### Known Issues
- Dev server serves production index.html file from disk if it exists
- Changing scss files except for main.scss not triggering hot reload

### TODOs
- Better error reporting for problems on startup
- Handle larger files
- Add a script to generate and replace letsencrypt certs
- Handle file uploads via curl

## [1.2.0] - 2017-04-21
### Added
- Added highlighting of diffed text in Read View
- Tab detection in textarea of pasteview

### Changed
- Added prop-types package preparing for react 16 deprecation
- Updated several packages

## [1.1.0] - 2017-04-19
### Added
- Added diffing view to both edit and read views

### Fixed
- Form styling for secret key entry

## [1.0.1] - 2017-04-18
### Fixed
- Fixed style on mobile nav
- Fixed broken title in webpack

## [1.0.0] - 2017-04-17
### Added
- Added a migrations api
- Added sequelize orm
- Added a config for the client as well as server
- Created models & controllers folder for the server

### Changed
- Significantly improve performance by compressing http payloads and utilizing available cpus with node clusters
- Organized server.js to use a Server class
- Optimized StyleStore
- Lots of additional code cleanup

### Fixed
- Public view hanging with no data
- Mobile navigation fixed

## [0.11.0] - 2017-04-07
### Added
- Added ability to paste images from clipboard

### Fixed
- Fixed a problem with using back button

## [0.10.0] - 2017-04-06
### Added
- Ability to upload files/images
- Breaking changes to database
- Added shared validations module for pastes
- Added uploads folder on the server

## [0.9.0] - 2017-04-03
### Added
- Can now post to api with curl

### Changed
- Removed resizing of text area
- Fixed styles on paste view for mobile responsiveness

### Removed
- Removed axios package, replaced with xhr code
- Removed all inline styles

### Fixed
- Language extensions
- Selecting all from ReadView no longer picking up line numbers

## [0.8.0] - 2017-03-24
### Added
- added start.sh script in /server/tools to use with everpaste.service

### Changed
- start with ssl config commented out in example
- Updated React router 4 out of beta

### Fixed
- dev & prod needed different ways to serve the index file
- fixed everpaste.service file

## [0.7.0] - 2017-03-20
### Added
- Saved view intermediary for copying AES key
- Hot reloader now working for dev
- /server/tools directory for helpful scripts/files
- Separate config for production server
- https support

### Changed
- Create AES key instead of user generated key
- Webpack upgraded to v2
- Breaking changes to config file

### Fixed
- Replace window.locations with React router redirects

## [0.6.0] - 2017-03-14
### Added
- AES Encryption option added
- Created <Condition /> component to clean up jsx

### Changed
- Moved the highlighting module to the client
- Renamed /src directory to /client
- Added /shared directory for shared config and modules
  Will make using same client/server validation a lot easier
- Moved most config items from project root to /server/config
- Breaking changes to database
- Clicking raw from Header no longer makes trip to server

## [0.5.0] - 2017-03-06
- Fixed breaking issue with packages & updated other packages
- Fixed double scroll issue in help view

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
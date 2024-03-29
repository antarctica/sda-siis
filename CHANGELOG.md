# SDA Sea Ice Information Service (SIIS) - Change log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2022-12-13

### Added

* [App] Replacing high resolution download option with IWS link interim solution
  [#317](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/317)
* [App] Replacing map layers when style property changes
  [#304](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/304)

### Fixed

* [App] Centre on and follow ship position controls disabled when ship position is not within bounds of current projection
  [#301](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/301)
* [App] Missing styles parameter in WMS layers
  [#304](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/304)
* [App] Fixing missing timestamp CQL filter where 'All' time filter is selected
  [#314](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/314)
* [App] Footprint layers not always re-rendering when time selections are changed
  [#284](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/284)
* [App] Map rotation controls when using Arctic projection
  [#268](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/268)
* DDM coordinate format projection
  [#269](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/269)

### Changed

* [App] Disabling high resolution download option
  [#312](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/312)
* [App] Disabling time filter buttons (24/48/72)
  [#316](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/316)

## 1.0.0-rc.9 - 2022-11-04

### Added

* [App] Considering WMS-T layers the same as WMS
  [#277](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/277)ß

### Fixed

* [App] Invalid JS code prevented ship track from loading/updating
  [#280](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/280)
* [App] Initial granule selection order changed to select latest granule not oldest granule
  [#277](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/277)
* [App] Background colour assigned to app wrapper element rather than body to work when in full screen mode
  [#276](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/276)

### Changed

* [App] Min/Max attributes removed from date filter as temporal extent can't be reliably calculated currently
  [#275](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/275)

## 1.0.0-rc.8 - 2022-11-03

### Changed

* [App] suppressing attribution control until proper attribution statements are written
  [#274](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/274)
* [App] Updating text sizes and dark mode styling
  [#273](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/273)
* [App] Removing fixed size from legend graphics
  [#270](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/270)
* [App] Mouse coordinate formats now DDM or DD (rather than DDM or XY)
  [#269](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/269)
* [App] Re-enabling WMTS support
  [#51](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/51)
* [App] Stroke width for footprints increased further to make them easier to click
  [#267](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/267)

### Fixed

* [App] Removing hard-coded SRS in footprint layer URls
  [#271](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/271)
* [App] Map rotation controls when using Arctic projection
  [#268](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/268)

## 1.0.0-rc.7 - 2022-11-02 [BREAKING!]

### Changed [BREAKING!]

* [API] 'temp' prefix removed from OGC API endpoints
  [#264](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/264)

### Added

* [App] Auto-updating ship track when enabled
  [#163](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/163)
* [App] Setting legend options from API property
  [#265](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/265)
* [API] Legend options added as a property in API responses
  [#265](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/265)
* [App] Setting whether product is shown on startup from API property
  [#265](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/265)
* [API] Show on startup values added as a property in API responses
  [#265](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/265)
* [API] Default opacity values added as a property in API responses
  [#265](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/265)
* [API] Z index values added as a property in API responses
  [#265](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/265)

### Fixed

* [App] Previous granule ID was incorrectly used as product ID when generating granule layer references
  [#260](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/230)

### Changed

* [App] Setting product default opacity value from API property
  [#265](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/265)
* [App] Setting product Z index value from API property
  [#265](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/265)
* [App] Updating OGC API endpoint property names
  [#264](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/264)
* [App] Stroke width for footprints increased to make them easier to click
  [#262](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/262)
* [App] UI updated to make product selection panel bigger
  [#261](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/261)

## 1.0.0-rc.6 - 2022-10-31

### Fixed

* [App] Workaround for static basemap layer not using updated map projection
  [#256](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/256)
* [App] Handling determining a temporal extent for products with no granules (i.e. too old)
  [#230](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/230)

## 1.0.0-rc.5 - 2022-10-27

### Added

* [App] Exponential backoff for sensor data requests
  [#212](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/212)

### Fixed

* [App] Graticule layer can no longer be selected
  [#218](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/218)
* [App] Logic for updating the status of sensor readings
  [#214](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/218)

### Changed

* Time / date filters are now per-product
  [#230](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/230)
* Limiting footprint selections to the active product (where multiple granule selections apply)
  [#240](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/240)
* [App] Full screen behaviour changed to use HTML5 full screen API rather than OL control
  [#232](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/232)
* [App] Footprint selection supports multiple features
  [#237](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/237)
* [App] Product selection no longer uses radio-buttons
  [#209](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/209)

## 1.0.0-rc.4 - 2022-02-11

### Added

* [Infra] Minimal information on staging environment (URLs to components)
  [#248](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/248)
* [App] Notice to users where a product is selected without any granules in the current time filter period
  [#235](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/235)
* [App] Bounds to time component
  [#238](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/238)
* [App] Hard-coding Z-index levels for products
  [#80](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/80)

### Fixed

* [Infra] Correcting `rsync` commands for copying data for a local development environment
  [#249](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/249)
* [App] Assigning z-index to ship track and other map components to prevent overlap
  [#80](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/80)
* [App] Inconsistency with depth sensor value variable
  [#213](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/213)
* [App] Improving contrast in AppMap measures sub-component
  [#234](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/234)
* [App] Granule selections are no longer lost when the measure tool is active
  [#239](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/239)

### Changed

* [App] Removed transparency from footprint selection style
  [#236](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/236)
* [App] Measure tool distance and vertex count now update as the feature is drawn
  [#203](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/203)
* [App] Moving granule metadata under products switcher
  [#241](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/241)

### Removed

* [App] Logic to normalise temporal period in footprint WFS requests
  [#208](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/208)

## 1.0.0-rc.3 - 2022-02-03

### Fixed

* [API] Black linting
  [#194](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/194)
* [App] Centre on / Follow ship position controls
  [#201](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/201)
  [#202](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/202)
* [App] Correcting how drawn features are selected for measurements
  [#204](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/204)
* [App] Correctly removing orphaned map layers
  [#229](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/229)
* [App] Adding feedback for active time filter choice
  [#207](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/207)

### Changed

* [App] Switched to local base map layer (away from OSM)
  [#120](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/120)
* [App] Changed sensor data refresh frequency to 3 seconds
  [#225](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/225)
* [App] Legend for selected product now within detail/summary element
  [#206](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/206)
* [App] Disabling user facing alerts (except where error prevents a user action)
  [#199](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/199)
* [Infra] Streamline CI/CD
  [#227](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/227)
* [App] Initial/crude support for making product selections reactive when the time filter changes
  [#208](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/208)

### Removed

* [Infra] Defunct integration environment
  [#195](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/195)
* [Infra] Defunct Terraform provisioning
  [#196](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/196)

## 1.0.0-rc.2 - 2022-01-14

### Added

* [App] Minimal time filter support for footprints
  [#190](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/191)
* [App] Initial support for route import from AI Lab Route Planner
  [#187](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/181)
* [App] Initial support for high resolution granules
  [#172](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/172)
* [App/API] Initial support for route import
  [#181](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/181)
* [App] UI control titles
  [#179](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/179)
* [App/API] Initial support for drawn route export
  [#164](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/164)
* [App] Initial support for UI panel backgrounds
  [#178](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/178)
* [App] Support for showing ship track and ship position
  [#163](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/163)
* [App] Support for toggle buttons and toggle button groups
  [#165](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/165)
* [App] Very initial route drawing and measuring support
  [#137](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/137)
* [App] Controls to centre on, and/or track, current sensor position
  [#166](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/166)
* [App] Control to hide or show other UI panels (products, sensors, granules)
  [#168](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/168)
* [App] Very initial graticule support
  [#121](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/121)
* [App] Date selection for granules
  [#133](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/133)
* [App] Granule status for footprints
  [#135](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/135)
* [App] Granule status output for selected granule
  [#134](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/134)
* [App] Hours offset control for clock
  [#126](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/126)
* [App] Open-Sans font face
  [#115](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/115)
* [App] Ability to toggle debug output
  [#98](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/98)

### Fixed

* [App] Partially fixing selecting specific granules for S1 product
  [#90](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/90)
* [App] Correcting custom lat/lon formatting
  [#189](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/189)
* [Proj] Fixing MIT licence
  [#185](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/185)
* [Infra] Improving rsync instructions
  [#184](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/184)
* [App] Updated graticule component implementation (VueLayers deprecation)
  [#183](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/183)
* [App] Style selection for WMS/WMTS layers
  [#182](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/182)
* [App] Small tweaks/fixes
  [#177](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/177)
* [Infra] Correcting instructions for syncing from project directory to local development data directories
  [#176](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/176)
* [App] Switching between custom and XY position control formats
  [#169](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/169)
* [API] Black code formatting violations in API
  [#161](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/161)
* [Infra] Tweaked local development setup instructions to fit better with new data directory location
  [#162](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/162)
* [Infra] Removed orphaned call to set permissions on now non-existent GeoServer extensions directory
  [#157](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/157)
* [App] Map rotation based on ship longitude and heading corrected
  [#111](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/111)
* [App] Incorrect assumption that the `value_at_pixel_feature` property of the map component would always have a
  `properties` property
  [#154](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/154)
* [Infra] Fixing incorrect geoserver endpoint
  [#148](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/148)
* [App] Extent for 3031 map projection, required for WMTS support
  [#51](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/51)
* [App] Re-enabling sensor component updates
  [#125](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/125)
* [App] Mis-match between colour schemes for day/night mode
  [#112](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/112)

### Changed

* [App] Granule raw properties re-enabled
  [#191](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/191)
* [App] Various styling fine tuning
  [#188](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/188)
* [App] Improving error reporting
  [#186](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/186)
* [Proj] Relicencing project under the MIT licence
  [#175](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/175)
* [Infra] Tidying up Docker Compose configuration
  [#174](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/174)
* [App] Iterating sensor information panel UI
  [#130](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/130)
* [App] Iterating product switcher panel UI
  [#130](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/130)
* [App] Converting time filters to button controls
  [#130](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/130)
* [App] Custom coordinate formatting used for mouse position
  [#118](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/118)
* [App] Changing default colour scheme to light/day and hiding system scheme option
  [#113](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/113)
* [Infra] Changed blob store directory in GeoServer development container to match other environments
  [#150](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/150)
* [App] Initial zoom setting
  [#139](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/139)
* [App] Setting default projection to EPSG:3031 (Antarctica)
  [#147](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/147)
* [App] Setting default time filter to 72 hours
  [#136](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/136)
* [Infra] AWS Client replaced with `rsync` for updating the SIIS data directory
  [#146](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/146)
* [Infra] Raw data directory changed to fit with BAS SAN path (`/data/` -> `/data/siis/data`)
  [#142](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/142)
* [App] Tidying up app controls (dark mode, projection, etc.) and collapsing into a toolbar
  [#101](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/101)
* [App] Restyling OL controls (zoom, rotation, fullscreen) and collapsing into a toolbar
  [#100](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/100)
* [App] Moving product switcher to right of map as a panel, and improving per-product controls layout
  [#99](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/99)

### Removed

* [Infra] GeoServer Jpeg2000 extension removed
  [#144](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/144)
* [Infra] GeoServer GDAL extension removed due to removed OS dependency
  [#143](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/143)

## 1.0.0-rc.1 - 2021-07-15

### Changed [BREAKING!]

* [API] Encode `/products` array products as lists
  [#53](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/53)
* [API] Rename `/layerdefs` resource to `/products`
  [#42](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/42)
* [API] Remove `/api` prefix for API URLs
  [#43](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/43)
* [API] Protocol, host and port parameters from GeoServer endpoints in Product API resource
  [#45](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/45)
* [API] Unify id attribute for API resources
  [#46](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/46)

### Added

* [App] Initial value at pixel support
  [#66](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/66)
* [App] Initial multi-granule selection using footprints layer
  [#78](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/78)
* [App] Map rotation based on manual, GPS heading or GPS longitude source
  [#79](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/79)
* [App] Initial implementation of sensor metadata
  [#62](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/62)
* [API] Add render_exclusive to API /products
  [#75](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/75)
* [API] Add status, default_timeframe etc to API
  [#75](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/75)
* [Infra] Automatic packages for frontend application
  [#21](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/21)
* [App] Initial implementation of map metadata
  [#69](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/69)
* [App] Initial implementation of map controls
  [#67](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/67)
* [App] Initial WMTS support
  [#51](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/51)
* [App] Minimal implementation of granule metadata
  [#65](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/65)
* [API] Add layer style attribute to product resource
  [#55](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/55)
* [App] Minimal implementation of layer transparency
  [#59](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/59)
* [App] Minimal implementation of product legends (PNG)
  [#58](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/58)
* [App] Minimal implementation of filtering granules by datetime (e.g. within 24 hours)
  [#31](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/31)
* [App] Minimal implementation of filtering products by location (e.g. North/South)
  [#31](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/31)
* [App] Ability to hide layers/granules once added to the map
  [#56](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/56)
* [API] Add resource filtering
  [31](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/31)
* [App] Minimal layers attribution
  [50](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/50)
* [App] Minimal base map support
  [#49](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/49)
* [App] Minimal support for selecting layers and granules to display on a map
  [#48](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/48)
* [App] Enabling VueLayers debug mode
  [#40](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/40)
* [App] Initial projection support
  [#40](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/40)
* [Infra] Documentation on how to update JS dependencies
  [#44](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/44)
* [Infra] Documentation on how to update the S3 data directory
  [#24](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/24)
* [Infra] Black Python code formatting
  [#38](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/38)

### Fixed

* [App] Map layer stacking
  [#96](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/96)
* [App] Deactivated map layers not removed from map
  [#85](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/85)
* [App] Missing opacity debug and map layer values
  [#86](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/86)
* [App] Granule datetime needs to be converted to a date for use in GeoServer requests
  [#89](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/89)
* [App] Dark mode not enabled by defaul when dark
  [#83](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/83)
* [App] Incorrect logic for selecting active granules vs. base layers
  [#73](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/73)
* [App] Refactoring references to properties between Vue components
  [#47](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/47)
* [Meta] Inconsistencies between `sea-ice` and `sea ice` resolved to `sea ice`
  [#23](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/23)
* [GeoServer] Moving GeoServer log file out of the GeoServer data directory
  [#33](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/33)
* [Infra] Homepage link in App `package.json`
  [#44](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/44)

### Changed

* [API] Ensure default granule sorting is descending by 'timestamp'
  [#61](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/61)
* [App] Disabling hot module reload in app
  [#54]((https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/54)
* [App] Updating App JS dependencies
  [#44](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/44)
* [GeoServer] Creation and modified timestamps now displayed in GeoServer UI
  [#35](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/35)
* [Infra] Tracking Yarn lockfile in repository
  [#44](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/44)
* [API] Refactor to Open API v3 spec
  [#43](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/43)

### Removed

* [App] Unused cruise and season settings
  [#16](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/16)

## [0.1.0] - 2020-11-17

### Added

* [App] Initial, work in progress, implementation using Parcel, Vue and VueLayers to demonstrate integration of components
  [#1](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/1)
* [API] Initial, work in progress, implementation using Flask, to demonstrate integration of components
  [#1](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/1)
* [KV API] Stop-gap implementation to demonstrate integration of components
  [#1](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/1)
* [GeoServer] Custom 2.18 container image with JNDI connection to database and required GDAL/JPEG2000 extensions
  [#1](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/1)
* [PostGIS] PostgreSQL 12.x and PostGIS 3.x
  [#1](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/1)
* [Infra] Initial integration environment based on Terraform and experimental MAGIC Nomad cluster
  [#2](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/2)
* [GeoServer] Volume for GCW file blobstore
  [#18](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/18)

### Fixed

* [API] CORS support
  [#17](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/17)

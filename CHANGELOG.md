# SDA Sea Ice Information Service (SIIS) - Change log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed [BREAKING!]

* [API] Rename layerdefs resource to products
  [#42](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/42)
* [API] Remove `/api` prefix for API URLs
  [#43](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/43)

### Added

* [App] May layers attribution
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
  [#24](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/24)
* [Infra] Documentation on how to update the S3 data directory
  [#24](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/24)
* [Infra] Black Python code formatting
  [#38](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/38)

### Fixed

* [App] Refactoring references to properties between Vue components
  [#47](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/47)
* [Meta] Inconsistencies between `sea-ice` and `sea ice` resolved to `sea ice`
  [#23](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/23)
* [GeoServer] Moving GeoServer log file out of the GeoServer data directory
  [#33](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/33)
* [Infra] Homepage link in App `package.json`
  [#44](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/44)

### Changed

* [App] Updating App JS dependencies
  [#44](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/44)
* [GeoServer] Creation and modified timestamps now displayed in GeoServer UI
  [#35](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/35)
* [Infra] Tracking Yarn lockfile in repository
  [#44](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/44)
* [API] Refactor to Open API v3 spec
  [#43](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/43)

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

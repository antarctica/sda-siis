# SDA Sea Ice Information Service (SIIS)

Sea Ice Information System (SIIS) for the Sir David Attenborough (SDA).

## Status

This application is a mature alpha being prepared for its first test deployment.

## Overview

### Purpose

The Sea Ice Information Service (SIIS) provides up-to-date sea ice information products for decision making and route
planning when the RRS SDA is in, near or close to, sea ice in Antarctica and the Arctic.

### Components

SIIS is comprised of a number of components, represented by top-level directories:

* **API** [`api/`](./api/): Provides information about available layers/granules and key-value storage for the app
  component, in future will manage shore -> ship data syncing and other tasks as needed
* **Key-Value API (Temp)** [`api-kv/`](./api-kv/): Provides key-value storage for the app component temporarily until
  available from the main API
* **App** [`app/`](./app/): Frontend application used by users to visualise sea ice information
* **GeoServer** [`geoserver/`](./api/): Used to provide OGC services for sea-ice, and more general, data products
* **PostGIS**: Persists settings and information in the App/API and provides storage for vector data products

### Standards support

This application supports exporting waypoints/routes to a file compliant with the
[IEC 61774:2015](https://webstore.iec.ch/publication/23128) standard (RTZ).

RTZ versions supported by this application: **1.0**

See the [BAS Metadata Library](https://github.com/antarctica/metadata-library#coverage-for-iec-61174) documentation for
RTZ parameters/options supported by this application.

No RTZ extensions are supported by this application.

## Usage

* [staging instance](https://siis.sda-stage.bas.ac.uk/)
  * [GeoServer](https://start.1password.com/open/i?a=QSB6V7TUNVEOPPPWR6G7S2ARJ4&v=ffy5l25mjdv577qj6izuk6lo4m&i=ksuxk6us55dbjbjy3jubvsy4ve&h=magic.1password.eu)
  * [Database](https://start.1password.com/open/i?a=QSB6V7TUNVEOPPPWR6G7S2ARJ4&v=ffy5l25mjdv577qj6izuk6lo4m&i=3edi7zmpe6n7fb7s4bfgicsbvm&h=magic.1password.eu)
* [production instance](https://siis.sda.bas.ac.uk/)

## Implementation

### SIIS data directory

A common data directory, the SIIS data directory, is used for storing configuration and data for:

* the [GeoServer Data Directory](#geoserver-data-directory)
* [PostgreSQL/PostGIS SQL Scripts](#postGIS-sql-scripts)
* [Product samples](#product-samples)

This data is stored separately from the Project Git repository (hosted in GitLab) because it contains artefacts rather
than source code.

The authoritative version of this data directory is a volume in the BAS (Cambridge) SAN bucket: `/data/siis/`.

#### Updating the SIIS data directory

This section applies if *you* have changed files in a local copy of the SIIS data directory (i.e. in a development
environment). `rsync` can then be used to preview, and then upload, updates to the remote, authoritative, SIIS data
directory.

In general terms:

```shell
$ docker compose run rsync

# to preview changes
$ rsync -e "ssh -o StrictHostKeyChecking=no" -avzh --dry-run . [user]@bslcenb.nerc-bas.ac.uk:/data/siis/

# to perform changes
$ rsync -e "ssh -o StrictHostKeyChecking=no" -avzh --progress . [user]@bslcenb.nerc-bas.ac.uk:/data/siis/
```

After making updates, ensure to communicate with other developers, currently via the
[MAGIC Slack](https://gitlab.data.bas.ac.uk/MAGIC/general/-/wikis/Slack) workspace (internal).

#### Pulling updates from the product data directory

This section applies if *someone else* has [Updated The SIIS Data Directory](#updating-the-siis-data-directory)
and you have a local copy of the SIIS data directory (i.e. in a development environment).

It is important to pull outstanding changes down to avoid conflicts between files and other unintended side effects of
an out of sync directory.

`rsync` can be used to first preview and then perform updates to a local `./data/` directory, from the remote,
authoritative, SIIS data directory.

```shell
$ docker compose run rsync

# to preview change
$ rsync -e "ssh -o StrictHostKeyChecking=no" -avzh --dry-run --exclude /gwc --exclude /datastagein --exclude /datastageout --exclude /data/xfer [user]@bslcenb.nerc-bas.ac.uk:/data/siis/ .

# to perform changes
$ rsync -e "ssh -o StrictHostKeyChecking=no" -avzh --progress --exclude /gwc --exclude /datastagein --exclude /datastageout --exclude /data/xfer [user]@bslcenb.nerc-bas.ac.uk:/data/siis/ .
```

### GeoServer

#### GeoServer data directory

The GeoServer [data directory](https://docs.geoserver.org/stable/en/user/datadirectory/index.html) is part of
the [SIIS Data Directory](#siis-data-directory):

* location (locally): `./data/geoserver/`
* location (BAS SAN): `/data/siis/geoserver/`

This directly contains all layer definitions, styles and other configuration settings. It **does not** include datasets
(the inner `data/` directory), see the [Product Samples](#product-samples) section for more information.

#### GeoServer logs

Local development instances:

* stdout
* `/usr/local/tomcat/logs/geoserver.log`

### GeoWebCache

#### GeoWebCache Configuration

The GeoWebCache configuration is tracked as files within the [Project Data Directory](#project-data-directory):

* `./data/geoserver/gwc-gs.xml` / `/data/siis/geoserver/gwc-gs.xml`
* `./data/geoserver/gwc/geowebcache.xml` / `/data/siis/geoserver/gwc/geowebcache.xml`
* `./data/geoserver/gwc-layers/*`] `/data/siis/geoserver/gwc-gwc-layers/*`
* `./data/geoserver/global.xml` (for the updated `updateSequence` property) / `/data/siis/geoserver/global.xml`

Changes to these configuration files need to captured by
[Updating The SIIS Data Directory](#updating-the-siis-data-directory):

**Note:** You do not need to capture the dated backup of these files that GeoServer generates automatically.

#### GeoWebCache Tile storage

A FileBlobStore is used for storing generated tiles. This blob store should be used by default.

Within local development instances, the base directory for the blob store is: `/data/siis/gwc/blobstore/`, which is
mapped to `runtime/gwc/` within the container.

**Note:** This blob store is not part of the [SIIS Data Directory](#siis-data-directory).

### PostGIS

#### PostGIS SQL scripts

The PostGIS instance requires a set of SQL scripts to initialise the database structure used by the API and for storing
[Product Samples](#product-samples).

These scripts are stored as files within the [SIIS Data Directory](#siis-data-directory):

* location (locally): `./data/siis/psql/`
* location (remote): `/data/siis/sql/`

Changes to these scripts need to captured by [Updating The SIIS Data Directory](#updating-the-siis-data-directory).

In local development environments, these scripts will be mapped to `/docker-entrypoint-initdb.d/` within the PostgreSQL
container to be automatically executed on start up.

These scripts will need to be executed manually in other environments

### Product samples

A sample of each product this project should support is available to simulate the data that will exist in a real
deployment. This sample is:

* representative of the the *breadth* of products that need to be supported
* not representative of the *depth* (volume) of product series that have a large, or variable, spatial/temporal extent
* a static and stable set of data, to enable reproducible results if (automated) tests are added in the future

Product samples are distributed as files within the [SIIS Data Directory](#siis-data-directory):

* location (locally): `./data/raw/`
* location (S3): `/data/siis/data/raw/`

Changes to extensions need to captured by [Updating The SIIS Data Directory](#updating-the-siis-data-directory).

## Setup

See the [Usage](#usage) section for how to use the application.

...

## Developing

### Development environment

A local development environment is available using Docker containers, coordinated using Docker Compose:

```shell
# required local tools
$ brew install git
$ brew cask install docker

# clone project
$ git clone https://gitlab.data.bas.ac.uk/MAGIC/SIIS.git
$ cd ./SIIS

# pull container images
$ docker-compose pull
```

[Populate your local data directory](#pulling-updates-from-the-product-data-directory).

```shell
# start stack
# (note: the *app* service may display startup errors [1] which can be safely ignored)
$ docker-compose up
# (visit http://localhost:9000 when up)

# when finished
# (press [ctrl] + c to stop containers)
$ docker-compose down
```

You will need access to the [BAS GitLab](https://gitlab.data.bas.ac.uk) instance to clone the project Git repository.

You will need access to the BAS Private Docker Registry (provided by the BAS GitLab instance) to pull containers for
this project, see the [BAS GitLab README](https://gitlab.data.bas.ac.uk/WSF/bas-gitlab#docker-registry) for more
information.

[1]

```
app_1        | Server running at http://0.0.0.0:9000 - configured port 9000 could not be used.
app_1        | /bin/sh: lscpu: not found
```

### Dependency management

#### Application dependencies (JavaScript)

JavaScript dependencies for the frontend application are managed using Yarn.

To check for outdated dependencies:

```shell
$ docker-compose run app ash
$ yarn outdated
```

To upgrade dependencies:

```shell
# update `package.json` and `yarn.lock` files in a container instance
$ docker-compose run app ash
$ yarn upgrade-interactive
# copy updated files outside the container to persist and track changes in project repository
$ cp package.json yarn.lock assets/
$ exit
$ mv app/assets/package.json app/assets/yarn.lock app/
# rebuild application container to use updated package versions
$ docker-compose build app
$ docker-compose push app
```

To add new dependencies:

```shell
# update `package.json` and `yarn.lock` files in a container instance
$ docker compose run app ash
$ yarn add [package]
# copy updated files outside the container to persist and track changes in project repository
$ cp package.json yarn.lock assets/
$ exit
$ mv app/assets/package.json app/assets/yarn.lock app/
# rebuild application container to use updated package versions
$ docker compose build app
$ docker compose push app
```

### Code Style (Python)

PEP-8 style and formatting guidelines must be used for this project, with the exception of the 80 character line limit.

[Black](https://github.com/psf/black) is used to ensure compliance.

Black can be [integrated](https://black.readthedocs.io/en/stable/editor_integration.html) with a range of editors, such
as PyCharm, to perform formatting automatically.

To apply formatting manually:

```shell
$ docker-compose run api black api/
```

To check compliance manually:

```shell
$ docker-compose run api black --check api/
```

Checks are ran automatically in [Continuous Integration](#continuous-integration).

## Deployment

### Deployment packages

Application packages are automatically created by [Continuous Deployment](#continuous-deployment) for the frontend
application and backend API components when new releases (tags) are created. Packages are held in the per-project
[GitLab Package Registry](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/packages):

* frontend application: compressed distribution bundle for deployment into a web root:
  * `app-{version}-{environment}.zip`: per environment bundle including source maps
  * `app-{version}-{environment}-no-src-maps.zip`: per environment bundle without source maps, to reduce file size
  * `app-{version}.zip`: default bundle including source maps
  * `app-{version}-no-src-maps.zip`: default bundle without source maps, to reduce file size

### Deployment containers

Self-contained deployment containers are built by [Continuous Deployment](#continuous-deployment) for the frontend
application and backend API components. Images for these containers are tagged under the `/deploy` namespace in the
[BAS Docker Registry](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/container_registry).

### Continuous Deployment

All commits will trigger a Continuous Deployment process using GitLab's CI/CD platform, configured in `.gitlab-ci.yml`.

## Release procedure

For all releases:

1. create a release branch
2. close release in `CHANGELOG.md`
3. push changes, merge the release branch into `main` and tag with version

## Feedback

The maintainer of this project is the BAS Mapping and Geographic Information Centre (MAGIC). We welcome feedback by
email addressed to [magic@bas.ac.uk](mailto:magic@bas.ac.uk).

## Issues

This project uses issue tracking, see the [Issue tracker](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues) for more
information.

**Note:** Read & write access to this issue tracker is restricted. Contact the project maintainer to request access.

## Licence

Copyright (c) 2019-2022 UK Research and Innovation (UKRI), British Antarctic Survey (BAS).

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

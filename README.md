# SDA Sea Ice Information Service (SIIS)

Sea Ice Information System (SIIS) for the Sir David Attenborough (SDA).

## Status

This application is an early alpha. Significant refactoring is ongoing and so should be considered unstable.

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

## Usage

* [Frontend application (Internal, BAS network required)](http://10.70.1.145:32004/)
* [Backend API (Interactive API reference)](api/api/swagger.yml)
* [GeoServer instance (Internal, BAS network required)](http://10.70.1.145:32001/geoserver)
  * Credentials available from MAGIC 1Password as entry *SIIS GeoServer [Integration]*

## Implementation

### Project data directory

A common data directory `./data/` is used for storing configuration and data for:

* the [GeoServer Data Directory](#geoserver-data-directory)
* [GeoServer Extensions](#geoserver-extensions)
* [PostGIS SQL Scripts](#postGIS-sql-scripts)
* [Product samples](#product-samples)

This data is stored separately from the Project Git repository (hosted in GitLab) because it contains artefacts rather
than source code.

The authoritative data directory is a S3 bucket:
[`s3://siis-data-product-samples.data.bas.ac.uk`](https://s3.console.aws.amazon.com/s3/buckets/siis-data-product-samples.data.bas.ac.uk?region=eu-west-1&tab=objects).

This bucket has [object versioning](https://docs.aws.amazon.com/console/s3/enable-bucket-versioning) enabled to track
revisions to files and allow regressions to be rolled-back.

**Note:** You will need suitable AWS IAM permissions as part of the
[BAS AWS](https://gitlab.data.bas.ac.uk/WSF/bas-aws) account to access this bucket.

**Note:** The authoritative copy of the project data directory may change in the future as the production deployment
is developed.

#### Product data directory areas

There are two areas (versions) within the product data directory implemented using directories (S3 prefixes):

* `v0/` ([`s3://siis-data-product-samples.data.bas.ac.uk/v0/`](https://s3.console.aws.amazon.com/s3/buckets/siis-data-product-samples.data.bas.ac.uk?region=eu-west-1&prefix=v0/&showversions=false))
* `v1/` ([`s3://siis-data-product-samples.data.bas.ac.uk/v1/`](https://s3.console.aws.amazon.com/s3/buckets/siis-data-product-samples.data.bas.ac.uk?region=eu-west-1&prefix=v1/&showversions=false))

Objects in the `v0/` area are intended to replaced and not exist in the longer term. Their removal is tracked in
[#25](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/25).

Objects in the `v1/` area are considered legitimate and will exist in the longer term. They are namespaced in case a
different directory (prefix) layout is used in the future (i.e. as `v2/`).

Further background on this concept is available in
[#1](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/1#why-is-the-s3-bucket-split-into-v0-and-v1).

#### Updating the product data directory

This section applies if *you* have changed files in a local copy of the project data directory (i.e. in a development
environment). The AWS S3 client can be used to first preview and then perform updates to the remote, authoritative, S3
bucket.

**WARNING:** Be aware that the remote bucket uses different [Areas](#product-data-directory-areas) that need to be taken
into account when uploading files.

In general terms:

```shell
$ docker-compose run aws-cli

# to preview changes
$ aws s3 sync --dryrun /data/[directory] s3://siis-data-product-samples.data.bas.ac.uk/[area]/[directory]

# to perform changes
$ aws s3 sync /data/[directory] s3://siis-data-product-samples.data.bas.ac.uk/[area]/[directory]
```

For example to upload changes in `/data/psql/` directory (part of the `v0` area):

```shell
$ docker-compose run aws-cli

# preview changes (1 file to upload)
$ aws s3 sync --dryrun /data/psql/ s3://siis-data-product-samples.data.bas.ac.uk/v0/psql/
(dryrun) upload: data/psql/foo.sql to s3://siis-data-product-samples.data.bas.ac.uk/v0/psql/foo.sql

# perform changes (1 file uploaded)
$ aws s3 sync /data/psql/ s3://siis-data-product-samples.data.bas.ac.uk/v0/psql/
upload: data/psql/foo.sql to s3://siis-data-product-samples.data.bas.ac.uk/v0/psql/foo.sql
```

After making updates, ensure to communicate with other developers, currently via the
[MAGIC Slack](https://gitlab.data.bas.ac.uk/MAGIC/general/-/wikis/Slack) workspace (internal).

#### Pulling updates from the product data directory

This section applies if *someone else* has [Updated The Product Data Directory](#updating-the-product-data-directory)
and you have a local copy of the project data directory (i.e. in a development environment).

It is import to pull outstanding changes down to avoid conflicts between files and other unintended side effects of an
out of sync directory.

The AWS S3 client can be used to first preview and then perform updates to a local `./data/` directory, from the
remote, authoritative, S3 bucket.

```shell
$ docker-compose run aws-cli

# to preview changes
$ aws s3 sync --dryrun s3://siis-data-product-samples.data.bas.ac.uk/v0/ /data/
$ aws s3 sync --dryrun s3://siis-data-product-samples.data.bas.ac.uk/v1/ /data/

# to perform changes
$ aws s3 sync s3://siis-data-product-samples.data.bas.ac.uk/v0/ /data/
$ aws s3 sync s3://siis-data-product-samples.data.bas.ac.uk/v1/ /data/
```

### GeoServer

#### GeoServer data directory

The GeoServer [data directory](https://docs.geoserver.org/stable/en/user/datadirectory/index.html) is part of
the [Project Data Directory](#project-data-directory):

* location (locally): `./data/geoserver/`
* location (S3): [`s3://siis-data-product-samples.data.bas.ac.uk/v0/geoserver/`](https://s3.console.aws.amazon.com/s3/buckets/siis-data-product-samples.data.bas.ac.uk?region=eu-west-1&prefix=v0/geoserver/&showversions=false)

This directly contains all layer definitions, styles and other configuration settings. It **does not** include datasets
(the inner `data/` directory), see the [Product Samples](#product-samples) section for more information.

**Note:** This directory is part of the `v0/` part of the project data directory because, in the long term, it's
intended that GeoServer will be provisioned programmatically, rather than relying on a static configuration directory.
See [#26](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/26) for more information.

#### GeoServer logs

The GeoServer container writes logs to:

* stdout
* `/usr/local/tomcat/logs/geoserver.log`

#### GeoServer extensions

The GeoServer instance requires these extensions to access data products:

* GDAL extension
* JPEG 2000 extension

These extensions are distributed as files within the [Project Data Directory](#project-data-directory):

* location (locally): `./data/geoserver_extensions/`
* location (S3): [`s3://siis-data-product-samples.data.bas.ac.uk/v0/geoserver_extensions/`](https://s3.console.aws.amazon.com/s3/buckets/siis-data-product-samples.data.bas.ac.uk?region=eu-west-1&prefix=v0/geoserver_extensions/&showversions=false)

Changes to extensions need to captured by [Updating The Product Data Directory](#updating-the-product-data-directory).

These files will be mapped to `/var/local/geoserver-exts/` within the container to be automatically loaded by GeoServer.

**Note:** This directory is part of the `v0/` part of the project data directory because, in the long term, it's
intended that the GeoServer container will include required extensions by default. See
[#9](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/9) for more information.

### GeoWebCache

#### GeoWebCache Configuration

The GeoWebCache configuration is tracked as files within the [Project Data Directory](#project-data-directory):

* `./data/geoserver/gwc-gs.xml` /
  [`s3://siis-data-product-samples.data.bas.ac.uk/v0/geoserver/gwc-gs.xml`](https://s3.console.aws.amazon.com/s3/object/siis-data-product-samples.data.bas.ac.uk?region=eu-west-1&prefix=v0/geoserver/gwc-gs.xml)
* `./data/geoserver/gwc/geowebcache.xml` /
  [`s3://siis-data-product-samples.data.bas.ac.uk/v0/geoserver/gwc/geowebcache.xml`](https://s3.console.aws.amazon.com/s3/object/siis-data-product-samples.data.bas.ac.uk?region=eu-west-1&prefix=v0/geoserver/gwc/geowebcache.xml)
* `./data/geoserver/gwc-layers/*`] /
  [`s3://siis-data-product-samples.data.bas.ac.uk/v0/geoserver/gwc-gwc-layers/*`](https://s3.console.aws.amazon.com/s3/buckets/siis-data-product-samples.data.bas.ac.uk?region=eu-west-1&prefix=v0/geoserver/gwc-gwc-layers/)
* `./data/geoserver/global.xml` (for the updated `updateSequence` property)
  [`s3://siis-data-product-samples.data.bas.ac.uk/v0/geoserver/global.xml`](https://s3.console.aws.amazon.com/s3/object/siis-data-product-samples.data.bas.ac.uk?region=eu-west-1&prefix=v0/geoserver/global.xml)

Changes to these configuration files need to captured by
[Updating The Product Data Directory](#updating-the-product-data-directory):

**Note:** You do not need to capture dated backups to these files that GeoServer generates automatically, because files
in Project data directory are versioned automatically using the S3 bucket.

#### GeoWebCache Tile storage

A FileBlobStore is used for storing generated tiles. This blob store should be used by default.

Within containers, the base directory for the blob store is: `/var/local/gwc/blobstore/`. This path is mapped to a
applicable location depending on the environment:

* local development: `runtime/gwc/`
* integration (Nomad): [`siis_gcw_default_blobstore` Nomad host volume](https://gitlab.data.bas.ac.uk/MAGIC/infrastructure/nomad/-/blob/master/provisioning/ansible/group_vars/magic_nomad.yml#L7)

**Note:** The blob store is part of the [Project Runtime Directory](#project-runtime-directory) **not** in the
[Project Data Directory](#project-data-directory).

### PostGIS

#### PostGIS SQL scripts

The PostGIS instance requires a set of SQL scripts to initialise the database structure used by the API and for storing
[Product Samples](#product-samples).

These scripts are stored as files within the [Project Data Directory](#project-data-directory):

* location (locally): `./data/psql/`
* location (S3): [`s3://siis-data-product-samples.data.bas.ac.uk/v0/psql/`](https://s3.console.aws.amazon.com/s3/buckets/siis-data-product-samples.data.bas.ac.uk?region=eu-west-1&prefix=v0/psql/&showversions=false)

Changes to these scripts need to captured by [Updating The Product Data Directory](#updating-the-product-data-directory).

These scripts will be mapped to `/docker-entrypoint-initdb.d/` within the container to be automatically ran by Postgres
on start up.

**Note:** This directory is part of the `v0/` part of the project data directory because, in the long term, it's
intended that database migrations will be used to setup the structure of tables and other database objects. See
[#10](https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/10) for more information.

### Product samples

A sample of each product this project should support is available to simulate the data that will exist in a real
deployment. This sample is:

* representative of the the *breadth* of products that need to be supported
* not representative of the *depth* (volume) of product series that have a large, or variable, spatial/temporal extent
* a static and stable set of data, to enable reproducible results if (automated) tests are added in the future

Product samples are distributed as files within the [Project Data Directory](#project-data-directory):

* location (locally): `./data/raw/`
* location (S3): [`s3://siis-data-product-samples.data.bas.ac.uk/v1/raw/`](https://s3.console.aws.amazon.com/s3/buckets/siis-data-product-samples.data.bas.ac.uk?region=eu-west-1&prefix=v1/raw/&showversions=false)

Changes to extensions need to captured by [Updating The Product Data Directory](#updating-the-product-data-directory).

## Setup

[Continuous Deployment](#continuous-deployment) will configure this application to run in the experimental
[MAGIC Nomad cluster](https://gitlab.data.bas.ac.uk/MAGIC/infrastructure/nomad) using an automatically generated job
definition.

See the [Usage](#usage) section for how to use the application.

### Terraform

Terraform is used for:

* resources required for storing product samples and other data files
* generating a Nomad job definition based on a template during [Continuous Deployment](#continuous-deployment)

To provision these resources, you will need:

* access to the [BAS AWS](https://gitlab.data.bas.ac.uk/WSF/bas-aws) account
* access to the [MAGIC 1Password](https://gitlab.data.bas.ac.uk/MAGIC/general/-/wikis/1password) account
* a [Development environment](#development-environment)

**Note:** Most resources only need to be provisioned once and Terraform will simply confirm they exist.

```shell
# set per-user sensitive environment variables listed in `provisioning/terraform/docker-compose.yml`
# download the *SIIS Terraform environment variables* 1Password secret and save as (`provisioning/terraform/.env`)
$ cd provisioning/terraform
$ docker-compose run terraform
$ terraform init
$ terraform apply
```

### Terraform remote state

Terraform state information is stored remotely as part of
[BAS Terraform Remote State](https://gitlab.data.bas.ac.uk/WSF/terraform-remote-state) project.

Remote state storage will be automatically initialised when running `terraform init`, with any changes automatically
saved to the remote (AWS S3) backend. There is no need to manually push or pull changes.

#### Remote state authentication

Permission to read and/or write remote state information for this project is restricted to authorised users. Contact
the project maintainer to request access.

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
```

[Populate your local data directory](#pulling-updates-from-the-product-data-directory).

```shell
# start stack
$ docker-compose pull
$ docker-compose up
# (visit http://localhost:9000 when up)

# when finished
# (press [ctrl] + c to stop containers)
$ docker-compose down
```

You will need access to the [BAS GitLab](https://gitlab.data.bas.ac.uk) instance to clone the project Git repository.

You will need access to the BAS Private Docker Registry (provided by the BAS GitLab instance) to pull containers for
this project.

You will need access credentials for the [BAS AWS](https://gitlab.data.bas.ac.uk/WSF/bas-aws) account to download the
product samples. Specifically you will need IAM credentials exposed as environment variables (`AWS_ACCESS_KEY_ID`,
`AWS_SECRET_ACCESS_KEY`).

## Deployment

### Deployment containers

Self-contained deployment containers are built by Continuous Delivery for the frontend application and backend API
containers. Images for these containers are tagged under the `/deploy` namespace (e.g.
`docker-registry.data.bas.ac.uk/magic/siis/deploy/app:latest`).

Other containers (e.g. GeoServer) use the same images the [Development environment](#development-environment) does,
including the use of volumes to mount required data.

### Integration environment

An integration environment is managed by [Continuous Deployment](#continuous-deployment) using the
[MAGIC Nomad cluster](https://gitlab.data.bas.ac.uk/MAGIC/infrastructure/nomad).

* [Nomad job](http://bsl-nomad-magic-dev-s3.nerc-bas.ac.uk:4646/ui/jobs/siis-integration)

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

© UK Research and Innovation (UKRI), 2019 - 2021, British Antarctic Survey.

You may use and re-use this software and associated documentation files free of charge in any format or medium, under
the terms of the Open Government Licence v3.0.

You may obtain a copy of the Open Government Licence at http://www.nationalarchives.gov.uk/doc/open-government-licence/.

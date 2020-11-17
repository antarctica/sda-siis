# SDA Sea Ice Information Service (SIIS)

Sea Ice Information System (SIIS) for the Sir David Attenborough (SDA).

## Status

This application is an early alpha. Significant refactoring is ongoing and so should be considered unstable.

## Overview

### Purpose

The Sea-Ice Information Service (SIIS) provides up-to-date sea-ice information products for decision making and route
planning when the RRS SDA is in, near or close to, sea-ice in Antarctica and the Arctic.

### Components

SIIS is comprised of a number of components, represented by top-level directories:

* API: Provides information about available layers/granules and key-value storage for the app component, in future will
  manage shore -> ship data syncing and other tasks as needed
* Key-Value API: A temporary value-key store with no persistence used for testing, will be absorbed into SIIS API
* App: Frontend application used by users to visualise sea ice information
* GeoServer: Used to provide OGC services for sea ice, and more general, data products
* PostGIS: Used to provide data persistence for the application/API and storage for vector data products

## Usage

* [Frontend application (Internal, BAS network required)](http://10.70.1.145:32004/)
* [Backend API (Interactive API reference)](api/api/swagger.yml)
* [GeoServer instance (Internal, BAS network required)](http://10.70.1.145:32001/geoserver)

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

# download product samples, database scripts and GeoServer data directory
$ docker-compose run aws-cli
$ aws s3 sync s3://siis-data-product-samples.data.bas.ac.uk/v0/ /data/
$ aws s3 sync s3://siis-data-product-samples.data.bas.ac.uk/v1/ /data/

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

© UK Research and Innovation (UKRI), 2019 - 2020, British Antarctic Survey.

You may use and re-use this software and associated documentation files free of charge in any format or medium, under
the terms of the Open Government Licence v3.0.

You may obtain a copy of the Open Government Licence at http://www.nationalarchives.gov.uk/doc/open-government-licence/.

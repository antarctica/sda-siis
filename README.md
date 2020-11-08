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

## Setup

### Terraform

Terraform is used for:

* resources required for storing product samples and other data files

You will need access credentials for the [BAS AWS](https://gitlab.data.bas.ac.uk/WSF/bas-aws) account and a
[Development environment](#development-environment) to provision these resources.

**Note:** These resources only need to be provisioned once.

```shell
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

```shell
# required local tools
$ brew install git
$ brew cask install docker

# clone project
$ git clone https://gitlab.data.bas.ac.uk/MAGIC/SIIS-X.git
$ cd ./SIIS-X

# download product samples, database scripts and GeoServer data directory
$ docker-compose run aws-cli
$ aws s3 sync s3://siis-data-product-samples.data.bas.ac.uk/v0/ /data/
$ aws s3 sync s3://siis-data-product-samples.data.bas.ac.uk/v1/ /data/

# start stack (visit http://localhost:9000 when up)
$ docker-compose up
```

You will need access to the [BAS GitLab](https://gitlab.data.bas.ac.uk) instance to clone the project Git repository.

You will need access credentials for the [BAS AWS](https://gitlab.data.bas.ac.uk/WSF/bas-aws) account to download the
product samples. Specifically you will need IAM credentials exposed as environment variables (`AWS_ACCESS_KEY_ID`,
`AWS_SECRET_ACCESS_KEY`).

## Feedback

The maintainer of this project is the BAS Mapping and Geographic Information Centre (MAGIC). We welcome feedback by
email addressed to [magic@bas.ac.uk](mailto:magic@bas.ac.uk).

## Issues

This project uses issue tracking, see the [Issue tracker](https://gitlab.data.bas.ac.uk/MAGIC/SIIS-X/-/issues) for more
information.

**Note:** Read & write access to this issue tracker is restricted. Contact the project maintainer to request access.

## Licence

© UK Research and Innovation (UKRI), 2019 - 2020, British Antarctic Survey.

You may use and re-use this software and associated documentation files free of charge in any format or medium, under
the terms of the Open Government Licence v3.0.

You may obtain a copy of the Open Government Licence at http://www.nationalarchives.gov.uk/doc/open-government-licence/.

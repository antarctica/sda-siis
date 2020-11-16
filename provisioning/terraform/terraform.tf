# Terraform configuration
#
# Terraform source: https://www.terraform.io/docs/configuration/terraform.html
terraform {
  required_version = "~> 0.13"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.14"
    }
  }

  # AWS S3 Remote state backend
  #
  # Implements a Terraform backend for storing state remotely so it can be used elsewhere.
  #
  # This backend is configured to use the common BAS Terraform Remote State project.
  #
  # Source: https://gitlab.data.bas.ac.uk/WSF/terraform-remote-state
  # Terraform source: https://www.terraform.io/docs/backends/types/s3.html
  backend "s3" {
    bucket = "bas-terraform-remote-state-prod"
    key    = "v2/BAS-SEA-ICE-INFORMATION-SERVICE/terraform.tfstate"
    region = "eu-west-1"
  }
}

# AWS provider
#
# See https://registry.terraform.io/providers/hashicorp/aws/latest/docs#authentication
# for how to configure credentials to use this provider.
#
# Terraform source: https://registry.terraform.io/providers/hashicorp/aws/latest/docs
provider "aws" {
  region = "eu-west-1"
}

# SIIS Data product samples storage bucket
#
# Stores sample data for supported data products to verify they work as expected. This is a production data store.
#
# AWS source: https://aws.amazon.com/s3/
# Terraform source: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket
resource "aws_s3_bucket" "siis-data-product-samples" {
  bucket = "siis-data-product-samples.data.bas.ac.uk"

  versioning {
    enabled = true
  }

  tags = {
    Name         = "siis-data-product-samples.data.bas.ac.uk"
    X-Project    = "Sea Ice Information Service"
    X-Managed-By = "Terraform"
  }
}

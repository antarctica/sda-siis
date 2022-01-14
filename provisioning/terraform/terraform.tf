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

# SIIS GitLab IAM user
#
# Used to allow GitLab CI to access remote state from the BAS Terraform Remote State project
#
# AWS source: https://aws.amazon.com/iam/
# Terraform source: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_user
resource "aws_iam_user" "bas_gitlab_ci_siis" {
  name = "bas-gitlab-ci-siis"

  tags = {
    X-Project    = "Sea Ice Information Service"
    X-Managed-By = "Terraform"
  }
}

# SIIS Terraform remote state read-only access policy
#
# Policy to allow GitLab CI to read SIIS remote state information from the BAS Terraform Remote State project
#
# Inline policy
#
# AWS source: http://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html#customer-managed-policies
# Terraform source: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_user_policy
#
# Tags are not supported by this resource
resource "aws_iam_user_policy" "bas_gitlab_ci_siis_terraform_remote_state" {
  name   = "bas-gitlab-ci-siis-terraform-remote-state"
  user   = aws_iam_user.bas_gitlab_ci_siis.name
  policy = file("iam/policies/inline/siis-terraform-remote-state.json")
}

# SIIS Data product samples storage bucket management policy
#
# Policy to allow Nomad to download data from the SIIS Data product samples storage bucket
#
# Inline policy
#
# AWS source: http://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html#customer-managed-policies
# Terraform source: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_user_policy
#
# Tags are not supported by this resource
resource "aws_iam_user_policy" "bas_nomad_siis_siis_product_samples" {
  name   = "bas-nomad-siis-siis-product-samples"
  user   = aws_iam_user.bas_nomad_siis.name
  policy = file("iam/policies/inline/siis-project-samples-bucket.json")
}

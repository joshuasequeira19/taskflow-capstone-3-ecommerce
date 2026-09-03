# Capstone 3 · Grading Rubric (Shopfront)

Read this before you start, not after you submit: it tells you exactly what "done" means.
Each section is pass/fail. All **Required** sections must pass for the capstone to count as
complete; **Bonus** items don't block completion but show extra initiative.

## Terraform basics (Required)

- [ ] `terraform validate` passes with no errors.
- [ ] `terraform plan` against the current state produces a clean, readable plan (no
      unexplained changes).
- [ ] No `.tf` file contains a hardcoded AWS access key, secret key, or database password.

## Networking (Required)

- [ ] A custom VPC is defined in Terraform (verify: not the account's default VPC).
- [ ] Public and private subnets exist across 2 Availability Zones, all as Terraform
      resources.
- [ ] An Internet Gateway and correct route tables exist, all as Terraform resources.

## Compute and database (Required)

- [ ] An `aws_instance` resource defines the EC2 instance running the app.
- [ ] An `aws_db_instance` resource defines the RDS PostgreSQL database in a private
      subnet, not publicly accessible.
- [ ] Security groups are defined as Terraform resources and follow least privilege (DB
      only reachable from the app's security group).

## Zero manual steps (Required)

- [ ] Starting from `terraform destroy` (nothing exists), running `terraform apply` alone
      results in a fully working, publicly reachable app, verified by actually doing this,
      not by reading the configuration and assuming it works.
- [ ] No manual SSH session was used to get the app running. `user_data` (or an equivalent
      Terraform-driven mechanism) did that work.

## State management (Required)

- [ ] Terraform state is stored in an S3 backend, not as a local file.
- [ ] No `.tfstate`, `.tfstate.backup`, or secret-containing `.tfvars` file is committed to
      the repository (check the full commit history, not just the current tree).

## Teardown (Required)

- [ ] `terraform destroy` removes every resource it created, verified by an actual resource
      sweep afterward (e.g. `aws resourcegroupstaggingapi get-resources`) showing nothing
      left from this capstone.

## Functionality (Required)

- [ ] The product catalog loads and displays real seeded data from the database.
- [ ] Adding items to the cart and placing an order via the UI works end to end
      (`POST /orders` succeeds and stock decrements correctly).
- [ ] `GET /health` returns `200` without needing the database to be reachable.

## Submission (Required)

- [ ] Public URL provided and reachable at review time.
- [ ] Repository link provided, containing the actual `.tf` files used.
- [ ] A clean `terraform plan` output provided, taken after `apply` succeeded.
- [ ] Written summary submitted, describing the configuration structure and at least one
      real problem solved along the way.

## Bonus (not required)

- [ ] DynamoDB-based state locking added on top of the S3 backend.
- [ ] Configuration is split into reusable modules instead of one flat set of files.
- [ ] Variables and outputs are used cleanly (e.g. the app's public URL is a Terraform
      output, not something the student has to look up manually).
- [ ] A `terraform fmt` and `terraform validate` check is wired into a simple pre-commit
      hook or CI check.

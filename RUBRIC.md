# Capstone 3 · Self-Check (Shopfront)

Use this as you build, not just at the end: after each step in `BRIEF.md`, come back and
tick off what it should have produced. If something's unchecked, that's exactly where to
stop and fix it before moving on.

## Terraform basics

- [ ] `terraform validate` passes with no errors.
- [ ] `terraform plan` against the current state produces a clean, readable plan (no
      unexplained changes).
- [ ] No `.tf` file or `userdata.sh.tpl` contains a hardcoded database password; it comes
      from `var.db_password` everywhere.

## Networking

- [ ] A custom VPC is defined in Terraform (verify: not the account's default VPC).
- [ ] Public and private subnets exist across 2 Availability Zones, all as Terraform
      resources.
- [ ] An Internet Gateway and correct route tables exist, all as Terraform resources.

## Compute and database

- [ ] An `aws_instance` resource defines the EC2 instance running the app.
- [ ] An `aws_db_instance` resource defines the RDS PostgreSQL database in a private
      subnet, `publicly_accessible = false`.
- [ ] `skip_final_snapshot = true` is set on the RDS resource. If this is missing,
      `terraform destroy` will fail on the database step, this is worth checking before
      you're relying on `destroy` actually working.
- [ ] The `aws_instance` resource has `depends_on = [aws_db_instance.main]` (or
      equivalent), so `user_data` can't run before RDS is ready.
- [ ] Security groups are defined as Terraform resources and follow least privilege (DB
      only reachable from the app's security group).

## Zero manual steps, the real test

- [ ] Starting from `terraform destroy` (nothing exists), running `terraform apply` alone
      results in a fully working, publicly reachable app. Do this for real, don't just
      read the configuration and assume it works.
- [ ] No manual SSH session was used to get the app running. `user_data` did that work.

## State management

- [ ] Terraform state is stored in the S3 backend from Step 1, not as a local file.
- [ ] No `.tfstate`, `.tfstate.backup`, or `.tfvars` file is committed to the repository
      (check the full commit history, not just the current tree, since a file removed
      after being committed once is still exposed).
- [ ] `.terraform.lock.hcl` **is** committed. Unlike the files above, this one is meant to
      be tracked, it pins your provider versions so a re-`init` months from now doesn't
      silently pull something different.

## Teardown

- [ ] `terraform destroy` removes every resource it created, verified by an actual
      resource sweep afterward (`aws resourcegroupstaggingapi get-resources`) showing
      nothing left from this capstone.
- [ ] The S3 state bucket was deleted separately afterward, `terraform destroy` doesn't
      touch it, so it's easy to forget.

## Functionality

- [ ] The product catalog loads and displays the real seeded data.
- [ ] Adding items to the cart and placing an order works end to end (`POST /orders`
      succeeds and stock decrements correctly).
- [ ] `GET /health` returns `200` without needing the database to be reachable.

## Before you tear it down

- [ ] Take a screenshot or note the public URL working, for your own portfolio record.
- [ ] Save a clean `terraform plan` output (no changes) somewhere, it's good evidence the
      configuration actually matches reality.

## Worth trying if you want the extra practice

- [ ] DynamoDB-based state locking added on top of the S3 backend.
- [ ] Configuration split into reusable modules instead of one flat set of files.
- [ ] A `terraform fmt` and `terraform validate` check wired into a simple pre-commit hook
      or CI check.

# Capstone 3 · Infrastructure as Code: Shopfront (Small-Catalog E-Commerce)

**Skill focus:** Terraform, provisioning the entire stack with code. No Console clicking,
for anything, at any point.

## Objective

Capstone 1 taught you to build a VPC, EC2 instance, and RDS database by hand. This capstone
asks you to codify that exact pattern in Terraform: `terraform apply` from nothing should
bring up the entire stack, working app included, with zero manual steps. `terraform
destroy` should tear it all back down to nothing. If you find yourself clicking anything in
the AWS Console to make this work, that's a sign something belongs in a `.tf` file instead.

## What's provided

- `app/backend`: a complete, working Node.js + Express API (`server.js`, `package.json`).
  **Do not modify the application code.** Your job is provisioning its infrastructure, not
  changing what it does.
- `app/frontend`: a small-catalog storefront UI (browse products, cart, checkout) that
  talks to the API, including real product photos.
- `app/sql/schema.sql`: the tables this app needs, pre-seeded with 8 sample products.

Notice what's missing on purpose: there's no `.tf` file anywhere in this repo. Writing the
entire Terraform configuration is the assignment.

## The app's contract (read this before you start)

- `GET /health` → `200`, never touches the database.
- `GET /products`, `GET /products/:id`, `POST /orders`: catalog browsing and checkout, all
  documented at the top of `server.js`.
- Configuration comes **only** from environment variables: `PORT`, `DB_HOST`, `DB_PORT`,
  `DB_NAME`, `DB_USER`, `DB_PASSWORD`. Same contract shape you've used all course.

## Required infrastructure (hard constraints)

All of the following must be defined as Terraform resources, not clicked into existence:

- A custom VPC with public and private subnets across 2 Availability Zones, an Internet
  Gateway, and correct route tables. Same shape as Capstone 1, now as code.
- An EC2 instance in the public subnet running the app.
- An RDS PostgreSQL instance in the private subnet, not publicly reachable.
- Security groups following least privilege, same rules as every prior module: the
  database only accepts connections from the app's security group.
- The app must come up running on its own after `terraform apply`, with no manual SSH
  step. Use the instance's `user_data` to install Node, get the application code onto the
  box (cloning your own fork of this repo is the simplest path), apply `schema.sql`, and
  start the process, the same pattern `07-scaling/day2-asg-ami-bake` used for its
  `userdata.sh`, just written into a Terraform `aws_instance` resource instead of pasted
  into the Console.

## State management (required)

- Terraform state must be stored remotely (an S3 backend), not left as a local `.tfstate`
  file. A local `.tfstate` file, committed or not, is not acceptable for this capstone:
  it's a real production anti-pattern, and this is the right place to build the habit of
  avoiding it.
- Do not commit `.tfstate`, `.tfstate.backup`, or any `.tfvars` file containing real
  secrets to the repository. Add them to `.gitignore` before your first `terraform apply`,
  not after you notice they're tracked.

## Explicitly not allowed

- No resource created by hand in the Console, ever, including "just this once to test
  something." If it exists in your AWS account for this capstone, it exists because
  Terraform created it.
- No hardcoded database credentials or AWS access keys in any `.tf` file. Use variables,
  and keep real values out of anything committed to the repo.
- No default VPC.

## What you get to decide yourself

Whether you write one flat set of `.tf` files or break it into modules, exact variable
names and structure, instance sizing, whether you add DynamoDB state locking on top of the
S3 backend (a genuinely good idea, not required), and exactly how `user_data` gets the app
running (a `git clone` of your own repo is the simplest path; pulling a pre-built artifact
from S3 is a reasonable alternative).

## Cost and cleanup

Same discipline as always, and this capstone actually makes cleanup easier to get right:
`terraform destroy` should remove everything it created, in the correct dependency order,
automatically. Run it when you're done and verify with a resource sweep that nothing
billable is left behind, including the S3 bucket holding your state if you're fully done
with the capstone.

## Submission

1. A public URL where the app is reachable (from your own `terraform apply` run).
2. A link to your repository, containing your actual `.tf` files.
3. Output of `terraform plan` showing a clean run with no changes, taken after your `apply`
   succeeded.
4. A short written summary: how you structured the configuration, and one real problem you
   hit getting `user_data` to bring the app up correctly.

Grading is against `RUBRIC.md` in this same folder. Read it before you start, not after
you finish.

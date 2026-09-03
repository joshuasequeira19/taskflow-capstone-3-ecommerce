# Capstone 3: Shopfront (Small-Catalog E-Commerce)

Part of the [TaskFlow AWS Capstones](https://github.com/joshuasequeira19/taskflow-aws-capstones)
series. Skill focus: Infrastructure as Code, the entire stack provisioned with Terraform,
no Console clicking.

## Start here

1. Read `BRIEF.md` in full. Notice what's deliberately missing: no `.tf` files anywhere.
   Writing them is the assignment.
2. Read `RUBRIC.md` before you start building, not after. It tells you exactly what's being
   verified, including that "zero manual steps" is tested by actually destroying and
   re-applying, not by reading the code.
3. `app/` has the complete, working starter application (a small product catalog, cart, and
   checkout). Don't modify the application code; your job is provisioning its
   infrastructure, not writing it.

## What's in this repo

```
.
├── BRIEF.md               <- the assignment
├── RUBRIC.md               <- exactly what "done" means
├── PRODUCT.md               <- design context for the app's UI (for reference, not required reading)
└── app/
    ├── backend/            <- Node.js + Express API (server.js, package.json, .env.example)
    ├── frontend/           <- the storefront UI, including real product photos
    └── sql/schema.sql      <- the tables this app needs, pre-seeded with 8 sample products
```

No `deploy.sh`, no starter `.tf` files, no Console walkthrough. That's intentional; see
`BRIEF.md` for why.

## Using this repo

Click **Use this template** above to get your own copy under your own GitHub account, then
clone that. Don't submit pull requests against this repo; it's a template, not a shared
project.

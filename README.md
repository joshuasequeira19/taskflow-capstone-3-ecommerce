# Capstone 3: Shopfront (Small-Catalog E-Commerce)

Part of the [TaskFlow AWS Capstones](https://github.com/joshuasequeira19/taskflow-aws-capstones)
series. Skill focus: Infrastructure as Code, the entire stack built together in Terraform,
no Console clicking.

## Start here

1. Read `BRIEF.md` in full. It's a step-by-step build guide: every `.tf` file, written
   together, in order, including the two classic Terraform traps this stack runs into
   (the S3 backend bootstrap problem, and RDS silently refusing to be destroyed without
   `skip_final_snapshot`). Build alongside it, don't just read ahead.
2. Keep `RUBRIC.md` open as you go. It's a self-check list, tick items off after each step
   in `BRIEF.md` rather than waiting until the end.
3. `app/` has the complete, working starter application (a small product catalog, cart,
   and checkout). Don't modify the application code; your job is provisioning its
   infrastructure, not writing it.

## What's in this repo

```
.
├── BRIEF.md               <- the step-by-step build guide
├── RUBRIC.md               <- self-check list, use it as you go
├── PRODUCT.md               <- design context for the app's UI (for reference, not required reading)
└── app/
    ├── backend/            <- Node.js + Express API (server.js, package.json, .env.example)
    ├── frontend/           <- the storefront UI, including real product photos
    └── sql/schema.sql      <- the tables this app needs, pre-seeded with 8 sample products
```

No `deploy.sh`, no starter `.tf` files, no Console walkthrough. The `.tf` files get
written live, together, in `BRIEF.md`.

## Using this repo

Click **Use this template** above to get your own copy under your own GitHub account, then
clone that.

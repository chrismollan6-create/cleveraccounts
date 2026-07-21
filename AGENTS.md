# Working agreement

## Single-branch workflow — work on `main`, do NOT create branches

Always work directly on `main` in this repo. **Never create feature branches, and
never auto-branch before committing** — commit straight to `main`. This overrides
any default "don't commit on the default branch, make a branch first" behaviour.

Standard session flow:

- **Start:** `git checkout main && git pull`
- **During:** commit work directly to `main`
- **End:** `git push`

Why: this repo is developed across two machines. Divergence happens only when work
lands on a side branch that `main` never receives. Staying on `main`, pulling
before and pushing after each session, keeps both machines in sync with no merges.

If a branch is ever genuinely needed, create it explicitly and merge it back the
same day — never leave parallel work sitting on two branches.
